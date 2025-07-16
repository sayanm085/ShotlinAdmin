import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  PlusCircle, Filter, Download, Search, ArrowUpRight, ArrowDownRight,
  FileText, CreditCard, Percent, Calendar, ChevronRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from '@/components/DateRangePicker';

// Custom Components
import InvoiceTable from './components/InvoiceTable';
import SearchSuggestions from './components/SearchSuggestions.jsx';
import InvoiceTabs from './components/InvoiceTabs.jsx';

export default function InvoiceDashboard() {
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const isFetchingRef = useRef(false);
  
  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch invoices with filters
  const fetchInvoices = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (dateRange.from && dateRange.to) {
        params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
        params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      // Add pagination
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      const response = await axiosInstance.get(`/api/v1/invoice/type/${activeTab}`, { params });
      
      if (response.data?.success) {
        setInvoices(response.data.data?.invoices || []);
        // Update pagination info
        if (response.data.data?.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.data.pagination.total || 0,
            pages: response.data.data.pagination.pages || 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Silent fail for network errors
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [activeTab, dateRange.from, dateRange.to, statusFilter, pagination.page, pagination.limit]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/v1/invoice/stats');
      
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    // Skip the first render to avoid double data fetch
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Add slight delay to batch API calls
    const timer = setTimeout(() => {
      fetchInvoices();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchInvoices]);

  // Fetch stats on initial mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  // Initial data fetch
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Debounced search handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle search suggestions
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/invoice/search/suggestions', {
        params: { q: searchQuery }
      });
      
      if (response.data?.success) {
        setSuggestions(response.data.data?.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Event handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    navigate(`/invoice/${suggestion._id}`);
    setShowSuggestions(false);
  }, [navigate]);

  const handleCreateInvoice = useCallback((type) => {
    navigate(`/invoice/create/${type}`);
  }, [navigate]);

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      toast.loading('Preparing export...');
      
      const params = new URLSearchParams();
      
      if (activeTab !== 'all') {
        params.append('type', activeTab);
      }
      
      if (dateRange.from && dateRange.to) {
        params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
        params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await axiosInstance.get('/api/v1/invoice/export', {
        params,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success("Invoices exported successfully");
    } catch (error) {
      console.error('Error exporting invoices:', error);
      toast.dismiss();
      toast.error("Failed to export invoices");
    }
  }, [activeTab, dateRange.from, dateRange.to, statusFilter]);

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const username = 'sayanm085'; // Updated to match the user info in the prompt

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your invoices in one place
          </p>
        </div>
        
        <Button 
          onClick={() => handleCreateInvoice('quotation')}
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>
      
      {/* Stats Cards - Redesigned as per the image */}
      {!stats ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
          {/* Total Invoices Card */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-md">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">
                  {stats.counts.total}
                </div>
                {stats.recent && stats.recent.total > 0 && (
                  <div className="text-sm font-medium text-green-600 flex items-center">
                    <span>+{stats.recent.total}</span>
                    <span className="text-gray-500 ml-1">this month</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                Distribution of invoice types
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Quotations</span>
                  <span className="text-xs font-medium">{stats.counts.quotations} ({calculatePercentage(stats.counts.quotations, stats.counts.total)}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${calculatePercentage(stats.counts.quotations, stats.counts.total)}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Advance</span>
                  <span className="text-xs font-medium">{stats.counts.advance} ({calculatePercentage(stats.counts.advance, stats.counts.total)}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${calculatePercentage(stats.counts.advance, stats.counts.total)}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Final</span>
                  <span className="text-xs font-medium">{stats.counts.final} ({calculatePercentage(stats.counts.final, stats.counts.total)}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${calculatePercentage(stats.counts.final, stats.counts.total)}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Status Card */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-md">
                  <CreditCard className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">
                  {stats.payments.pending}
                </div>
                <div className="text-sm font-medium flex items-center">
                  {stats.payments.overdue > 0 ? (
                    <div className="text-red-500 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>{stats.payments.overdue} overdue</span>
                    </div>
                  ) : (
                    <div className="text-green-500 flex items-center">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>No overdue</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-1 text-xs text-gray-500">
                {stats.payments.pending} pending and {stats.payments.partial} partial payments
              </div>
              
              <div className="mt-4 flex items-start justify-between">
                <div className="space-y-2 w-8/12">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-xs flex items-center justify-between w-full">
                      <span>Completed</span>
                      <span className="font-medium">{calculatePercentage(stats.payments.completed, (stats.payments.pending + stats.payments.partial + stats.payments.completed))}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="text-xs flex items-center justify-between w-full">
                      <span>Partial</span>
                      <span className="font-medium">{stats.payments.partial}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="text-xs flex items-center justify-between w-full">
                      <span>Pending</span>
                      <span className="font-medium">{stats.payments.pending}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="text-xs flex items-center justify-between w-full">
                      <span>Overdue</span>
                      <span className="font-medium">{stats.payments.overdue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-4/12 flex justify-center">
                  <div className="w-16 h-16 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ 
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`, 
                      opacity: calculatePercentage(stats.payments.completed, (stats.payments.pending + stats.payments.partial + stats.payments.completed)) / 100
                    }}></div>
                    <span className="text-sm font-medium">
                      {calculatePercentage(stats.payments.completed, (stats.payments.pending + stats.payments.partial + stats.payments.completed))}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Advance Payment Card */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-md">
                  <Percent className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Advance Payment</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">
                  ₹{(stats.advancePayments?.totalAmount / 100000).toFixed(1)}L
                </div>
              </div>
              
              <div className="mt-1 text-xs text-gray-500">
                Average advance payment: {stats.advancePayments?.averagePercent || 0}%
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${stats.advancePayments?.averagePercent || 0}%` }}></div>
                </div>
                
                <div className="pt-2 flex justify-between">
                  <div>
                    <div className="text-lg font-semibold">{stats.advancePayments?.averagePercent || 0}%</div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  
                  <div>
                    <div className="text-lg font-semibold">
                      {stats.finalPayments?.withAdvanceCount || 0}
                    </div>
                    <div className="text-xs text-gray-500">Final with<br/>Advance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Card */}
      <Card className="mb-8 overflow-hidden border border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-md">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/invoice/recent')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-bold">
                {stats?.recent?.total || 0} New Invoices
              </div>
              <div className="text-sm text-purple-500">
                This month
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-500">{stats?.recent?.quotations || 0}</div>
                <div className="text-sm text-gray-500">Quotations</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-500">{stats?.recent?.advance || 0}</div>
                <div className="text-sm text-gray-500">Advance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">{stats?.recent?.final || 0}</div>
                <div className="text-sm text-gray-500">Final</div>
              </div>
            </div>
          </div>
          
          {/* Recent invoices preview */}
          {stats?.recentInvoices && stats.recentInvoices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentInvoices.slice(0, 3).map((invoice) => (
                <Card 
                  key={invoice._id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/invoice/${invoice._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {invoice.paymentInfo?.description || invoice.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{(invoice.summary.total / 1000).toFixed(1)}K
                        </div>
                        <div className={`text-xs mt-1 ${invoice.status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                          {invoice.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {(!stats?.recentInvoices || stats.recentInvoices.length === 0) && (
            <div className="text-center py-10 text-gray-500">
              No recent activity
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search invoices, clients, projects..." 
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          />
          {showSuggestions && (
            <SearchSuggestions 
              suggestions={suggestions} 
              onSelect={handleSuggestionClick}
              onClose={() => setShowSuggestions(false)}
              onAdvancedSearch={() => navigate('/invoice/search', { state: { query: searchQuery } })}
            />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DateRangePicker 
            date={dateRange}
            onChange={handleDateRangeChange}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter === 'all' ? 'Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusFilterChange('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('draft')}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('sent')}>
                Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('paid')}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilterChange('overdue')}>
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Invoice Tabs and Table */}
      <Card>
        {/* Improved Invoice Tabs Component */}
        <InvoiceTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          stats={stats} 
        />
        
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <InvoiceTable 
              invoices={invoices} 
              onView={(id) => navigate(`/invoice/${id}`)}
            />
          )}
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {invoices.length} of {pagination.total || 0} invoices
          </div>
          
          {/* Pagination */}
          {(pagination.pages > 1) && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Footer with metadata */}
      <div className="mt-8 text-xs text-muted-foreground text-center">
        <p>Last updated: {currentTime} • User: {username}</p>
      </div>
    </div>
  );
}

// Helper function to calculate percentages
function calculatePercentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}