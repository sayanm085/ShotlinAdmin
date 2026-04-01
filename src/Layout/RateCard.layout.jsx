// src/Layout/RateCard.layout.jsx
import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  X,
  IndianRupee,
  DollarSign,
  Tag,
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'shotlin_rate_card';
const USD_RATE = 83.5; // approximate INR→USD conversion
const GST_RATE = 18; // GST percentage applied to service rates

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Digital Marketing',
  'Photography',
  'Videography',
  'Branding',
  'SEO',
  'Content Writing',
  'Other',
];

const UNITS = ['Project', 'Hour', 'Day', 'Month', 'Page', 'Post', 'Session', 'Package'];

const EMPTY_RATE = {
  id: null,
  name: '',
  category: '',
  unit: 'Project',
  hsnSacCode: '',
  description: '',
  priceINR: '',
};

// ─── Persistence helpers ──────────────────────────────────────────────────────

function loadRates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  // Default seed data
  return [
    {
      id: crypto.randomUUID(),
      name: 'Static Website',
      category: 'Web Development',
      unit: 'Project',
      hsnSacCode: '998314',
      description: 'Up to 5 pages, responsive design, contact form',
      priceINR: 15000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Dynamic Web Application',
      category: 'Web Development',
      unit: 'Project',
      hsnSacCode: '998314',
      description: 'Custom CMS, database integration, API development',
      priceINR: 50000,
    },
    {
      id: crypto.randomUUID(),
      name: 'E-Commerce Store',
      category: 'Web Development',
      unit: 'Project',
      hsnSacCode: '998314',
      description: 'Full-featured online store with payment gateway',
      priceINR: 75000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Android / iOS App',
      category: 'Mobile Development',
      unit: 'Project',
      hsnSacCode: '998315',
      description: 'Cross-platform mobile application',
      priceINR: 80000,
    },
    {
      id: crypto.randomUUID(),
      name: 'UI/UX Design (per screen)',
      category: 'UI/UX Design',
      unit: 'Page',
      hsnSacCode: '998399',
      description: 'Figma wireframes + high-fidelity mockups',
      priceINR: 2000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Logo & Brand Identity',
      category: 'Branding',
      unit: 'Project',
      hsnSacCode: '998399',
      description: 'Logo, colour palette, typography guide, brand kit',
      priceINR: 12000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Product Photography',
      category: 'Photography',
      unit: 'Session',
      hsnSacCode: '999000',
      description: 'Studio shoot, 20 edited images',
      priceINR: 8000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Promotional Video',
      category: 'Videography',
      unit: 'Project',
      hsnSacCode: '999000',
      description: '60–90 sec corporate/promo reel with motion graphics',
      priceINR: 25000,
    },
    {
      id: crypto.randomUUID(),
      name: 'SEO (Monthly)',
      category: 'SEO',
      unit: 'Month',
      hsnSacCode: '998361',
      description: 'On-page + off-page SEO, monthly reporting',
      priceINR: 10000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Social Media Management',
      category: 'Digital Marketing',
      unit: 'Month',
      hsnSacCode: '998361',
      description: '3 platforms, 12 posts/month, analytics report',
      priceINR: 12000,
    },
  ];
}

function saveRates(rates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
  } catch {
    // ignore
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value / USD_RATE);
}

// ─── RateFormDialog ───────────────────────────────────────────────────────────

