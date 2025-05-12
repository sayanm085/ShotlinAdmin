// src/Layout/WebContent layouts/ServicesManager.layout.jsx
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
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { useUpdateServicesContent } from '@/Hooks/useWebContent.js';

export default function ServicesManager({ initialData }) {
  const [services, setServices] = useState(initialData || []);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { mutateAsync, isLoading: isSaving } = useUpdateServicesContent();

  useEffect(() => {
    setServices(initialData || []);
  }, [initialData]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please enter both name and description.');
      return;
    }

    const payload = {
      servicesContentUpdate: selected
        ? [{
            serviceId: selected._id,
            serviceName: formData.name,
            serviceDescription: formData.description,
          }]
        : [],
      NewServicesContentAdd: selected
        ? []
        : [{
            serviceName: formData.name,
            serviceDescription: formData.description,
          }],
      servicesContentDelete: [],
    };

    try {
      await mutateAsync(payload);
      toast.success(`Service ${selected ? 'updated' : 'added'} successfully`);
      setFormOpen(false);
      setSelected(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    const payload = {
      servicesContentUpdate: [],
      NewServicesContentAdd: [],
      servicesContentDelete: [selected._id],
    };

    try {
      await mutateAsync(payload);
      toast.success('Service deleted successfully');
      setDeleteOpen(false);
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      {/* Header + Add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Services Content</h3>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setSelected(null);
              setFormData({ name: '', description: '' });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                {selected ? 'Edit Service' : 'New Service'}
              </h2>
              <p className="text-sm text-gray-500">
                {selected
                  ? `Modify service “${selected.serviceName}”`
                  : 'Enter details for a new service.'}
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="E.g., Mobile App Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the service"
                />
              </div>
            </div>
            <DialogFooter className="mt-4 space-x-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : selected ? 'Update' : 'Add'}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services table */}
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((svc) => (
              <TableRow key={svc._id} className="hover:bg-gray-50">
                <TableCell>{svc._id}</TableCell>
                <TableCell>{svc.serviceName}</TableCell>
                <TableCell
                  className="max-w-xs truncate"
                  title={svc.serviceDescription}
                >
                  {svc.serviceDescription}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(svc);
                      setFormData({
                        name: svc.serviceName,
                        description: svc.serviceDescription,
                      });
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Dialog
                    open={isDeleteOpen && selected?._id === svc._id}
                    onOpenChange={(open) => setDeleteOpen(open)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(svc);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className="text-xl font-bold">Delete Service</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{selected?.serviceName}</span>?
                        This cannot be undone.
                      </p>
                      <DialogFooter className="mt-4 space-x-2">
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
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
