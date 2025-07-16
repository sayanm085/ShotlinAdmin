import React from 'react';
import { cn } from '@/lib/utils';

export default function InvoiceTabs({ activeTab, onTabChange, stats }) {
  const counts = stats?.counts || {
    total: 0,
    quotations: 0,
    advance: 0,
    final: 0
  };
  
  const tabs = [
    { id: 'all', label: 'All Invoices', count: counts.total },
    { id: 'quotation', label: 'Quotations', count: counts.quotations },
    { id: 'advance', label: 'Advance', count: counts.advance },
    { id: 'final', label: 'Final', count: counts.final }
  ];
  
  return (
    <div className="w-full flex border-b bg-slate-50 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-6 py-4 border-b-2 transition-all min-w-max",
            "text-sm font-medium whitespace-nowrap",
            activeTab === tab.id 
              ? "border-primary bg-white text-primary" 
              : "border-transparent hover:bg-slate-100 text-slate-700"
          )}
        >
          <span>{tab.label}</span>
          <span className={cn(
            "inline-flex items-center justify-center rounded-full w-6 h-6 text-xs",
            activeTab === tab.id 
              ? "bg-primary/10 text-primary" 
              : "bg-slate-200 text-slate-700"
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}