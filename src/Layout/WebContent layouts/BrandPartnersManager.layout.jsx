// src/components/BrandPartnersManager.jsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function BrandPartnersManager({ initialData }) {
  const [partners, setPartners] = useState(initialData || []);
  const [selected, setSelected] = useState(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', logoURL: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize state with props
  useEffect(() => {
    setPartners(initialData || []);
  }, [initialData]);

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple submissions
    if (formData.name.trim() === '' || formData.logoURL.trim() === '') {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (selected) {
        // Update existing partner
        setPartners((list) =>
          list.map((p) =>
            p.id === selected.id
              ? { ...p, brandName: formData.name, brandLogo: formData.logoURL }
              : p
          )
        );
        toast.success('Partner updated successfully.');
      } else {
        // Add new partner
        const newId = `BP-${Date.now()}`;
        setPartners((list) => [
          ...list,
          { id: newId, brandName: formData.name, brandLogo: formData.logoURL },
        ]);
        toast.success('Partner added successfully.');
      }
      setFormOpen(false);
      setSelected(null);
      setFormData({ name: '', logoURL: '' });
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = () => {
    setPartners((list) => list.filter((p) => p.id !== selected.id));
    toast.success('Partner deleted successfully.');
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Brand Partners</h3>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setSelected(null);
              setFormData({ name: '', logoURL: '' });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Partner</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                {selected ? 'Edit Partner' : 'New Partner'}
              </h2>
              <p className="text-sm text-gray-500">
                {selected
                  ? `Modify details for ${selected.brandName}`
                  : 'Enter details for a new brand partner.'}
              </p>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Logo URL
                </label>
                <Input
                  value={formData.logoURL}
                  onChange={(e) =>
                    setFormData({ ...formData, logoURL: e.target.value })
                  }
                  placeholder="https://...png"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 flex flex-col items-center space-y-3 bg-gray-50"
          >
            <img
              src={p.brandLogo}
              alt={p.brandName}
              className="h-20 w-20 object-contain rounded"
            />
            <div className="text-lg font-medium">{p.brandName}</div>
            <div className="text-xs text-gray-400">{p.id}</div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelected(p);
                  setFormData({
                    name: p.brandName,
                    logoURL: p.brandLogo,
                  });
                  setFormOpen(true);
                }}
              >
                Edit
              </Button>

              <Dialog
                open={isDeleteOpen && selected?.id === p.id}
                onOpenChange={(open) => setDeleteOpen(open)}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelected(p);
                      setDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">Delete Partner</h2>
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete{' '}
                      <span className="font-semibold">
                        {selected?.brandName}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button variant="destructive" onClick={confirmDelete}>
                      Delete
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
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
