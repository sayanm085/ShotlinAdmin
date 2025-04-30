import React, { useState } from 'react';
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
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

/**
 * FAQsManager
 * Demo admin UI to list, add, edit, and delete FAQ items.
 * Shows preview of existing question/answer to identify changes.
 */
export default function FAQsManager() {
  // Demo initial FAQs
  const initialFAQs = [
    { id: 'FQ-001', question: 'What is Shortlin?', answer: 'Shortlin is a comprehensive SaaS platform offering B2B, B2C, and B2G solutions.' },
    { id: 'FQ-002', question: 'How do I reset my password?', answer: 'Go to Settings > Account > Reset Password and follow the onscreen instructions.' },
    { id: 'FQ-003', question: 'Can I integrate with third-party APIs?', answer: 'Yes, Shortlin supports integrations with various third-party services via REST and Webhooks.' },
  ];

  const [faqs, setFaqs] = useState(initialFAQs);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  // Handle add/edit save
  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please enter both question and answer.');
      return;
    }
    if (selected) {
      setFaqs((list) =>
        list.map((fq) =>
          fq.id === selected.id
            ? { ...fq, question: formData.question, answer: formData.answer }
            : fq
        )
      );
      toast.success('FAQ updated (demo)');
    } else {
      const newId = `FQ-${String(faqs.length + 1).padStart(3, '0')}`;
      setFaqs((list) => [
        ...list,
        { id: newId, question: formData.question, answer: formData.answer },
      ]);
      toast.success('FAQ added (demo)');
    }
    setFormOpen(false);
    setSelected(null);
    setFormData({ question: '', answer: '' });
  };

  // Confirm delete
  const confirmDelete = () => {
    setFaqs((list) => list.filter((fq) => fq.id !== selected.id));
    toast.success('FAQ deleted (demo)');
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">FAQs Content</h3>
        <Dialog open={isFormOpen} onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) {
            setSelected(null);
            setFormData({ question: '', answer: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add FAQ</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{selected ? 'Edit FAQ' : 'New FAQ'}</h2>
              <p className="text-sm text-gray-500">
                {selected
                  ? `Modify FAQ ${selected.id}`
                  : 'Enter details for a new FAQ question and answer.'}
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter FAQ question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <Textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter FAQ answer"
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
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((fq) => (
              <TableRow key={fq.id} className="hover:bg-gray-50">
                <TableCell>{fq.id}</TableCell>
                <TableCell className="max-w-xs truncate" title={fq.question}>
                  {fq.question}
                </TableCell>
                <TableCell className="max-w-xs truncate" title={fq.answer}>
                  {fq.answer}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(fq);
                      setFormData({ question: fq.question, answer: fq.answer });
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Dialog open={isDeleteOpen && selected?.id === fq.id} onOpenChange={(o) => setDeleteOpen(o)}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(fq);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">Delete FAQ</h2>
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete <span className="font-semibold">{selected?.id}</span>? This cannot be undone.
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
