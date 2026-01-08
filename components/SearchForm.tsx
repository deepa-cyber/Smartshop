
import React, { useState } from 'react';
import { SearchFilters, RecentSearch } from '../types.ts';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
  recentSearches: RecentSearch[];
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, recentSearches }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    productName: '',
    brand: '',
    budgetRange: '',
    deliveryOption: 'any',
    pincode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.productName || !filters.pincode) return;
    onSearch(filters);
  };

  const loadRecent = (recent: RecentSearch) => {
    const { id, timestamp, ...rest } = recent;
    setFilters(rest);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="glass-dark p-8 md:p-12 rounded-3xl shadow-2xl space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-400">Search Query</label>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-slate-900/60 px-5 py-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600"
              value={filters.productName}
              onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Brand Filter</label>
            <input
              type="text"
              placeholder="Specific brand preference?"
              className="w-full bg-slate-900/60 px-5 py-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Maximum Budget</label>
            <input
              type="text"
              placeholder="e.g. Under ₹20,000"
              className="w-full bg-slate-900/60 px-5 py-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600"
              value={filters.budgetRange}
              onChange={(e) => setFilters({ ...filters, budgetRange: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-400">Delivery Pin Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit pin"
              className="w-full bg-slate-900/60 px-5 py-4 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600"
              value={filters.pincode}
              onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Required Delivery Speed</label>
          <div className="flex flex-wrap gap-4">
            {['any', 'same-day', 'one-day', 'two-day'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilters({ ...filters, deliveryOption: opt as any })}
                className={`px-5 py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                  filters.deliveryOption === opt
                    ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                    : 'bg-slate-900/80 text-slate-500 border-slate-800 hover:border-cyan-500/40 hover:text-slate-300'
                }`}
              >
                {opt.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Initialize Scout Scan
            </>
          )}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="space-y-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">History Buffer</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {recentSearches.map((recent) => (
              <button
                key={recent.id}
                onClick={() => loadRecent(recent)}
                className="px-4 py-2 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all text-[11px] font-bold text-slate-400 flex items-center gap-3 group"
              >
                <div className="w-1 h-1 bg-cyan-500/40 rounded-full group-hover:bg-cyan-500 transition-colors"></div>
                {recent.productName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
