import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function QuotationManager() {
  // Demo initial quotations
  const [quotations, setQuotations] = useState([
    {
      id: 1,
      created: new Date('2025-04-01'),
      projectName: 'E-Commerce Platform',
      clientName: 'Acme Corp',
      clientAddress: '123 Market St, Cityville',
      expectedDate: '2025-05-01',
      includeGST: true,
      currency: 'INR',
      items: [
        { service: 'Web Development', price: '10000' },
        { service: 'UI/UX Design', price: '5000' },
      ],
      subtotal: 15000,
      gst: 2700,
      total: 17700,
    },
    {
      id: 2,
      created: new Date('2025-04-10'),
      projectName: 'Mobile App',
      clientName: 'Beta Ltd',
      clientAddress: '456 Tech Ave, Metropolis',
      expectedDate: '2025-06-15',
      includeGST: false,
      currency: 'USD',
      items: [
        { service: 'App Development', price: '2000' },
        { service: 'API Integration', price: '800' },
      ],
      subtotal: 2800,
      gst: 0,
      total: 2800,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ projectName:'', clientName:'', clientAddress:'', expectedDate:'', includeGST:false, currency:'INR', items:[{service:'',price:''}] });

  function exportPDF(q) {
    const doc = new jsPDF({ unit: 'pt', format: 'A4' });
    const margin = 40;
    let y = margin;
    doc.setFontSize(22).setTextColor('#4B4C58').text('Quotation', margin, y);
    doc.setFontSize(10);
    y += 20;
    doc.text(`Quotation #${q.id}`, margin, y);
    doc.text(`Date: ${format(new Date(q.created), 'dd/MM/yyyy')}`, 500, y);
    y += 10;
    doc.setDrawColor('#E5E7EB').line(margin, y, 555, y);
    y += 20;
    doc.setFillColor('#F3F4F6');
    doc.roundedRect(margin, y, 250, 60, 4, 4, 'F');
    doc.roundedRect(320, y, 250, 60, 4, 4, 'F');
    doc.setFontSize(10).setTextColor('#374151');
    doc.text('Quotation by:', margin + 6, y + 16);
    doc.text('Your Company Name', margin + 6, y + 30);
    doc.text('Quotation to:', 320 + 6, y + 16);
    doc.text(q.clientName, 320 + 6, y + 30);
    doc.text(q.clientAddress, 320 + 6, y + 44);
    y += 80;
    autoTable(doc, {
      startY: y,
      head: [[{content:'Item #/Description',styles:{fillColor:'#7C3AED',textColor:'#FFFFFF'}},{content:'Price',styles:{fillColor:'#7C3AED',textColor:'#FFFFFF'}}]],
      body: q.items.map((it,idx)=>[
        `${idx+1}. ${it.service}`,
        q.currency==='INR'?`₹${parseFloat(it.price).toFixed(2)}`:`$${parseFloat(it.price).toFixed(2)}`
      ]),
      styles:{halign:'left',fontSize:10,cellPadding:6}, alternateRowStyles:{fillColor:'#F9FAFB'}, tableLineColor:'#E5E7EB', theme:'grid'
    });
    const finalY=doc.lastAutoTable.finalY+20;
    doc.setFontSize(10);
    doc.text('Subtotal:',400,finalY);
    doc.text(q.currency==='INR'?`₹${q.subtotal.toFixed(2)}`:`$${q.subtotal.toFixed(2)}`,515,finalY,{align:'right'});
    if(q.includeGST){
      doc.text('GST (18%)',400,finalY+14);
      doc.text(q.currency==='INR'?`₹${q.gst.toFixed(2)}`:`$${q.gst.toFixed(2)}`,515,finalY+14,{align:'right'});
    }
    doc.setFontSize(12).setTextColor('#111827');
    doc.text('Total:',400,finalY+30);
    doc.text(q.currency==='INR'?`₹${q.total.toFixed(2)}`:`$${q.total.toFixed(2)}`,515,finalY+30,{align:'right'});
    doc.save(`Quotation_${q.id}.pdf`);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={()=>exportPDF(quotations[0])}>
            <Download className="mr-2"/> Download Quotation 1
          </Button>
          <Button variant="outline" onClick={()=>exportPDF(quotations[1])}>
            <Download className="mr-2"/> Download Quotation 2
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map(q=>(
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
                <TableCell>{format(new Date(q.created),'dd/MM/yyyy')}</TableCell>
                <TableCell>{q.projectName}</TableCell>
                <TableCell>{q.clientName}</TableCell>
                <TableCell>
                  {q.currency==='INR'?`₹${q.total.toFixed(2)}`:`$${q.total.toFixed(2)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
