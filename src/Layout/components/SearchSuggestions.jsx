import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, X, ArrowRight, File, User, Briefcase, 
  Clock, Calendar, ChevronRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function SearchSuggestions({ 
  suggestions = [], 
  onSelect, 
  onClose, 
  onAdvancedSearch,
  searchQuery = '', 
  isLoading = false 
}) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inputRef = useRef(null);
  
  // State for keyboard navigation
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });
  
  // Effect to handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!ref.current) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => 
            Math.min(prev + 1, suggestions.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[activeIndex]) {
            onSelect(suggestions[activeIndex]);
            // Save to recent searches
            addToRecentSearches(suggestions[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, suggestions, onSelect, onClose]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Add to recent searches
  const addToRecentSearches = (item) => {
    const updatedRecent = [
      {
        id: item._id,
        text: item.invoiceNumber || item.primaryText.replace(/<[^>]+>/g, ''),
        type: item.type || 'invoice',
        timestamp: new Date().toISOString()
      },
      ...recentSearches.filter(i => i.id !== item._id).slice(0, 4)
    ];
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
  };
  
  // Get icon based on type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'client':
        return <User className="h-4 w-4" />;
      case 'project':
        return <Briefcase className="h-4 w-4" />;
      case 'quotation':
        return <File className="h-4 w-4 text-amber-500" />;
      case 'advance':
        return <File className="h-4 w-4 text-purple-500" />;
      case 'final':
        return <File className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  // Get badge based on status
  const getStatusBadge = (status) => {
    const variants = {
      draft: "bg-blue-50 text-blue-600 border-blue-200",
      sent: "bg-yellow-50 text-yellow-600 border-yellow-200", 
      viewed: "bg-purple-50 text-purple-600 border-purple-200",
      paid: "bg-green-50 text-green-600 border-green-200",
      overdue: "bg-red-50 text-red-600 border-red-200"
    };
    
    return (
      <Badge variant="outline" className={`${variants[status] || ""} text-xs h-5 px-1.5`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, item) => {
    const type = item.type || 'invoice';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15 }}
        ref={ref}
        className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden max-h-[400px] overflow-y-auto"
        style={{ 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <Command className="border-0 shadow-none rounded-none">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <CommandInput
              ref={inputRef}
              placeholder="Search invoices, clients, projects..."
              value={searchQuery}
              className="placeholder:text-muted-foreground focus:outline-none border-0 ring-0 p-0 text-sm"
              readOnly
            />
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2 text-muted-foreground" />
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 ml-auto shrink-0" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {/* Invoice results */}
                {Object.entries(groupedSuggestions).map(([type, items]) => (
                  <CommandGroup key={type} heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
                    {items.map((suggestion, index) => (
                      <CommandItem
                        key={suggestion._id}
                        onSelect={() => {
                          onSelect(suggestion);
                          addToRecentSearches(suggestion);
                        }}
                        className={`flex items-start p-2 cursor-pointer ${activeIndex === index ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                      >
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 shrink-0">
                          {getTypeIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div 
                              className="text-sm font-medium truncate max-w-[70%]"
                              dangerouslySetInnerHTML={{ __html: suggestion.primaryText }}
                            />
                            {suggestion.status && getStatusBadge(suggestion.status)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            {suggestion.date && (
                              <span className="flex items-center mr-3">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(suggestion.date), 'dd MMM yyyy')}
                              </span>
                            )}
                            <span className="truncate">{suggestion.secondaryInfo}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 self-center ml-2" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
                
                {/* View all results button */}
                <div className="p-2 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={onAdvancedSearch}
                  >
                    <span>View all results</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : searchQuery.length >= 2 ? (
              <CommandEmpty className="py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="h-10 w-10 mb-2 text-slate-300" />
                  <p className="text-sm">No results found for "<span className="font-medium">{searchQuery}</span>"</p>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="mt-2"
                    onClick={onAdvancedSearch}
                  >
                    Try advanced search
                  </Button>
                </div>
              </CommandEmpty>
            ) : (
              <>
                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <CommandGroup heading="Recent Searches">
                    {recentSearches.map((item, index) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => navigate(`/invoice/${item.id}`)}
                        className="flex items-center py-2 px-2"
                      >
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="flex-1 truncate text-sm">{item.text}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.timestamp), 'dd MMM')}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {/* Popular searches or categories */}
                <CommandGroup heading="Suggestions">
                  <CommandItem 
                    onSelect={() => navigate('/invoice/type/quotation')} 
                    className="flex items-center"
                  >
                    <File className="h-4 w-4 mr-2 text-amber-500" />
                    <span>All Quotations</span>
                  </CommandItem>
                  <CommandItem 
                    onSelect={() => navigate('/invoice/status/overdue')} 
                    className="flex items-center"
                  >
                    <File className="h-4 w-4 mr-2 text-red-500" />
                    <span>Overdue Invoices</span>
                  </CommandItem>
                  <CommandItem 
                    onSelect={() => navigate('/invoice/recent')} 
                    className="flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Recent Invoices</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
          
          {/* Footer with advanced search button */}
          <div className="px-2 py-1.5 border-t text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center">
              <span>Press</span>
              <kbd className="ml-1 mr-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">↑</kbd>
              <kbd className="ml-0.5 mr-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">↓</kbd>
              <span>to navigate,</span>
              <kbd className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">Enter</kbd>
              <span className="ml-1">to select</span>
            </div>
            <div>
              {format(new Date('2025-07-13 17:57:38'), 'hh:mm a')} • sayanm085
            </div>
          </div>
        </Command>
      </motion.div>
    </AnimatePresence>
  );
}