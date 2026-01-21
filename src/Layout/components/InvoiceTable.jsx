import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  ChevronDown, ChevronUp, Eye, Download, Send, FileText, 
  MoreHorizontal, ArrowUpDown, CheckCircle, Ban, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PDFExporter from '@/components/PDFExporter';
import ConversionModal from '@/components/ConversionModal';
import PaymentModal from '@/components/PaymentModal';
import AgreementPDFGenerator from '@/components/AgreementPDFGenerator'; // Import the new component

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InvoiceTable({ invoices = [], onView }) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState({});
  
  // Conversion modal state
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [invoiceToConvert, setInvoiceToConvert] = useState(null);
  
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState(null);

  // Agreement PDF state
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementData, setAgreementData] = useState(null);

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
      cancelled: "bg-gray-50 text-gray-600 border-gray-200",
      partially_paid: "bg-amber-50 text-amber-600 border-amber-200"
    };
    
    return (
      <Badge variant="outline" className={`${styles[status] || ""} border px-3 py-1 font-medium`}>
        {status === 'partially_paid' ? 'Partially Paid' : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Fetch invoice details for PDF generation
  const fetchInvoiceDetails = async (id) => {
    setLoadingInvoice(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await axiosInstance.get(`/api/v1/invoice/${id}`);
      const invoiceData = response.data.data;
      
      // Save the invoice details for the specific ID
      setInvoiceDetails(prev => ({
        ...prev,
        [id]: invoiceData
      }));
      
      return invoiceData;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to fetch invoice details for PDF generation');
      return null;
    } finally {
      setLoadingInvoice(prev => ({ ...prev, [id]: false }));
    }
  };

  // Handle download with PDFExporter
  const handleDownloadPdf = async (id) => {
    toast.loading('Preparing PDF...', { id: 'pdf-loading' });
    
    try {
      const invoiceData = await fetchInvoiceDetails(id);
      
      if (invoiceData) {
        // If we have data, set it to be used by the PDFExporter
        setSelectedInvoice(id);
        toast.success('PDF ready!', { id: 'pdf-loading' });
        
        // Trigger the download by simulating a click on the hidden button
        document.getElementById(`download-pdf-${id}`).click();
      } else {
        toast.error('Failed to generate PDF', { id: 'pdf-loading' });
      }
    } catch (error) {
      toast.error('Error generating PDF', { id: 'pdf-loading' });
    }
  };

  // Generate Agreement PDF
  const handleGenerateAgreement = (invoice) => {
    // Prepare the data for the agreement
    const agreementData = {
      clientName: invoice.client?.name || 'Client',
      clientAddress: invoice.client?.fullAddress || invoice.client?.address || 'Client Address',
      projectAmount: invoice.summary?.total || 0,
      agreementDate: format(new Date(), "do 'day of' MMMM, yyyy")
    };
    console.log(agreementData)
    
    setAgreementData(agreementData);
    setShowAgreement(true);
    
    // Trigger the agreement download after a small delay
    setTimeout(() => {
      document.getElementById('download-agreement-button').click();
      setShowAgreement(false);
    }, 100);
  };

  const handleSendEmail = async (id) => {
    try {
      toast.loading('Sending email...', { id: 'email-sending' });
      const response = await axiosInstance.post(`/api/v1/invoice/${id}/send-email`);
      
      if (response.data.success) {
        toast.success("Invoice sent via email", { id: 'email-sending' });
      } else {
        toast.error(response.data.message || "Failed to send email", { id: 'email-sending' });
      }
    } catch (error) {
      toast.error("Failed to send email", { id: 'email-sending' });
      console.error('Error sending email:', error);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      toast.loading('Updating status...', { id: 'status-update' });
      const response = await axiosInstance.patch(`/api/v1/invoice/${id}/status`, { status: 'paid' });
      
      if (response.data.success) {
        toast.success("Invoice marked as paid", { id: 'status-update' });
        // Reload data
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to update status", { id: 'status-update' });
      }
    } catch (error) {
      toast.error("Failed to update status", { id: 'status-update' });
      console.error('Error updating status:', error);
    }
  };

  // Handle opening conversion modal
  const handleConvertClick = (invoice) => {
    setInvoiceToConvert(invoice);
    setConversionModalOpen(true);
  };
  
  // Handle opening payment modal
  const handleRecordPaymentClick = (invoice) => {
    setInvoiceForPayment(invoice);
    setPaymentModalOpen(true);
  };
  
  // Handle payment success - reload the page to show updated status
  const handlePaymentSuccess = () => {
    // Reload the data
    window.location.reload();
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
      {/* Hidden PDFExporters for each invoice */}
      {invoiceDetails && Object.keys(invoiceDetails).map(id => (
        <div key={`pdf-exporter-${id}`} className="hidden">
          <PDFExporter 
            data={invoiceDetails[id]} 
            children={<button id={`download-pdf-${id}`}>Download</button>} 
          />
        </div>
      ))}
      
      {/* Hidden Agreement Generator */}
      {showAgreement && agreementData && (
        <div className="hidden">
          <AgreementPDFGenerator 
            agreementData={agreementData}
            children={<button id="download-agreement-button">Download Agreement</button>}
          />
        </div>
      )}
      
      {/* Conversion Modal */}
      {invoiceToConvert && (
        <ConversionModal
          isOpen={conversionModalOpen}
          onClose={() => {
            setConversionModalOpen(false);
            setInvoiceToConvert(null);
          }}
          invoice={invoiceToConvert}
        />
      )}
      
      {/* Payment Modal */}
      {invoiceForPayment && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setInvoiceForPayment(null);
          }}
          invoice={invoiceForPayment}
          onSuccess={handlePaymentSuccess}
        />
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
              <TableCell className="text-right flex justify-end items-center space-x-1">
                {/* Direct Download Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDownloadPdf(invoice._id)}
                        disabled={loadingInvoice[invoice._id]}
                      >
                        <span className="sr-only">Download PDF</span>
                        {loadingInvoice[invoice._id] ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download Invoice</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Agreement Download Button - only for advance invoices */}
                {invoice.type === 'advance' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleGenerateAgreement(invoice)}
                        >
                          <span className="sr-only">Download Agreement</span>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Agreement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Email Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleSendEmail(invoice._id)}
                      >
                        <span className="sr-only">Send Email</span>
                        <Send className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send via Email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Dropdown for additional actions */}
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
                    
                    {/* Record Payment option - available for invoices that aren't fully paid */}
                    {invoice.type !== 'quotation' && !['paid', 'cancelled', 'draft'].includes(invoice.status) && (
                      <DropdownMenuItem onClick={() => handleRecordPaymentClick(invoice)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Record Payment
                      </DropdownMenuItem>
                    )}
                    
                    {/* Convert invoice options */}
                    {(invoice.type === 'quotation' || invoice.type === 'advance') && (
                      <DropdownMenuItem onClick={() => handleConvertClick(invoice)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {invoice.type === 'quotation' 
                          ? 'Convert to Invoice' 
                          : 'Convert to Final Invoice'}
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