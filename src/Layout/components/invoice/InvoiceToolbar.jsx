import React from 'react';
import { FileText, HelpCircle, Settings, CreditCard, DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function InvoiceToolbar({ type }) {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Tools & Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Invoice Type Information */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Invoice Type</Label>
          <div className="p-4 rounded-md border border-slate-200 text-sm">
            {type === 'quotation' && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Quotation</p>
                  <p className="mt-1 text-slate-600">A quotation is a formal estimate of costs for services or products.</p>
                </div>
              </div>
            )}
            
            {type === 'advance' && (
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Advance Payment Invoice</p>
                  <p className="mt-1 text-slate-600">An advance payment invoice requests partial payment before completion of work.</p>
                  <p className="mt-2 font-medium text-green-700">Don't forget to specify the advance payment percentage!</p>
                </div>
              </div>
            )}
            
            {type === 'final' && (
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Final Invoice</p>
                  <p className="mt-1 text-slate-600">A final invoice is issued after services are completed, requesting full payment.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Help & Resources</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Invoice Guide
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Terms Templates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}