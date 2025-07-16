import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  ChevronDown, ChevronUp, Eye, Download, Send, FileText, 
  MoreHorizontal, ArrowUpDown, CheckCircle, Ban 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PDFExporter from '@/components/PDFExporter'; // Fixed import (removed curly braces)

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InvoiceTable({ invoices = [], onView }) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const sortedInvoices = React.useMemo(() => {
    if (!invoices.length) return [];
    
    const sortableInvoices = [...invoices];
    
    return sortableInvoices.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.issueDate);
        const dateB = new Date(b.issueDate);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortConfig.key === 'amount') {
        const amountA = a.summary?.total || 0;
        const amountB = b.summary?.total || 0;
        return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [invoices, sortConfig]);

  // Helper function for sort indicator
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-2 h-4 w-4" /> : 
      <ChevronDown className="ml-2 h-4 w-4" />;
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-blue-50 text-blue-600 border-blue-200",
      sent: "bg-yellow-50 text-yellow-600 border-yellow-200",
      viewed: "bg-purple-50 text-purple-600 border-purple-200",
      paid: "bg-green-50 text-green-600 border-green-200",
      overdue: "bg-red-50 text-red-600 border-red-200",
      cancelled: "bg-gray-50 text-gray-600 border-gray-200"
    };
    
    return (
      <Badge variant="outline" className={`${styles[status] || ""} border px-3 py-1 font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Fetch invoice details for PDF generation
  const fetchInvoiceDetails = async (id) => {
    setLoadingInvoice(true);
    setSelectedInvoice(id);
    
    try {
      const response = await axiosInstance.get(`/api/v1/invoice/${id}`);
      setInvoiceDetails(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to fetch invoice details for PDF generation');
      return null;
    } finally {
      setLoadingInvoice(false);
    }
  };

  // Handle download with PDFExporter
  const handleDownloadPdf = async (id) => {
    toast.loading('Preparing PDF...');
    const invoiceData = await fetchInvoiceDetails(id);
    
    if (invoiceData) {
      // The PDF will be automatically downloaded by the PDFExporter component
      // We just need to display the component temporarily
      toast.dismiss();
    } else {
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendEmail = async (id) => {
    try {
      toast.loading('Sending email...');
      const response = await axiosInstance.post(`/api/v1/invoice/${id}/send-email`);
      
      toast.dismiss();
      if (response.data.success) {
        toast.success("Invoice sent via email");
      } else {
        toast.error(response.data.message || "Failed to send email");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send email");
      console.error('Error sending email:', error);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      toast.loading('Updating status...');
      const response = await axiosInstance.patch(`/api/v1/invoice/${id}/status`, { status: 'paid' });
      
      toast.dismiss();
      if (response.data.success) {
        toast.success("Invoice marked as paid");
        // Reload data
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update status");
      console.error('Error updating status:', error);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No invoices found. Try adjusting your filters or create a new invoice.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Hidden PDF exporter that will be triggered when data is available */}
      {invoiceDetails && (
        <div className="hidden">
          <PDFExporter data={invoiceDetails} />
        </div>
      )}
      
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead onClick={() => handleSort('invoiceNumber')} className="cursor-pointer w-[180px]">
              <div className="flex items-center">
                Invoice # 
                {getSortIcon('invoiceNumber')}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('client')} className="cursor-pointer">
              <div className="flex items-center">
                Client
                {getSortIcon('client')}
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              Project
            </TableHead>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer hidden md:table-cell">
              <div className="flex items-center">
                Date
                {getSortIcon('date')}
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              Type
            </TableHead>
            <TableHead onClick={() => handleSort('amount')} className="cursor-pointer">
              <div className="flex items-center">
                Amount
                {getSortIcon('amount')}
              </div>
            </TableHead>
            <TableHead>
              Status
            </TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <TableRow key={invoice._id} className="group border-b hover:bg-slate-50">
              <TableCell className="font-medium">
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-primary" 
                  onClick={() => onView(invoice._id)}
                >
                  {invoice.invoiceNumber}
                </Button>
              </TableCell>
              <TableCell>
                {invoice.client?.name || 'N/A'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {invoice.project?.name || 'N/A'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(invoice.issueDate), 'dd MMM yyyy')}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {invoice.type === 'quotation' ? 'Quotation' : 
                 invoice.type === 'advance' ? 'Advance Payment' : 
                 invoice.type === 'final' ? 'Final Invoice' : invoice.type}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(invoice.summary?.total || 0)}
              </TableCell>
              <TableCell>
                {getStatusBadge(invoice.status)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onView(invoice._id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    
                    {/* Direct PDF download using PDFExporter */}
                    {invoiceDetails && selectedInvoice === invoice._id ? (
                      <PDFExporter data={invoiceDetails}>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          {loadingInvoice ? 'Preparing PDF...' : 'Download PDF'}
                        </DropdownMenuItem>
                      </PDFExporter>
                    ) : (
                      <DropdownMenuItem onClick={() => handleDownloadPdf(invoice._id)}>
                        <Download className="mr-2 h-4 w-4" />
                        {loadingInvoice && selectedInvoice === invoice._id ? 'Preparing PDF...' : 'Download PDF'}
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => handleSendEmail(invoice._id)}>
                      <Send className="mr-2 h-4 w-4" />
                      Send via Email
                    </DropdownMenuItem>
                    
                    {invoice.type === 'quotation' && (
                      <DropdownMenuItem onClick={() => navigate(`/invoice/convert/${invoice._id}`)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Convert to Invoice
                      </DropdownMenuItem>
                    )}
                    
                    {(invoice.status === 'sent' || invoice.status === 'viewed') && (
                      <DropdownMenuItem onClick={() => handleMarkPaid(invoice._id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    
                    {invoice.status === 'draft' && (
                      <DropdownMenuItem onClick={() => navigate(`/invoice/edit/${invoice._id}`)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    
                    {['draft', 'sent', 'viewed'].includes(invoice.status) && (
                      <DropdownMenuItem onClick={() => navigate(`/invoice/cancel/${invoice._id}`)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}