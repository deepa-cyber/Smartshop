
import React from 'react';
import { ComparisonResult as IComparisonResult } from '../types.ts';

interface ComparisonResultProps {
  result: IComparisonResult;
}

const ComparisonResult: React.FC<ComparisonResultProps> = ({ result }) => {
  const parseMarkdownTable = (text: string) => {
    const lines = text.trim().split('\n');
    const tableStartIndex = lines.findIndex(line => line.includes('|') && lines[lines.indexOf(line) + 1]?.includes('---'));
    
    if (tableStartIndex === -1) return null;

    const tableLines = [];
    let i = tableStartIndex;
    while (i < lines.length && lines[i].includes('|')) {
      tableLines.push(lines[i]);
      i++;
    }

    if (tableLines.length < 3) return null;

    const headers = tableLines[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    const rows = tableLines.slice(2).map(row => 
      row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim())
    ).filter(row => row.length > 0);

    const remainingText = lines.slice(i).join('\n');

    return { headers, rows, remainingText };
  };

  const parsedData = parseMarkdownTable(result.summary);

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mb-6 text-cyan-400 uppercase tracking-tight border-b border-cyan-500/10 pb-3">{trimmed.slice(2)}</h1>;
      if (trimmed.startsWith('## ')) return <h2 key={i} className="text-lg font-black mt-10 mb-4 text-cyan-300 flex items-center gap-3"><span className="w-1 h-6 bg-cyan-500"></span>{trimmed.slice(3)}</h2>;
      if (trimmed.startsWith('### ')) return <h3 key={i} className="text-md font-bold mt-8 mb-3 text-slate-100 uppercase tracking-wider">{trimmed.slice(4)}</h3>;
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <li key={i} className="ml-2 list-none text-slate-400 mb-3 flex items-start gap-3"><span className="text-cyan-500 mt-1">▶</span>{trimmed.slice(2)}</li>;
      if (trimmed === '') return null;
      return <p key={i} className="text-slate-400 mb-5 leading-relaxed font-medium">{trimmed}</p>;
    });
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-20">
      <div className="glass-dark p-8 md:p-12 rounded-[2rem] border border-cyan-500/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full"></div>
        
        {parsedData ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Comparison Matrix</h4>
            </div>
            
            <div className="overflow-x-auto -mx-8 md:-mx-12 px-8 md:px-12 mb-12">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-800">
                    {parsedData.headers.map((header, idx) => (
                      <th key={idx} className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/30">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {parsedData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-cyan-500/[0.03] transition-colors group">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="py-6 px-6 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="prose prose-invert max-w-none border-t border-slate-800/50 pt-10">
              {renderContent(parsedData.remainingText)}
            </div>
          </>
        ) : (
          <div className="prose prose-invert max-w-none">
            {renderContent(result.summary)}
          </div>
        )}
      </div>

      {result.sources.length > 0 && (
        <div className="space-y-8 px-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Retail Node Access</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.sources.map((source, idx) => (
              source.web && (
                <a
                  key={idx}
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col p-6 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-cyan-500 hover:bg-slate-900/80 transition-all shadow-lg overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 group-hover:text-cyan-400 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest font-black text-slate-600 group-hover:text-cyan-400">
                      {new URL(source.web.uri).hostname.replace('www.', '')}
                    </p>
                  </div>
                  <h5 className="text-sm font-bold text-slate-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                    {source.web.title}
                  </h5>
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonResult;
