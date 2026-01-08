
import React, { useState, useEffect } from 'react';
import { SearchFilters, RecentSearch } from '../types';

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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-dark p-8 rounded-2xl shadow-2xl space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-bold text-cyan-400/80">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Wireless Headphones"
              className="w-full bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700 text-cyan-50 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
              value={filters.productName}
              onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Brand (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Sony, Apple"
              className="w-full bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700 text-cyan-50 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Budget Range</label>
            <input
              type="text"
              placeholder="e.g. Under ₹5000"
              className="w-full bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700 text-cyan-50 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
              value={filters.budgetRange}
              onChange={(e) => setFilters({ ...filters, budgetRange: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-bold text-cyan-400/80">Pin Code</label>
            <input
              type="text"
              placeholder="e.g. 400001"
              className="w-full bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700 text-cyan-50 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
              value={filters.pincode}
              onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Delivery Speed</label>
          <div className="flex flex-wrap gap-4">
            {['any', 'same-day', 'one-day', 'two-day'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilters({ ...filters, deliveryOption: opt as any })}
                className={`px-4 py-2 rounded-md border text-[10px] uppercase tracking-widest font-bold transition-all ${
                  filters.deliveryOption === opt
                    ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-cyan-500/50'
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
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Scanning Markets...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Best Deals
            </>
          )}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="space-y-3 px-2">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Recently Searched</h3>
          <div className="flex flex-wrap gap-3">
            {recentSearches.map((recent) => (
              <button
                key={recent.id}
                onClick={() => loadRecent(recent)}
                className="px-3 py-1.5 rounded bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-[11px] text-slate-400 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-cyan-500 rounded-full group-hover:animate-pulse"></span>
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
