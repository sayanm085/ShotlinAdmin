import React from 'react';
import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NotesAndTerms({ notes, termsAndConditions, onChange }) {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg font-semibold">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Notes & Terms
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes"
            value={notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Additional notes to the client"
            className="min-h-[100px] resize-y border-slate-200"
          />
          <p className="text-xs text-muted-foreground mt-1">
            These notes will be displayed on the invoice
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
          <Textarea 
            id="termsAndConditions"
            value={termsAndConditions}
            onChange={(e) => onChange('termsAndConditions', e.target.value)}
            placeholder="Terms and conditions for this invoice"
            className="min-h-[100px] resize-y border-slate-200"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Legal terms and conditions for the invoice
          </p>
        </div>
      </CardContent>
    </Card>
  );
}