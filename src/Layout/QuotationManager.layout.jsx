import React, { useState } from 'react';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit2, Download } from 'lucide-react';
import { format } from 'date-fns';
import PDFExporter from '../components/PDFExporter';

export default function QuotationManager() {
  const [quotations, setQuotations] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    clientAddress: '',
    expectedDate: '',
    includeGST: false,
    currency: 'INR',
    items: [{ service: '', price: '' }],
  });

  function addItem() {
    setForm(f => ({
      ...f,
      items: [...f.items, { service: '', price: '' }],
    }));
  }

  function removeItem(idx) {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));
  }

  function updateItem(idx, field, value) {
    setForm(f => {
      const items = [...f.items];
      items[idx][field] = value;
      return { ...f, items };
    });
  }

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function resetForm() {
    setForm({
      projectName: '',
      clientName: '',
      clientAddress: '',
      expectedDate: '',
      includeGST: false,
      currency: 'INR',
      items: [{ service: '', price: '' }],
    });
  }

  function openFormFor(quote = null) {
    if (quote) {
      setEditingId(quote.id);
      setForm({
        ...quote,
        items: quote.items.map(it => ({ ...it })),
      });
    } else {
      setEditingId(null);
      resetForm();
    }
    setOpenForm(true);
  }

  function saveQuotation() {
    const subtotal = form.items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
    const gst = form.includeGST ? subtotal * 0.18 : 0;
    const total = subtotal + gst;

    const newQuote = {
      ...form,
      subtotal,
      gst,
      total,
      created: new Date(),
    };

    setQuotations(prev => {
      if (editingId !== null) {
        return prev.map(q => (q.id === editingId ? { ...newQuote, id: editingId } : q));
      }
      const id = prev.length ? Math.max(...prev.map(q => q.id)) + 1 : 1;
      return [...prev, { ...newQuote, id }];
    });

    setOpenForm(false);
    setEditingId(null);
  }

  function deleteQuotation(id) {
    setQuotations(prev => prev.filter(q => q.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <Button variant="outline" onClick={() => openFormFor()}>
          <Plus className="mr-2" /> New Quotation
        </Button>
      </div>

      <div className="overflow-x-auto mb-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map(q => (
              <TableRow key={q.id || Math.random()}>
                <TableCell>{q.id}</TableCell>
                <TableCell>{format(new Date(q.created), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{q.projectName}</TableCell>
                <TableCell>{q.clientName}</TableCell>
                <TableCell>
                  {q.currency === 'INR'
                    ? `₹${q.total.toFixed(2)}`
                    : `$${q.total.toFixed(2)}`}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <PDFExporter quote={q}>
                    <Button size="icon" variant="ghost">
                      <Download />
                    </Button>
                  </PDFExporter>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openFormFor(q)}
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteQuotation(q.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Quotation' : 'New Quotation'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Project Name"
              value={form.projectName}
              onChange={e => updateField('projectName', e.target.value)}
            />
            <Input
              placeholder="Client Name"
              value={form.clientName}
              onChange={e => updateField('clientName', e.target.value)}
            />
            <Textarea
              placeholder="Client Address"
              rows={2}
              value={form.clientAddress}
              onChange={e => updateField('clientAddress', e.target.value)}
            />
            <Input
              type="date"
              placeholder="Expected Delivery Date"
              value={form.expectedDate}
              onChange={e => updateField('expectedDate', e.target.value)}
            />
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Currency:</span>
              <Button
                size="sm"
                variant={form.currency === 'INR' ? 'default' : 'outline'}
                onClick={() => updateField('currency', 'INR')}
              >
                ₹ INR
              </Button>
              <Button
                size="sm"
                variant={form.currency === 'USD' ? 'default' : 'outline'}
                onClick={() => updateField('currency', 'USD')}
              >
                $ USD
              </Button>
              <Switch
                checked={form.includeGST}
                onCheckedChange={v => updateField('includeGST', v)}
              />
              <span className="text-sm">Include GST</span>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex space-x-2">
                  <Input
                    placeholder="Service"
                    value={item.service}
                    onChange={e => updateItem(idx, 'service', e.target.value)}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={item.price}
                    onChange={e => updateItem(idx, 'price', e.target.value)}
                  />
                  {idx > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(idx)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1" /> Add Service
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="secondary" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
            <Button onClick={saveQuotation}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
