import React, { useState, useEffect } from 'react';
import { format, differenceInDays, addDays, addMonths } from 'date-fns';
import { Calendar, FileText, Info, Clock } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export default function InvoiceDetails({ invoice, setInvoice, type }) {
  // Initialize delivery option state based on existing delivery date or default to 30days
  const [deliveryOption, setDeliveryOption] = useState('30days');
  
  // Initialize expected delivery date if not present
  useEffect(() => {
    if (!invoice.expectedDeliveryDate) {
      setInvoice(prev => ({
        ...prev,
        expectedDeliveryDate: addDays(new Date(), 30) // Default to 30 days
      }));
    }
  }, [invoice.expectedDeliveryDate, setInvoice]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field, date) => {
    setInvoice(prev => ({ ...prev, [field]: date }));
  };

  const handleAdvancePercentChange = (e) => {
    const value = parseInt(e.target.value);
    setInvoice(prev => ({
      ...prev,
      advancepaymentpercent: isNaN(value) ? '' : Math.min(Math.max(value, 1), 100)
    }));
  };
  
  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
    
    let deliveryDate;
    const today = new Date();
    
    switch (option) {
      case '15days':
        deliveryDate = addDays(today, 15);
        break;
      case '1month':
        deliveryDate = addMonths(today, 1);
        break;
      case '2months':
        deliveryDate = addMonths(today, 2);
        break;
      case '3months':
        deliveryDate = addMonths(today, 3);
        break;
      case 'custom':
        // Keep the current date if custom is selected
        deliveryDate = invoice.expectedDeliveryDate || today;
        break;
      default:
        deliveryDate = addDays(today, 30);
    }
    
    setInvoice(prev => ({
      ...prev,
      expectedDeliveryDate: deliveryDate
    }));
  };
  
  // Safely format date with fallback
  const formatSafeDate = (date, formatString) => {
    try {
      return date ? format(date, formatString) : 'Select a date';
    } catch (error) {
      console.error('Invalid date:', date, error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg font-semibold">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Invoice Type and Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type">Invoice Type</Label>
            <div className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center text-sm">
              {type === 'quotation' && 'Quotation'}
              {type === 'advance' && 'Advance Payment Invoice'}
              {type === 'final' && 'Final Invoice'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Selected invoice type (change using the selector above)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <div className="relative">
              <Input 
                id="invoiceNumber"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleInputChange}
                readOnly
                className="bg-slate-50"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Invoice number is automatically generated based on the type
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-generated based on type and sequence
            </p>
          </div>
        </div>
        
        {/* Issue Date and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="issuedDate">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatSafeDate(invoice.issuedDate, "MMMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={invoice.issuedDate}
                  onSelect={date => date && handleDateChange('issuedDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatSafeDate(invoice.dueDate, "MMMM dd, yyyy")}
                  {invoice.issuedDate && invoice.dueDate && (
                    <Badge className="ml-auto" variant="outline">
                      {differenceInDays(invoice.dueDate, invoice.issuedDate)} days
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={invoice.dueDate}
                  onSelect={date => date && handleDateChange('dueDate', date)}
                  disabled={date => date < invoice.issuedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Expected Delivery Date and Advance Payment Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
            <div className="flex gap-2">
              <Select 
                value={deliveryOption} 
                onValueChange={handleDeliveryOptionChange}
              >
                <SelectTrigger id="deliveryOption" className="w-1/2">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15days">15 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="2months">2 Months</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
              
              {deliveryOption === 'custom' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-1/2 justify-start text-left font-normal"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {invoice.expectedDeliveryDate ? 
                        formatSafeDate(invoice.expectedDeliveryDate, "yyyy-MM-dd") : 
                        "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={invoice.expectedDeliveryDate}
                      onSelect={date => date && handleDateChange('expectedDeliveryDate', date)}
                      disabled={date => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex-1 h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center">
                  {invoice.expectedDeliveryDate ? 
                    formatSafeDate(invoice.expectedDeliveryDate, "yyyy-MM-dd") : 
                    "Calculating..."}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Expected date of service/product delivery
            </p>
          </div>
          
          {type === 'advance' && (
            <div className="space-y-2">
              <Label htmlFor="advancepaymentpercent">
                Advance Payment Percentage
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="advancepaymentpercent"
                  name="advancepaymentpercent"
                  type="number"
                  min="1"
                  max="100"
                  value={invoice.advancepaymentpercent || ''}
                  onChange={handleAdvancePercentChange}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of total amount for this advance payment
              </p>
            </div>
          )}
        </div>
        
        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="placeOfSupply">Place of Supply</Label>
            <Input 
              id="placeOfSupply"
              value={invoice.location?.placeOfSupply || ''}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                location: { ...prev.location, placeOfSupply: e.target.value }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="countryOfSupply">Country</Label>
            <Input 
              id="countryOfSupply"
              value={invoice.location?.countryOfSupply || ''}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                location: { ...prev.location, countryOfSupply: e.target.value }
              }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}