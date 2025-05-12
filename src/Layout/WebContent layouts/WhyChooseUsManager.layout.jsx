import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { updateWhyChooseUsContent } from '@/Api/WebContent.api';

export default function WhyChooseUsManager({ initialData = [] }) {
  const [items, setItems] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', reason: '', logoURL: '', logoFile: null });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const qc = useQueryClient();

  useEffect(() => {
    setItems(Array.isArray(initialData) ? initialData : []);
  }, [initialData]);

  const callApi = async (fd) => {
    const updated = await updateWhyChooseUsContent(fd);
    qc.invalidateQueries(['webContent']);
    return updated;
  };

  const handleSave = async () => {
    setErrorMsg(null);
    if (isSaving) return;
    const { title, reason, logoURL, logoFile } = formData;
    if (!title.trim() || !reason.trim() || (!logoURL && !logoFile)) {
      setErrorMsg('Title, reason, and logo are required.');
      return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('reason', reason);
      if (logoFile) fd.append('WhyChooseUsLogo', logoFile);
      fd.append('type', selected ? 'whyChooseUsContentUpdate' : 'NewWhyChooseUsContentAdd');
      if (selected) fd.append('id', selected._id);

      await callApi(fd);
      toast.success('Item saved successfully');
      setFormOpen(false);
      setSelected(null);
      setFormData({ title: '', reason: '', logoURL: '', logoFile: null });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Save failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setErrorMsg(null);
    if (!selected) return;
    try {
      const fd = new FormData();
      fd.append('type', 'WhyChooseUsContentDelete');
      fd.append('id', selected._id);
      await callApi(fd);
      toast.success('Item deleted successfully');
      setDeleteOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Why Choose Us</h3>
        <Dialog open={isFormOpen} onOpenChange={open => {
          setFormOpen(open);
          if (!open) {
            setSelected(null);
            setFormData({ title: '', reason: '', logoURL: '', logoFile: null });
            setErrorMsg(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              <VisuallyHidden>Why Choose Us Form</VisuallyHidden>
            </DialogTitle>
            <h2 className="text-xl font-bold mb-2">{selected ? 'Edit Item' : 'New Item'}</h2>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              />
              <Textarea
                rows={3}
                placeholder="Reason"
                value={formData.reason}
                onChange={e => setFormData(f => ({ ...f, reason: e.target.value }))}
              />
              <Input
                placeholder="Logo URL"
                value={formData.logoURL}
                onChange={e => setFormData(f => ({ ...f, logoURL: e.target.value, logoFile: null }))}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && setFormData(f => ({ ...f, logoFile: e.target.files[0], logoURL: '' }))}
                className="block"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
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
            {items.map(it => (
              <TableRow key={it._id} className="hover:bg-gray-50">
                <TableCell>{it._id}</TableCell>
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
                      setErrorMsg(null);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Dialog open={isDeleteOpen && selected?._id === it._id} onOpenChange={open => setDeleteOpen(open)}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(it);
                          setErrorMsg(null);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>
                        <VisuallyHidden>Confirm Delete</VisuallyHidden>
                      </DialogTitle>
                      <p>Delete {selected?.title}? This cannot be undone.</p>
                      <DialogFooter>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
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
