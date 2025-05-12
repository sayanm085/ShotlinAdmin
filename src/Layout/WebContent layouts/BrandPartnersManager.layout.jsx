import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { updateBrandPartnersContent } from '@/Api/WebContent.api';

export default function BrandPartnersManager({ initialData }) {
  const [partners, setPartners] = useState(initialData || []);
  const [selected, setSelected] = useState(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', logoURL: '', file: null });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const qc = useQueryClient();

  useEffect(() => setPartners(initialData || []), [initialData]);

  const callApi = async fd => {
    const updated = await updateBrandPartnersContent(fd);
    qc.invalidateQueries(['webContent']);
    return updated;
  };

  const handleSave = async () => {
    setErrorMsg(null);
    if (isSaving) return;
    if (!formData.name.trim() || (!formData.logoURL && !formData.file)) {
      setErrorMsg('Both name and logo are required.');
      return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('text', formData.name);
      if (formData.file) fd.append('brandLogo', formData.file);
      fd.append('type', selected ? 'brandPevContentUpdate' : 'NewbrandContentAdd');
      if (selected) fd.append('id', selected._id);

      await callApi(fd);
      toast.success('Partner saved successfully');
      setFormOpen(false);
      setSelected(null);
      setFormData({ name: '', logoURL: '', file: null });
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
      fd.append('type', 'brandContentDelete');
      fd.append('id', selected._id);
      await callApi(fd);
      toast.success('Partner deleted successfully');
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
    <div className="p-6 bg-white rounded-lg shadow max-w-5xl mx-auto space-y-6">
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Brand Partners</h3>
        <Dialog open={isFormOpen} onOpenChange={open => {
          setFormOpen(open);
          if (!open) {
            setSelected(null);
            setFormData({ name: '', logoURL: '', file: null });
            setErrorMsg(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add Partner</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Accessible title for screen readers */}
            <DialogTitle>
              <VisuallyHidden>Brand Partner Form</VisuallyHidden>
            </DialogTitle>
            <h2 className="text-xl font-bold mb-2">{selected ? 'Edit' : 'New'} Partner</h2>
            <div className="space-y-4">
              <Input
                placeholder="Brand Name"
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                placeholder="Logo URL"
                value={formData.logoURL}
                onChange={e => setFormData(f => ({ ...f, logoURL: e.target.value, file: null }))}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && setFormData(f => ({ ...f, file: e.target.files[0], logoURL: '' }))}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {partners.map(p => (
          <div key={p._id} className="border rounded-lg p-4 flex flex-col items-center space-y-3 bg-gray-50">
            <img src={p.brandLogo} alt="" className="h-20 w-20 object-contain rounded" />
            <div className="text-lg font-medium">{p.brandName}</div>
            <div className="text-xs text-gray-400">{p._id}</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => {
                setSelected(p);
                setFormData({ name: p.brandName, logoURL: p.brandLogo, file: null });
                setErrorMsg(null);
                setFormOpen(true);
              }}>
                Edit
              </Button>
              <Dialog open={isDeleteOpen && selected?._id === p._id} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive" onClick={() => {
                    setSelected(p);
                    setErrorMsg(null);
                    setDeleteOpen(true);
                  }}>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    <VisuallyHidden>Confirm Delete Partner</VisuallyHidden>
                  </DialogTitle>
                  <p>Delete {selected?.brandName}? This cannot be undone.</p>
                  <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}