import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  Save, X, ArrowLeft, Eye, Download, Send, Clock, User, ChevronDown
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertTriangle } from 'lucide-react';

// Custom Components
import ClientForm from './components/invoice/ClientForm';
import ProjectForm from './components/invoice/ProjectForm';
import ServicesList from './components/invoice/ServicesList';
import InvoiceSummary from './components/invoice/InvoiceSummary';
import InvoicePreview from './components/invoice/InvoicePreview';
import InvoiceToolbar from './components/invoice/InvoiceToolbar';
import InvoiceDetails from './components/invoice/InvoiceDetails';
import NotesAndTerms from './components/invoice/NotesAndTerms';
import TypeSelector from './components/invoice/TypeSelector';

// Utilities
import { calculateTotals, createEmptyService, formatCurrency } from './components/invoice/utils/invoiceUtils';

export default function InvoiceCreate() {
  const navigate = useNavigate();
  
  // Use state for invoice type instead of URL params
  const [invoiceType, setInvoiceType] = useState('quotation');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showTypeChangeDialog, setShowTypeChangeDialog] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState(null);
  const previewRef = useRef(null);

  // User and date info
  const currentDateTime = "2025-07-15 20:11:46";
  const currentUser = "sayanm085";

  // Form state
  const [invoice, setInvoice] = useState({
    type: invoiceType,
    invoiceNumber: `${invoiceType === 'quotation' ? 'QUO' : invoiceType === 'advance' ? 'ADV' : 'INV'}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-0001`,
    issuedDate: new Date(),
    dueDate: addDays(new Date(), 30),
    client: null,
    project: null,
    services: [createEmptyService()],
    notes: '',
    termsAndConditions: '',
    advancepaymentpercent: invoiceType === 'advance' ? 40 : undefined,
    paymentTerms: '30',
    status: 'draft',
    tax: {
      type: 'gst',
      rate: 18,
      enabled: true
    },
    discount: {
      type: 'percentage',
      value: 0,
      enabled: false
    },
    location: {
      placeOfSupply: "West Bengal",
      countryOfSupply: "India"
    },
    summary: {
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      currency: 'INR'
    }
  });

  // Update invoice when invoice type changes
  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      type: invoiceType,
      // Set advance payment percentage for advance invoice type, otherwise undefined
      advancepaymentpercent: invoiceType === 'advance' ? (prev.advancepaymentpercent || 40) : undefined,
      // Update invoice number to match new type
      invoiceNumber: `${invoiceType === 'quotation' ? 'QUO' : invoiceType === 'advance' ? 'ADV' : 'INV'}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-0001`
    }));
  }, [invoiceType]);

  // Calculate summary whenever services, tax, or discount change
  useEffect(() => {
    const totals = calculateTotals(invoice.services, invoice.tax, invoice.discount);
    setInvoice(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        ...totals
      }
    }));
  }, [invoice.services, invoice.tax, invoice.discount]);
  
  // Mark unsaved changes
  useEffect(() => {
    setUnsavedChanges(true);
  }, [invoice]);
  
  // Handle form submission
  const handleSave = async (status = 'draft') => {
    // Basic validation
    if (!invoice.client) {
      toast.error('Please select a client');
      return;
    }
    
    if (invoice.services.some(service => !service.name || !service.quantity)) {
      toast.error('Please fill in all item details');
      return;
    }
    
    // Validate advance payment percentage for advance invoice type
    if (invoiceType === 'advance' && (!invoice.advancepaymentpercent || invoice.advancepaymentpercent <= 0 || invoice.advancepaymentpercent > 100)) {
      toast.error('Please enter a valid advance payment percentage (1-100%)');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Format the payload as it would be sent to the API
      const payload = {
        ...invoice,
        status,
        issuedDate: format(invoice.issuedDate, 'yyyy-MM-dd'),
        dueDate: format(invoice.dueDate, 'yyyy-MM-dd'),
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success(status === 'draft' 
        ? 'Invoice saved as draft' 
        : 'Invoice created and sent');
      
      setUnsavedChanges(false);
      
      // Show preview
      setShowPreview(true);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle preview toggle
  const togglePreview = () => {
    setShowPreview(!showPreview);
    
    if (!showPreview) {
      // Scroll to top when showing preview
      window.scrollTo(0, 0);
    }
  };
  
  // Handle navigation away with unsaved changes
  const handleBackClick = () => {
    if (unsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      navigate(-1);
    }
  };

  // Handle invoice type change - now just updates local state
  const handleTypeChange = (newType) => {
    if (newType !== invoiceType) {
      if (unsavedChanges) {
        // Ask for confirmation before changing type
        setPendingTypeChange(newType);
        setShowTypeChangeDialog(true);
      } else {
        // Change type directly if no unsaved changes
        setInvoiceType(newType);
      }
    }
  };

  const confirmTypeChange = () => {
    if (pendingTypeChange) {
      // Change the invoice type
      setInvoiceType(pendingTypeChange);
      // Close dialog and reset pending type
      setShowTypeChangeDialog(false);
      setPendingTypeChange(null);
    }
  };

  // Get invoice type label
  const getInvoiceTypeLabel = () => {
    switch (invoiceType) {
      case 'quotation': return 'Quotation';
      case 'advance': return 'Advance Payment';
      case 'final': return 'Final Invoice';
      default: return 'Invoice';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Create {getInvoiceTypeLabel()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details to create a new {getInvoiceTypeLabel().toLowerCase()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={togglePreview}
            className="whitespace-nowrap"
          >
            {showPreview ? <X className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPreview ? "Exit Preview" : "Preview"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isSaving} className="whitespace-nowrap">
                {isSaving ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save & Send
                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleSave('draft')} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSave('sent')} disabled={isSaving}>
                <Send className="mr-2 h-4 w-4" />
                Save and Send
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSave('draft')} disabled={isSaving}>
                <Download className="mr-2 h-4 w-4" />
                Save and Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Type Selector - Now uses the local state setter */}
      <TypeSelector currentType={invoiceType} onTypeChange={handleTypeChange} />
      
      {showPreview ? (
        <InvoicePreview 
          invoice={invoice} 
          formatCurrency={formatCurrency} 
          onEdit={togglePreview}
          ref={previewRef}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <InvoiceDetails 
              invoice={invoice} 
              setInvoice={setInvoice} 
              type={invoiceType}
            />
            
            {/* Client & Project Forms */}
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <ClientForm 
                  client={invoice.client} 
                  setClient={(client) => setInvoice(prev => ({ ...prev, client }))} 
                />
                
                <ProjectForm 
                  project={invoice.project}
                  setProject={(project) => setInvoice(prev => ({ ...prev, project }))}
                  disabled={!invoice.client}
                />
              </div>
            </Card>
            
            {/* Services List */}
            <ServicesList 
              services={invoice.services}
              setServices={(services) => setInvoice(prev => ({ ...prev, services }))}
            />
            
            {/* Notes and Terms */}
            <NotesAndTerms 
              notes={invoice.notes}
              termsAndConditions={invoice.termsAndConditions}
              onChange={(field, value) => setInvoice(prev => ({ ...prev, [field]: value }))}
            />
          </div>
          
          {/* Side panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <InvoiceSummary 
              invoice={invoice}
              setInvoice={setInvoice}
              isSaving={isSaving}
              onSave={handleSave}
            />
            
            {/* Tools & Actions */}
            <InvoiceToolbar type={invoiceType} />
          </div>
        </div>
      )}
      
      {/* Discard Changes Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Unsaved Changes
            </DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowDiscardDialog(false)}
            >
              Continue Editing
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowDiscardDialog(false);
                navigate(-1);
              }}
            >
              Discard Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Type Change Dialog */}
      <Dialog open={showTypeChangeDialog} onOpenChange={setShowTypeChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Change Invoice Type
            </DialogTitle>
            <DialogDescription>
              Changing the invoice type will reset some fields. You have unsaved changes. Are you sure you want to change?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowTypeChangeDialog(false);
                setPendingTypeChange(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmTypeChange}
            >
              Change Type
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* User info footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Last updated: {format(new Date(currentDateTime), 'dd MMM yyyy • HH:mm:ss')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5" />
          <span>User: {currentUser}</span>
        </div>
      </div>
    </div>
  );
}