import React, { useState, useEffect } from 'react';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function WhyChooseUsManager({ initialData = [] }) {
  const [items, setItems] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', reason: '', logoURL: '', logoFile: null });

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.reason.trim()) {
      toast.error('Please fill in both title and reason.');
      return;
    }

    const finalLogo = formData.logoFile
      ? URL.createObjectURL(formData.logoFile)
      : formData.logoURL;

    if (selected) {
      setItems((list) =>
        list.map((it) =>
          it.id === selected.id
            ? { ...it, title: formData.title, reason: formData.reason, logo: finalLogo }
            : it
        )
      );
      toast.success('Item updated (demo)');
    } else {
      const newId = `WC-${Date.now()}`;
      setItems((list) => [
        ...list,
        { id: newId, title: formData.title, reason: formData.reason, logo: finalLogo },
      ]);
      toast.success('Item added (demo)');
    }

    setFormOpen(false);
    setSelected(null);
    setFormData({ title: '', reason: '', logoURL: '', logoFile: null });
  };

  const confirmDelete = () => {
    setItems((list) => list.filter((it) => it.id !== selected.id));
    toast.success('Item deleted (demo)');
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Why Choose Us</h3>
        <Dialog open={isFormOpen} onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) {
            setSelected(null);
            setFormData({ title: '', reason: '', logoURL: '', logoFile: null });
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{selected ? 'Edit Item' : 'New Item'}</h2>
              <p className="text-sm text-gray-500">
                {selected
                  ? `Modify item ${selected.title}`
                  : 'Enter details for a new item.'}
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Why choose us?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL or Upload</label>
                <Input
                  value={formData.logoURL}
                  onChange={(e) => setFormData({ ...formData, logoURL: e.target.value, logoFile: null })}
                  placeholder="https://...png"
                  className="mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData({ ...formData, logoFile: e.target.files[0], logoURL: '' });
                    }
                  }}
                  className="block w-full text-sm text-gray-600"
                />
                {(formData.logoURL || formData.logoFile) && (
                  <img
                    src={
                      formData.logoFile
                        ? URL.createObjectURL(formData.logoFile)
                        : formData.logoURL
                    }
                    alt="Preview"
                    className="mt-3 h-20 w-20 object-contain rounded"
                  />
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleSave}>{selected ? 'Update' : 'Add'}</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id} className="hover:bg-gray-50">
                <TableCell>{it.id}</TableCell>
                <TableCell>
                  <img src={it.logo} alt={it.title} className="h-10 w-10 object-contain rounded" />
                </TableCell>
                <TableCell>{it.title}</TableCell>
                <TableCell className="max-w-xs truncate" title={it.reason}>
                  {it.reason}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(it);
                      setFormData({ title: it.title, reason: it.reason, logoURL: it.logo, logoFile: null });
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Dialog open={isDeleteOpen && selected?.id === it.id} onOpenChange={(o) => setDeleteOpen(o)}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(it);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">Delete Item</h2>
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete{' '}
                          <span className="font-semibold">{selected?.title}</span>? This cannot be undone.
                        </p>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
