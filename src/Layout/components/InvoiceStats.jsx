import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  FileClock, FileCheck, FileWarning, ArrowUpRight, ArrowDownRight,
  TrendingUp, CreditCard, Calendar, AlertCircle, ChevronRight,
  Percent, Banknote, ClipboardCheck, PieChart, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function InvoiceStats({ stats }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (!stats) return null;
  
  // Format currency amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format compact currency (for smaller displays)
  const formatCompactCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };
  
  // Calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  };
  
  // Get color based on value comparison
  const getStatusColor = (value, threshold) => {
    if (value === 0) return "text-green-500";
    if (value > threshold) return "text-red-500";
    return "text-amber-500";
  };
  
  const totalInvoices = stats.counts.total || 0;
  
  // Payment status calculations
  const pendingCount = stats.payments?.pending || 0;
  const partialCount = stats.payments?.partial || 0;
  const completedCount = stats.payments?.completed || 0;
  const overdueCount = stats.payments?.overdue || 0;
  
  // Calculate percentages for the donut chart segments
  const totalPaymentInvoices = pendingCount + partialCount + completedCount;
  const completedPercentage = totalPaymentInvoices ? Math.round((completedCount / totalPaymentInvoices) * 100) : 0;
  const partialPercentage = totalPaymentInvoices ? Math.round((partialCount / totalPaymentInvoices) * 100) : 0;
  const pendingPercentage = totalPaymentInvoices ? Math.round((pendingCount / totalPaymentInvoices) * 100) : 0;
  const overduePercentage = pendingCount ? Math.round((overdueCount / pendingCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Total Invoices Card */}
      <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
        <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-blue-400 to-blue-600" />
        <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-50 p-2 rounded-full">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-700">Total Invoices</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600"
            onClick={() => navigate('/invoice/type/all')}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">View all</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-bold text-slate-800">{totalInvoices}</div>
            {stats.recent?.total > 0 && (
              <div className="text-sm font-medium text-green-600 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+{stats.recent.total} this month</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-slate-500 mt-1">
            Distribution of invoice types
          </p>
          
          <div className="mt-4 space-y-3">
            <InvoiceTypeBar 
              label="Quotations" 
              value={stats.counts.quotations} 
              total={totalInvoices}
              color="bg-amber-500"
              animate={animate}
            />
            <InvoiceTypeBar 
              label="Advance" 
              value={stats.counts.advance} 
              total={totalInvoices}
              color="bg-violet-500"
              animate={animate}
              delay={0.1}
            />
            <InvoiceTypeBar 
              label="Final" 
              value={stats.counts.final} 
              total={totalInvoices}
              color="bg-blue-500"
              animate={animate}
              delay={0.2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Card */}
      <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
        <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-green-400 to-emerald-600" />
        <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-green-50 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-700">Payment Status</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-green-50 hover:text-green-600"
            onClick={() => navigate('/invoice/payments')}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">View payments</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-bold text-slate-800">
              {pendingCount + partialCount}
            </div>
            <div className="text-sm font-medium flex items-center">
              <span className={cn(getStatusColor(overdueCount, 0))}>
                {overdueCount > 0 ? (
                  <>
                    <AlertCircle className="mr-1 h-4 w-4 inline" />
                    {overdueCount} overdue
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="mr-1 h-4 w-4 inline" />
                    No overdue
                  </>
                )}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-1">
            {pendingCount > 0 ? `${pendingCount} pending and ${partialCount} partial payments` : 'No pending payments'}
          </p>
          
          {/* Payment status donut chart */}
          <div className="mt-4 flex items-center justify-between">
            <div className="relative h-24 w-24">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                
                {/* Completed segment */}
                {completedPercentage > 0 && (
                  <motion.circle 
                    cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="4"
                    strokeDasharray={`${completedPercentage} ${100 - completedPercentage}`}
                    strokeDashoffset="25"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={animate ? { strokeDasharray: `${completedPercentage} ${100 - completedPercentage}` } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                )}
                
                {/* Partial segment */}
                {partialPercentage > 0 && (
                  <motion.circle 
                    cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="4"
                    strokeDasharray={`${partialPercentage} ${100 - partialPercentage}`}
                    strokeDashoffset={`${125 - completedPercentage}`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={animate ? { strokeDasharray: `${partialPercentage} ${100 - partialPercentage}` } : {}}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                )}
                
                {/* Overdue segment */}
                {overduePercentage > 0 && (
                  <motion.circle 
                    cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="4"
                    strokeDasharray={`${overduePercentage} ${100 - overduePercentage}`}
                    strokeDashoffset={`${125 - completedPercentage - partialPercentage}`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={animate ? { strokeDasharray: `${overduePercentage} ${100 - overduePercentage}` } : {}}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-800">{completedPercentage}%</span>
                  <span className="block text-xs text-gray-500">completed</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 flex-1 ml-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <span className="text-xs font-medium">{completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-xs">Partial</span>
                </div>
                <span className="text-xs font-medium">{partialCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-slate-200 mr-2"></div>
                  <span className="text-xs">Pending</span>
                </div>
                <span className="text-xs font-medium">{pendingCount - overdueCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">Overdue</span>
                </div>
                <span className="text-xs font-medium">{overdueCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advance Payments Card */}
      <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
        <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-purple-400 to-indigo-600" />
        <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-50 p-2 rounded-full">
              <Percent className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-700">Advance Payments</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-purple-50 hover:text-purple-600"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advance payment statistics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-bold text-slate-800">
              {formatCompactCurrency(stats.advancePayments?.totalAmount || 0)}
            </div>
            <div className="text-sm font-medium text-indigo-600 flex items-center">
              <span>{stats.advancePayments?.count || 0} invoices</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-1">
            Average advance payment: {stats.advancePayments?.averagePercent || 0}%
          </p>
          
          {/* Advance payment visualization */}
          <div className="mt-6 relative pt-5">
            <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500" 
                initial={{ width: 0 }}
                animate={animate ? { width: `${stats.advancePayments?.averagePercent || 0}%` } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-600">
                  {stats.advancePayments?.averagePercent || 0}%
                </div>
                <div className="text-xs text-slate-500">Average</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {stats.finalPayments?.withAdvanceCount || 0}
                </div>
                <div className="text-xs text-slate-500">Final with Advance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {stats.conversion?.rate || 0}%
                </div>
                <div className="text-xs text-slate-500">Conversion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card - Full Width */}
      <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200 col-span-1 md:col-span-2 lg:col-span-3">
        <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
        <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-700">Recent Activity</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-purple-50 hover:text-purple-600"
            onClick={() => navigate('/invoice/recent')}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">View recent</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline space-x-3">
                <div className="text-2xl font-bold text-slate-800">
                  {stats.recent?.total || 0} New Invoices
                </div>
                <div className="text-sm font-medium text-purple-600 flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>This month</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mt-1">
                {stats.conversion?.quotationsWithInvoices || 0} quotations converted to invoices ({stats.conversion?.rate || 0}% conversion rate)
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-500">{stats.recent.quotations}</div>
                <div className="text-xs text-slate-500">Quotations</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-violet-500">{stats.recent.advance}</div>
                <div className="text-xs text-slate-500">Advance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">{stats.recent.final}</div>
                <div className="text-xs text-slate-500">Final</div>
              </div>
            </div>
          </div>
          
          {/* Recent invoices list */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentInvoices?.length > 0 ? (
              <>
                {stats.recentInvoices.map((invoice, i) => (
                  <motion.div 
                    key={invoice._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={animate ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                    onClick={() => navigate(`/invoice/${invoice._id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm",
                        invoice.type === 'quotation' ? "bg-gradient-to-br from-amber-400 to-amber-600" : 
                        invoice.type === 'advance' ? "bg-gradient-to-br from-violet-400 to-violet-600" : 
                        "bg-gradient-to-br from-blue-400 to-blue-600"
                      )}>
                        {invoice.type === 'quotation' ? 
                          <FileClock className="h-5 w-5" /> : 
                          invoice.type === 'advance' ? 
                          <Banknote className="h-5 w-5" /> : 
                          <FileCheck className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700 leading-none">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                          <span className={cn(
                            "inline-block w-2 h-2 rounded-full mr-1",
                            invoice.status === 'paid' ? "bg-green-500" : 
                            invoice.status === 'draft' ? "bg-amber-500" : 
                            "bg-blue-500"
                          )}></span>
                          {invoice.paymentInfo?.description || invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-800">
                      {formatCompactCurrency(invoice.summary?.total || 0)}
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 col-span-3 text-slate-500 bg-slate-50 rounded-lg">
                <FileWarning className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                <p className="text-sm">No recent invoices</p>
              </div>
            )}
          </div>
          
          {stats.recentInvoices?.length > 0 && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-slate-200 text-purple-600 hover:text-purple-700 hover:bg-purple-50 hover:border-purple-200"
                onClick={() => navigate('/invoice/recent')}
              >
                View all recent activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for invoice type bars with animation
function InvoiceTypeBar({ label, value, total, color, animate, delay = 0 }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{value} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          initial={{ width: 0 }}
          animate={animate ? { width: `${percentage}%` } : {}}
          transition={{ duration: 0.8, delay }}
        />
      </div>
    </div>
  );
}