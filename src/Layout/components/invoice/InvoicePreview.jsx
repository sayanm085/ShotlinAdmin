import React from 'react';
import { format } from 'date-fns';
import { Edit, Calculator } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const InvoicePreview = React.forwardRef(({ invoice, formatCurrency, onEdit }, ref) => {
  // Calculate advance payment amount if this is an advance invoice
  const isAdvanceInvoice = invoice.type === 'advance';
  const advancePercentage = invoice.advancepaymentpercent || 0;
  const advanceAmount = isAdvanceInvoice ? (invoice.summary.total * advancePercentage / 100) : 0;
  const remainingAmount = isAdvanceInvoice ? (invoice.summary.total - advanceAmount) : 0;

  return (
    <div ref={ref} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">Invoice Preview</h2>
        <Button variant="secondary" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Invoice
        </Button>
      </div>
      
      <div className="p-8 max-w-4xl mx-auto">
        {/* Company Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shotlin</h1>
            <p className="text-slate-600 mt-1">379/N, BANIPUR PALPARA WARD 13</p>
            <p className="text-slate-600">North 24 Parganas, West Bengal 743287, India</p>
            <p className="text-slate-600">GST: AAHATPM4170HDC</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {invoice.type.toUpperCase() === 'QUOTATION' ? 'QUOTATION' : 'INVOICE'}
              {isAdvanceInvoice && (
                <Badge className="ml-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-100">
                  ADVANCE
                </Badge>
              )}
            </div>
            <p className="text-slate-600 mt-1"># {invoice.invoiceNumber}</p>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* Client & Invoice Details */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Bill To:</h3>
            {invoice.client ? (
              <div>
                <p className="font-medium text-slate-900">{invoice.client.name}</p>
                <p className="text-slate-600">{invoice.client.address?.street || ''}</p>
                <p className="text-slate-600">
                  {[
                    invoice.client.address?.city,
                    invoice.client.address?.state,
                    invoice.client.address?.zipCode
                  ].filter(Boolean).join(', ')}
                </p>
                <p className="text-slate-600">{invoice.client.email || 'No email provided'}</p>
                <p className="text-slate-600">{invoice.client.phone || 'No phone provided'}</p>
                {invoice.client.gstNumber && (
                  <p className="text-slate-600">GST: {invoice.client.gstNumber}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-500">No client selected</p>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Invoice Date:</span>
              <span className="font-medium">{format(invoice.issuedDate, "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Due Date:</span>
              <span className="font-medium">{format(invoice.dueDate, "MMMM dd, yyyy")}</span>
            </div>
            {invoice.project && (
              <div className="flex justify-between">
                <span className="text-slate-600">Project:</span>
                <span className="font-medium">{invoice.project.name}</span>
              </div>
            )}
            {isAdvanceInvoice && (
              <div className="flex justify-between">
                <span className="text-slate-600">Advance Payment:</span>
                <span className="font-medium">{invoice.advancepaymentpercent}%</span>
              </div>
            )}
            {invoice.expectedDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-slate-600">Expected Delivery:</span>
                <span className="font-medium">{format(invoice.expectedDeliveryDate, "yyyy-MM-dd")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">Place of Supply:</span>
              <span className="font-medium">{invoice.location?.placeOfSupply}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left border-y border-slate-200">
                <th className="px-4 py-3 text-slate-700 font-semibold">Item & Description</th>
                <th className="px-4 py-3 text-slate-700 font-semibold">HSN Code</th>
                <th className="px-4 py-3 text-slate-700 font-semibold text-right">Quantity</th>
                <th className="px-4 py-3 text-slate-700 font-semibold text-right">Rate</th>
                <th className="px-4 py-3 text-slate-700 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.services.map((service, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{service.name || 'Unnamed item'}</div>
                    {service.description && (
                      <div className="text-slate-500 text-sm mt-1">{service.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">{service.hsnSacCode || '-'}</td>
                  <td className="px-4 py-4 text-right">{service.quantity}</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(service.unitPrice)}</td>
                  <td className="px-4 py-4 text-right font-medium">{formatCurrency(service.quantity * service.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end">
          <div className="w-72">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.summary.subtotal)}</span>
              </div>
              
              {invoice.discount.enabled && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Discount 
                    {invoice.discount.type === 'percentage' && ` (${invoice.discount.value}%)`}:
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(invoice.summary.discountAmount)}
                  </span>
                </div>
              )}
              
              {invoice.tax.enabled && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {invoice.tax.type.toUpperCase()} ({invoice.tax.rate}%):
                  </span>
                  <span className="font-medium">{formatCurrency(invoice.summary.taxAmount)}</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-800 font-semibold">Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(invoice.summary.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advance Payment Details - Only show for Advance Invoices */}
        {isAdvanceInvoice && advancePercentage > 0 && (
          <div className="mt-8 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center mb-4">
              <Calculator className="text-blue-700 mr-2 h-5 w-5" />
              <h3 className="font-semibold text-blue-800">Advance Payment Calculation</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Total Invoice Value:</span>
                  <span className="font-medium">{formatCurrency(invoice.summary.total)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Advance Percentage:</span>
                  <span className="font-medium">{advancePercentage}%</span>
                </div>
                
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">Advance Payment Due:</span>
                    <span className="font-bold text-blue-800">{formatCurrency(advanceAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Balance After Advance:</span>
                  <span className="font-medium">{formatCurrency(remainingAmount)}</span>
                </div>
                
                <div className="pt-8 text-center">
                  <div className="inline-block px-3 py-1 bg-blue-100 border border-blue-200 rounded-md text-sm text-blue-800">
                    This invoice is for the advance payment only
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {(invoice.notes || invoice.termsAndConditions) && (
          <div className="mt-12 space-y-6">
            {invoice.notes && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Notes:</h3>
                <p className="text-slate-600">{invoice.notes}</p>
              </div>
            )}
            
            {invoice.termsAndConditions && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Terms & Conditions:</h3>
                <p className="text-slate-600">{invoice.termsAndConditions}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12 text-center text-slate-500">
          <p>Thank you for your business!</p>
          <p className="mt-1 text-xs">Invoice generated on {format(new Date(), "MMMM dd, yyyy")} by {invoice.type === 'quotation' ? 'Shotlin Quotation System' : 'Shotlin Invoice System'}</p>
          <p className="text-xs text-slate-400">Last updated: {format(new Date("2025-07-15 20:28:20"), "dd MMM yyyy • HH:mm:ss")} by {currentUser}</p>
        </div>
      </div>
    </div>
  );
});

// Setting currentUser outside the component to match the value passed
const currentUser = "sayanm085";

export default InvoicePreview;