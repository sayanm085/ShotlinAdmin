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

export default function FAQsManager({ initialData }) {
  // Map incoming API shape to local FAQ shape
  const mapToFAQ = (data) =>
    data.map((item) => ({
      id: item._id,
      question: item.FAQsQuestion,
      answer: item.FAQsAnswer,
    }));

  // State to manage FAQs
  const [faqs, setFaqs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  // Sync with incoming prop
  useEffect(() => {
    setFaqs(mapToFAQ(initialData || []));
  }, [initialData]);

  const handleSave = () => {
    const { question, answer } = formData;
    if (!question.trim() || !answer.trim()) {
      toast.error('Please enter both question and answer.');
      return;
    }

    if (selected) {
      setFaqs((list) =>
        list.map((fq) =>
          fq.id === selected.id ? { ...fq, question, answer } : fq
        )
      );
      toast.success('FAQ updated');
    } else {
      const newId = `temp-${Date.now()}`;
      setFaqs((list) => [...list, { id: newId, question, answer }]);
      toast.success('FAQ added');
    }

    setFormOpen(false);
    setSelected(null);
    setFormData({ question: '', answer: '' });
  };

  const confirmDelete = () => {
    if (!selected) return;
    setFaqs((list) => list.filter((fq) => fq.id !== selected.id));
    toast.success('FAQ deleted');
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">FAQs Content</h3>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setSelected(null);
              setFormData({ question: '', answer: '' });
            }
          }}
        >
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
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Enter FAQ question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <Textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
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

      {/* FAQ Table */}
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
                  <Dialog
                    open={isDeleteOpen && selected?.id === fq.id}
                    onOpenChange={setDeleteOpen}
                  >
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
                          Are you sure you want to delete{' '}
                          <span className="font-semibold">{selected?.id}</span>? This cannot be undone.
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
