// src/Layout/WebContent layouts/FAQsManager.layout.jsx
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
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFAQsContent } from '@/Api/WebContent.api';

export default function FAQsManager({ initialData = [] }) {
  // 1️⃣ Map API shape to local
  const normalize = (arr) =>
    arr.map((x) => ({
      id: x._id,
      question: x.FAQsQuestion,
      answer: x.FAQsAnswer,
    }));

  // 2️⃣ Local state
  const [faqs, setFaqs] = useState(normalize(initialData));
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  // 3️⃣ Keep in sync when prop changes
  useEffect(() => {
    setFaqs(normalize(initialData));
  }, [initialData]);

  // 4️⃣ React Query Client for invalidation
  const qc = useQueryClient();

  // 5️⃣ Mutation for add/update/delete
  const mutation = useMutation({
    mutationFn: (payload) => updateFAQsContent(payload),
    onSuccess: () => {
      // refetch the whole webContent
      qc.invalidateQueries(['webContent']);
      toast.success('Changes saved');
      setFormOpen(false);
      setDeleteOpen(false);
      setSelected(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    },
  });

  // 6️⃣ Handlers
  const handleSave = () => {
    const { question, answer } = formData;
    if (!question.trim() || !answer.trim()) {
      return toast.error('Both question and answer are required');
    }

    // Build payload following your backend shape
    if (selected) {
      // update
      mutation.mutate({
        FAQsContentUpdate: [
          { FAQsId: selected.id, FAQsQuestion: question, FAQsAnswer: answer },
        ],
        NewFAQsContentAdd: [],
        FAQsContentDelete: [],
      });
    } else {
      // add
      mutation.mutate({
        FAQsContentUpdate: [],
        NewFAQsContentAdd: [{ FAQsQuestion: question, FAQsAnswer: answer }],
        FAQsContentDelete: [],
      });
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    mutation.mutate({
      FAQsContentUpdate: [],
      NewFAQsContentAdd: [],
      FAQsContentDelete: [selected.id],
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
            <DialogTitle>{selected ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Question</label>
                <Input
                  value={formData.question}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, question: e.target.value }))
                  }
                  placeholder="Enter FAQ question"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Answer</label>
                <Textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, answer: e.target.value }))
                  }
                  placeholder="Enter FAQ answer"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleSave} disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Saving…' : selected ? 'Update' : 'Add'}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
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
                <TableCell title={fq.question}>{fq.question}</TableCell>
                <TableCell title={fq.answer}>{fq.answer}</TableCell>
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
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <p>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{fq.question}</span>?
                      </p>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={mutation.isLoading}
                        >
                          {mutation.isLoading ? 'Deleting…' : 'Delete'}
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
