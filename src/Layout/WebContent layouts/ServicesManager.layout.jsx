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

export default function ServicesManager({ initialData }) {
  const [services, setServices] = useState(initialData || []);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    setServices(initialData || []);
  }, [initialData]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please enter both name and description.');
      return;
    }

    if (selected) {
      setServices((list) =>
        list.map((svc) =>
          svc.id === selected.id
            ? { ...svc, serviceName: formData.name, serviceDescription: formData.description }
            : svc
        )
      );
      toast.success('Service updated (demo)');
    } else {
      const newId = `SV-${Date.now()}`;
      setServices((list) => [
        ...list,
        { id: newId, serviceName: formData.name, serviceDescription: formData.description },
      ]);
      toast.success('Service added (demo)');
    }

    setFormOpen(false);
    setSelected(null);
    setFormData({ name: '', description: '' });
  };

  const confirmDelete = () => {
    setServices((list) => list.filter((svc) => svc.id !== selected.id));
    toast.success('Service deleted (demo)');
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
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
              <h2 className="text-xl font-bold">{selected ? 'Edit Service' : 'New Service'}</h2>
              <p className="text-sm text-gray-500">
                {selected
                  ? `Modify service ${selected.serviceName}`
                  : 'Enter details for a new service.'}
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g., Mobile App Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the service"
                />
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
              <TableRow key={svc.id} className="hover:bg-gray-50">
                <TableCell>{svc.id}</TableCell>
                <TableCell>{svc.serviceName}</TableCell>
                <TableCell className="max-w-xs truncate" title={svc.serviceDescription}>
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
                    open={isDeleteOpen && selected?.id === svc.id}
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
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">Delete Service</h2>
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete{' '}
                          <span className="font-semibold">{selected?.serviceName}</span>? This
                          cannot be undone.
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
