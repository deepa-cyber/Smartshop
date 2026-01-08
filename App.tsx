
import React, { useState, useEffect, useRef } from 'react';
import SearchForm from './components/SearchForm.tsx';
import ComparisonResult from './components/ComparisonResult.tsx';
import { SearchFilters, ComparisonResult as IComparisonResult, RecentSearch } from './types.ts';
import { searchProducts } from './services/geminiService.ts';

const STORAGE_KEY = 'smartshop_history_v2';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingIntervalRef = useRef<number | null>(null);

  const steps = [
    "Establishing secure link to retail APIs...",
    "Scanning Amazon database for live price nodes...",
    "Retrieving FlipKart review sentiment data...",
    "Checking Myntra logistics for regional availability...",
    "Cross-referencing best-in-class ratings...",
    "Synthesizing optimal delivery pathways...",
    "Generating final comparison matrix..."
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Memory Buffer Corrupted");
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      loadingIntervalRef.current = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % steps.length);
      }, 2000);
    } else if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [isLoading]);

  const saveToHistory = (filters: SearchFilters) => {
    const newEntry: RecentSearch = {
      ...filters,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    const updated = [newEntry, ...recentSearches]
      .filter((v, i, a) => a.findIndex(t => t.productName.toLowerCase() === v.productName.toLowerCase()) === i)
      .slice(0, 8);
      
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await searchProducts(filters);
      setResult(data);
      saveToHistory(filters);
      setTimeout(() => {
        document.getElementById('results-viewport')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "System Failure: Intelligence retrieval blocked.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="border-b border-cyan-500/10 sticky top-0 z-50 glass-dark">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Smart<span className="text-cyan-500">Shop</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_5px_#f97316]"></span> AMZN</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></span> FLPKT</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_5px_#ec4899]"></span> MYNTRA</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-16 space-y-24">
        <section className="text-center space-y-6 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
            Advanced <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Market Scan</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-semibold tracking-wider uppercase text-[10px]">
            Comparative retail intelligence engine optimized for Indian market logistics.
          </p>
        </section>

        <section className="max-w-4xl mx-auto space-y-16">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            recentSearches={recentSearches} 
          />

          <div id="results-viewport" className="scroll-mt-24">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center gap-4 animate-shake">
                <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm font-bold uppercase tracking-wide">{error}</div>
              </div>
            )}

            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center space-y-12">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full"></div>
                  <div className="absolute inset-2 border-t-4 border-cyan-500 rounded-full animate-spin-fast shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
                  <div className="absolute inset-8 border-b-2 border-blue-400 rounded-full animate-spin-reverse opacity-60"></div>
                  <div className="absolute inset-14 border-2 border-dashed border-cyan-500/20 rounded-full animate-spin-slow"></div>
                  
                  <div className="relative w-24 h-24 bg-cyan-500/5 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent animate-glitch"></div>
                    <svg className="w-12 h-12 text-cyan-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="max-w-md w-full text-center space-y-6">
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-black text-cyan-400 tracking-[0.4em] animate-pulse">Scanning Data Nodes</div>
                    <p className="text-slate-200 font-bold uppercase tracking-tight h-6 overflow-hidden transition-all duration-500">
                      {steps[loadingStep]}
                    </p>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-700 ease-out shadow-[0_0_10px_#22d3ee]" 
                      style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {result && <ComparisonResult result={result} />}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glass-dark border-t border-cyan-500/10 py-4 px-8 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> System Online</span>
            <span className="hidden sm:inline">Region: AP-SOUTH-1</span>
          </div>
          <div className="text-cyan-500/60">Ready for Search Operations</div>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-fast { animation: spin-fast 1.2s linear infinite; }
        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .animate-spin-reverse { animation: spin-reverse 2s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 5s linear infinite; }
        @keyframes glitch { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-glitch { animation: glitch 2s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.15; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