function RateFormDialog({ open, initialData, onClose, onSave }) {
  const isEdit = Boolean(initialData?.id);
  const [form, setForm] = useState(initialData ?? EMPTY_RATE);
  const [errors, setErrors] = useState({});

  // Sync when dialog is re-opened with new initialData
  React.useEffect(() => {
    setForm(initialData ?? EMPTY_RATE);
    setErrors({});
  }, [initialData, open]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }));

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.unit) errs.unit = 'Unit is required';
    if (!form.priceINR || Number(form.priceINR) <= 0)
      errs.priceINR = 'Enter a valid price';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      id: form.id ?? crypto.randomUUID(),
      priceINR: Number(form.priceINR),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Rate' : 'Add New Rate'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Service name */}
          <div>
            <Label htmlFor="rate-name">Service / Item Name *</Label>
            <Input
              id="rate-name"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Static Website"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* Unit + HSN/SAC row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Unit *</Label>
              <Select value={form.unit} onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
            </div>
            <div>
              <Label htmlFor="rate-hsn">HSN / SAC Code</Label>
              <Input
                id="rate-hsn"
                value={form.hsnSacCode}
                onChange={set('hsnSacCode')}
                placeholder="e.g. 998314"
              />
            </div>
          </div>

          {/* Price (INR) */}
          <div>
            <Label htmlFor="rate-price">Rate (₹ INR) *</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">₹</span>
              <Input
                id="rate-price"
                type="number"
                min="1"
                value={form.priceINR}
                onChange={set('priceINR')}
                className="pl-8"
                placeholder="0"
              />
            </div>
            {errors.priceINR && <p className="text-xs text-red-500 mt-1">{errors.priceINR}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="rate-desc">Description / Scope</Label>
            <Input
              id="rate-desc"
              value={form.description}
              onChange={set('description')}
              placeholder="Short description of what's included"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Update Rate' : 'Add Rate'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── DeleteConfirmDialog ──────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, rateName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Rate</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{rateName}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main RateCard page ───────────────────────────────────────────────────────

export default function RateCard() {
  const [rates, setRates] = useState(loadRates);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currency, setCurrency] = useState('INR');

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Persist on every change
  const updateRates = useCallback((next) => {
    setRates(next);
    saveRates(next);
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────────

  const availableCategories = ['All', ...Array.from(new Set(rates.map((r) => r.category))).sort()];

  const filtered = rates.filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || r.category === filterCategory;
    return matchSearch && matchCat;
  });

  // Group by category for display
  const grouped = filtered.reduce((acc, rate) => {
    (acc[rate.category] = acc[rate.category] || []).push(rate);
    return acc;
  }, {});

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(rate) {
    setEditTarget(rate);
    setFormOpen(true);
  }

  function handleFormSave(rate) {
    if (rate.id && rates.some((r) => r.id === rate.id)) {
      updateRates(rates.map((r) => (r.id === rate.id ? rate : r)));
      toast.success('Rate updated');
    } else {
      updateRates([...rates, rate]);
      toast.success('Rate added');
    }
    setFormOpen(false);
  }

  function openDelete(rate) {
    setDeleteTarget(rate);
    setDeleteOpen(true);
  }

  function handleDelete() {
    updateRates(rates.filter((r) => r.id !== deleteTarget.id));
    toast.success('Rate deleted');
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  // ── PDF export ────────────────────────────────────────────────────────────────

  function exportPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(126, 87, 194); // primary purple
    doc.text('SHOTLIN', 14, 18);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 120);
    doc.text('Rate Card', 14, 25);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 14, 31);

    // Line
    doc.setDrawColor(200, 200, 220);
    doc.line(14, 34, 196, 34);

    let yOffset = 40;

    const categoriesToPrint = Object.keys(grouped).sort();

    categoriesToPrint.forEach((cat) => {
      const rows = grouped[cat];

      // Category heading
      doc.setFontSize(11);
      doc.setTextColor(94, 53, 177);
      doc.setFont(undefined, 'bold');
      doc.text(cat, 14, yOffset);
      doc.setFont(undefined, 'normal');
      yOffset += 4;

      autoTable(doc, {
        startY: yOffset,
        head: [['Service / Item', 'HSN/SAC', 'Unit', 'Rate (₹ INR)', 'Rate ($ USD)', 'Description']],
        body: rows.map((r) => [
          r.name,
          r.hsnSacCode || '—',
          r.unit,
          formatINR(r.priceINR),
          formatUSD(r.priceINR),
          r.description || '—',
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [126, 87, 194], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [247, 243, 255] },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 28, halign: 'right' },
          4: { cellWidth: 28, halign: 'right' },
          5: { cellWidth: 'auto' },
        },
        margin: { left: 14, right: 14 },
        tableLineColor: [220, 220, 230],
        tableLineWidth: 0.1,
      });

      yOffset = doc.lastAutoTable.finalY + 8;

      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Footer note
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(
      `* All prices are exclusive of GST (${GST_RATE}%). USD rate is indicative (1 USD ≈ ₹${USD_RATE}).`,
      14,
      doc.internal.pageSize.height - 10,
    );

    doc.save('Shotlin_Rate_Card.pdf');
    toast.success('Rate card PDF downloaded');
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const totalRates = rates.length;
  const filteredCount = filtered.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Rate Card</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and export your full-detail service rate file
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Rates</p>
            <p className="text-3xl font-bold mt-1">{totalRates}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Categories</p>
            <p className="text-3xl font-bold mt-1">
              {new Set(rates.map((r) => r.category)).size}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Lowest Rate</p>
            <p className="text-2xl font-bold mt-1">
              {rates.length ? formatINR(Math.min(...rates.map((r) => r.priceINR))) : '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Highest Rate</p>
            <p className="text-2xl font-bold mt-1">
              {rates.length ? formatINR(Math.max(...rates.map((r) => r.priceINR))) : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters row */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search rates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8"
              />
              {search && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
                  onClick={() => setSearch('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency toggle */}
            <ToggleGroup
              type="single"
              value={currency}
              onValueChange={(v) => v && setCurrency(v)}
              className="inline-flex rounded-lg bg-muted p-1"
            >
              <ToggleGroupItem
                value="INR"
                className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <IndianRupee className="h-4 w-4 mr-1" />
                INR
              </ToggleGroupItem>
              <ToggleGroupItem
                value="USD"
                className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                USD
              </ToggleGroupItem>
            </ToggleGroup>

            {filteredCount !== totalRates && (
              <span className="text-sm text-muted-foreground">
                Showing {filteredCount} of {totalRates}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate tables grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center text-muted-foreground">
            {search || filterCategory !== 'All'
              ? 'No rates match your filters.'
              : 'No rates yet. Click "Add Rate" to get started.'}
          </CardContent>
        </Card>
      ) : (
        Object.keys(grouped)
          .sort()
          .map((cat) => (
            <Card key={cat} className="shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b py-3 px-5">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{grouped[cat].length}</Badge>
                  {cat}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-slate-50/50 text-xs text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Service / Item</th>
                        <th className="px-4 py-3 text-left font-medium">HSN/SAC</th>
                        <th className="px-4 py-3 text-left font-medium">Unit</th>
                        <th className="px-4 py-3 text-right font-medium">Rate</th>
                        <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {grouped[cat].map((rate) => (
                        <tr key={rate.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium">{rate.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {rate.hsnSacCode || <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{rate.unit}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">
                            {currency === 'INR'
                              ? formatINR(rate.priceINR)
                              : formatUSD(rate.priceINR)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell max-w-xs truncate">
                            {rate.description || <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => openEdit(rate)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => openDelete(rate)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
      )}

      {/* Footer note */}
      <Separator />
      <p className="text-xs text-muted-foreground pb-4">
        * All rates are exclusive of GST ({GST_RATE}%). USD conversion is indicative (1 USD ≈ ₹{USD_RATE}).
        Rates are stored locally and exported as a PDF rate file on request.
      </p>

      {/* Dialogs */}
      <RateFormDialog
        open={formOpen}
        initialData={editTarget}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        rateName={deleteTarget?.name}
        onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
