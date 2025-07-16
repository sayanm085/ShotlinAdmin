import React, { useState } from 'react';
import { CreditCard, Save, Send, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

import { formatCurrency } from './utils/invoiceUtils';

export default function InvoiceSummary({ invoice, setInvoice, isSaving, onSave }) {
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null, 'valid', 'invalid'
  
  // Mock coupon codes - in a real app, these would come from an API
  const validCoupons = [
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'percentage' },
    { code: 'FLAT500', discount: 500, type: 'fixed' },
    { code: 'NEWCLIENT', discount: 15, type: 'percentage' }
  ];
  
  const handleTaxChange = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      tax: { ...prev.tax, [field]: value }
    }));
  };
  
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value.toUpperCase());
    // Reset status when typing
    if (couponStatus) {
      setCouponStatus(null);
    }
  };
  
  const applyCoupon = () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    const foundCoupon = validCoupons.find(c => c.code === couponCode);
    
    if (foundCoupon) {
      setInvoice(prev => ({
        ...prev,
        discount: {
          enabled: true,
          type: foundCoupon.type,
          value: foundCoupon.discount,
          code: foundCoupon.code
        }
      }));
      setCouponStatus('valid');
      toast.success(`Coupon ${foundCoupon.code} applied successfully!`);
    } else {
      setCouponStatus('invalid');
      toast.error('Invalid coupon code');
    }
  };
  
  const removeCoupon = () => {
    setInvoice(prev => ({
      ...prev,
      discount: {
        enabled: false,
        type: 'percentage',
        value: 0,
        code: null
      }
    }));
    setCouponCode('');
    setCouponStatus(null);
    toast.success('Coupon removed');
  };
  
  const taxPresets = [
    { id: 'gst', name: 'GST', rate: 18 },
    { id: 'igst', name: 'IGST', rate: 18 },
    { id: 'cgst_sgst', name: 'CGST + SGST', rate: 18 },
    { id: 'none', name: 'No Tax', rate: 0 }
  ];

  // Calculate advance payment amount if this is an advance invoice
  const isAdvanceInvoice = invoice.type === 'advance';
  const advancePercentage = invoice.advancepaymentpercent || 0;
  const advanceAmount = isAdvanceInvoice ? (invoice.summary.total * advancePercentage / 100) : 0;
  const remainingAmount = isAdvanceInvoice ? (invoice.summary.total - advanceAmount) : 0;

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm sticky top-6">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg font-semibold">
          <CreditCard className="mr-2 h-5 w-5 text-primary" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.summary.subtotal)}</span>
          </div>
          
          {/* Coupon Code Section */}
          <div className="border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Coupon Code</span>
              
              {invoice.discount.enabled && (
                <span className="font-medium text-red-600">
                  -{formatCurrency(invoice.summary.discountAmount)}
                </span>
              )}
            </div>
            
            {!invoice.discount.enabled ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={handleCouponChange}
                  className={`flex-1 ${couponStatus === 'invalid' ? 'border-red-500' : ''}`}
                  disabled={invoice.discount.enabled}
                />
                <Button 
                  onClick={applyCoupon} 
                  size="sm" 
                  className="whitespace-nowrap"
                  disabled={invoice.discount.enabled}
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex-1">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">{invoice.discount.code}</span>
                    <Badge className="ml-2" variant="outline">
                      {invoice.discount.type === 'percentage' 
                        ? `${invoice.discount.value}% OFF` 
                        : `₹${invoice.discount.value} OFF`}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeCoupon} 
                  className="h-8 w-8 p-0 ml-2 text-slate-500 hover:text-red-500"
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Remove coupon</span>
                </Button>
              </div>
            )}
            
            {couponStatus === 'invalid' && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <XCircle className="h-3 w-3 mr-1" /> Invalid coupon code. Please try again.
              </p>
            )}
            
            <p className="mt-2 text-xs text-muted-foreground">
              Try codes: WELCOME10, SAVE20, FLAT500, NEWCLIENT
            </p>
          </div>
          
          {/* Tax Section */}
          <div className="border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Tax</span>
                <Switch
                  checked={invoice.tax.enabled}
                  onCheckedChange={checked => handleTaxChange('enabled', checked)}
                />
              </div>
              
              {invoice.tax.enabled && (
                <span className="font-medium">
                  {formatCurrency(invoice.summary.taxAmount)}
                </span>
              )}
            </div>
            
            {invoice.tax.enabled && (
              <div className="grid grid-cols-2 gap-3 mt-2 animate-in slide-in-from-top-2 duration-150">
                <Select
                  value={invoice.tax.type}
                  onValueChange={value => handleTaxChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taxPresets.map(tax => (
                      <SelectItem key={tax.id} value={tax.id}>
                        {tax.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={invoice.tax.rate}
                    onChange={e => handleTaxChange('rate', parseFloat(e.target.value) || 0)}
                    className="pr-8 text-right"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Total */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-xl">{formatCurrency(invoice.summary.total)}</span>
            </div>
          </div>
          
          {/* Advance Payment Calculation - Only show for Advance Invoice Type */}
          {isAdvanceInvoice && advancePercentage > 0 && (
            <div className="border-t border-slate-200 pt-4 mt-4 bg-blue-50 -mx-6 px-6 pb-4">
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Advance Payment {advancePercentage}%
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-blue-800">
                  <span>Total Invoice Amount:</span>
                  <span className="font-medium">{formatCurrency(invoice.summary.total)}</span>
                </div>
                
                <div className="flex justify-between items-center font-medium text-green-700">
                  <span>Advance Payment Amount:</span>
                  <span>{formatCurrency(advanceAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-500">
                  <span>Remaining Amount:</span>
                  <span>{formatCurrency(remainingAmount)}</span>
                </div>
                
                <div className="flex items-center justify-center mt-2 text-xs text-blue-700">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  <span>This invoice is for the advance payment only</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-6">
        <div className="space-y-4 w-full">
          <Button 
            className="w-full"
            disabled={isSaving}
            onClick={() => onSave('draft')}
          >
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
                Save as Draft
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={isSaving}
            onClick={() => onSave('sent')}
          >
            <Send className="mr-2 h-4 w-4" />
            Save and Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}