import React from 'react';
import { FileText, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TypeSelector({ currentType, onTypeChange }) {
  return (
    <Card className="mb-6 border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <CardTitle className="text-lg font-semibold">Select Invoice Type</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={currentType === 'quotation' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onTypeChange('quotation')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Quotation
          </Button>
          
          <Button 
            variant={currentType === 'advance' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onTypeChange('advance')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Advance Payment
          </Button>
          
          <Button 
            variant={currentType === 'final' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onTypeChange('final')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Final Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}