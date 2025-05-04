import React, { useState } from 'react';
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
  const [quotations, setQuotations] = useState([]);
  const [open, setOpen] = useState(false);
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
    setForm(f => ({ ...f, items: [...f.items, { service: '', price: '' }] }));
  }
  function removeItem(idx) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
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

  function createQuotation() {
    const subtotal = form.items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
    const gst = form.includeGST ? subtotal * 0.18 : 0;
    const total = subtotal + gst;
    setQuotations(qs => [
      ...qs,
      {
        id: qs.length + 1,
        created: new Date(),
        ...form,
        subtotal,
        gst,
        total,
      },
    ]);
    resetForm();
    setOpen(false);
  }

  function downloadQuotation(q) {
    // TODO: implement PDF export using jsPDF or React PDF
    console.log('download', q);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="mr-2" /> Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Quotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Project & Client Details */}
              <Input
                placeholder="Project Name (e.g. E-commerce Site)"
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
                value={form.clientAddress}
                onChange={e => updateField('clientAddress', e.target.value)}
                rows={2}
              />

              {/* Expected Delivery Date */}
              <div>
                <label htmlFor="expectedDate" className="block text-sm font-medium mb-1">
                  Expected Delivery Date
                </label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={form.expectedDate}
                  onChange={e => updateField('expectedDate', e.target.value)}
                  placeholder="Select expected delivery date"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set the date by which the project should be delivered.
                </p>
              </div>

              {/* Currency & GST */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Currency:</span>
                <div className="flex space-x-2">
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
                </div>
                <Switch
                  checked={form.includeGST}
                  onCheckedChange={v => updateField('includeGST', v)}
                />
                <span className="text-sm">Include GST (18%)</span>
              </div>

              {/* Service Items */}
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <Input
                      placeholder="Service Name"
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
                  <Plus className="mr-2" /> Add Service
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={createQuotation}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map(q => (
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
                <TableCell>{format(new Date(q.created), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{q.projectName}</TableCell>
                <TableCell>{q.clientName}</TableCell>
                <TableCell>
                  {q.currency === 'INR' ? `₹${q.total.toFixed(2)}` : `$${q.total.toFixed(2)}`}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadQuotation(q)}
                  >
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
