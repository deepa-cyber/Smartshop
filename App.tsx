
import React, { useState, useEffect, useRef } from 'react';
import SearchForm from './components/SearchForm';
import ComparisonResult from './components/ComparisonResult';
import { SearchFilters, ComparisonResult as IComparisonResult, RecentSearch } from './types';
import { searchProducts } from './services/geminiService';

const STORAGE_KEY = 'smartshop_history';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingIntervalRef = useRef<number | null>(null);

  const steps = [
    "Establishing encrypted connection to retailer hubs...",
    "Crawling Amazon.in for live pricing data...",
    "Scanning Flipkart.com review databases...",
    "Aggregating Myntra.com logistics availability...",
    "Calculating optimal delivery routes for your sector...",
    "Applying deal-matching algorithms...",
    "Finalizing top 3 product comparison..."
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      loadingIntervalRef.current = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % steps.length);
      }, 2500);
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
      .filter((v, i, a) => a.findIndex(t => t.productName === v.productName) === i)
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
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-viewport')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="border-b border-cyan-500/10 sticky top-0 z-50 glass-dark">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-widest text-white uppercase italic">
                Smart<span className="text-cyan-500">Shop</span>
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> AMAZON</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> FLIPKART</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> MYNTRA</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 space-y-20">
        {/* Intro */}
        <section className="text-center space-y-6 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -z-10"></div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Your AI <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Shopping Scout</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium tracking-wide uppercase text-[11px] opacity-80">
            Instantly compare the top 3 best-rated products across major retailers with live pricing and delivery tracking.
          </p>
        </section>

        {/* Core Interface */}
        <section className="max-w-4xl mx-auto space-y-16">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            recentSearches={recentSearches} 
          />

          <div id="results-viewport" className="scroll-mt-24">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-2xl flex items-center gap-4 animate-shake">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-red-500">Search Error</h4>
                  <p className="text-sm opacity-80 font-medium">{error}</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center space-y-12">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Outer Pulsing Ring */}
                  <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-pulse-slow"></div>
                  
                  {/* Rotating Scanning Rings */}
                  <div className="absolute inset-2 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin-fast"></div>
                  <div className="absolute inset-6 border-l-2 border-r-2 border-blue-500/60 rounded-full animate-spin-reverse"></div>
                  <div className="absolute inset-10 border-2 border-dashed border-cyan-500/30 rounded-full animate-spin-slow"></div>

                  {/* Core Hologram */}
                  <div className="relative w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent animate-glitch-y"></div>
                    <svg className="w-10 h-10 text-cyan-500 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Scanning HUD Lines */}
                  <div className="absolute -left-12 top-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                  <div className="absolute -right-12 top-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                </div>

                <div className="max-w-md w-full space-y-6 text-center">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-black tracking-[0.3em] text-cyan-400 animate-pulse">
                      Status: Deep Scan Active
                    </div>
                    <div className="h-6 overflow-hidden">
                      <p className="text-slate-200 font-bold tracking-tight animate-slide-up">
                        {steps[loadingStep]}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar HUD */}
                  <div className="relative w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-700 ease-out shadow-[0_0_10px_#22d3ee]" 
                      style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                    ></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-shimmer"></div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] uppercase font-bold text-slate-500 tracking-widest">
                    <span>Sector-Mapping: {Math.round(((loadingStep + 1) / steps.length) * 100)}%</span>
                    <span>Node: IN_RETAIL_0{loadingStep + 1}</span>
                  </div>
                </div>
              </div>
            )}

            {result && <ComparisonResult result={result} />}
          </div>
        </section>
      </main>

      {/* Footer HUD */}
      <footer className="fixed bottom-0 left-0 right-0 glass-dark border-t border-cyan-500/10 py-4 px-6 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Market Feed: Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Location: India-Region</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">
            SmartShop v3.0 // Ready
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(0.98); }
          50% { opacity: 0.4; transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes glitch-y {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-glitch-y {
          animation: glitch-y 1.5s linear infinite;
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .animate-slide-up {
          animation: slide-up 2.5s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
