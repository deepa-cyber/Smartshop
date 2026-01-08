
import React from 'react';
import { ComparisonResult as IComparisonResult } from '../types';

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
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mb-6 text-cyan-400 uppercase tracking-tighter border-b border-cyan-500/20 pb-2">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-cyan-300 flex items-center gap-2"><span className="w-1.5 h-6 bg-cyan-500"></span>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-slate-200">{line.slice(4)}</h3>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-none text-slate-400 mb-2 flex items-start gap-2"><span className="text-cyan-500 font-bold mt-1">»</span>{line.slice(2)}</li>;
      if (line.trim() === '') return null;
      return <p key={i} className="text-slate-400 mb-4 leading-relaxed font-medium">{line}</p>;
    });
  };

  return (
    <div className="space-y-12 animate-fadeIn relative">
      <div className="glass-dark p-6 md:p-10 rounded-3xl border border-cyan-500/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {parsedData ? (
          <>
            <div className="overflow-x-auto mb-10 -mx-6 md:-mx-10 px-6 md:px-10">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-cyan-500/30">
                    {parsedData.headers.map((header, idx) => (
                      <th key={idx} className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/5">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {parsedData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-cyan-500/5 transition-colors group">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="py-5 px-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="prose prose-invert max-w-none border-t border-slate-800 pt-8">
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
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-cyan-400 flex items-center gap-2">
              Purchase Access Nodes
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.sources.map((source, idx) => (
              source.web && (
                <a
                  key={idx}
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col p-5 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 group-hover:text-cyan-400">
                      {new URL(source.web.uri).hostname.replace('www.', '')}
                    </p>
                  </div>
                  <h5 className="text-sm font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-white">
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
