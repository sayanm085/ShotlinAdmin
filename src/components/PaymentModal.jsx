import React, { useState } from 'react';
import { Loader2, Check, CreditCard, Receipt, Landmark, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/lib/axios';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const PaymentModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: invoice?.summary?.total || 0,
    reference: `TXN${format(new Date(), 'yyyyMMdd')}${Math.floor(1000 + Math.random() * 9000)}`,
    paymentMethod: 'bank_transfer',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async () => {
    if (paymentData.amount <= 0) {
      toast.error('Payment amount must be greater than zero');
      return;
    }

    if (!paymentData.reference) {
      toast.error('Payment reference is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(`/api/v1/invoice/${invoice._id}/payment`, paymentData);
      
      if (response.data && response.data.success) {
        toast.success('Payment recorded successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment method options with icons
  const paymentMethods = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: <Landmark className="h-4 w-4" /> },
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'cash', label: 'Cash', icon: <Wallet className="h-4 w-4" /> },
    { id: 'upi', label: 'UPI', icon: <Receipt className="h-4 w-4" /> }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center">
              <span className="mr-2">₹</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentData.amount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Payment Reference</Label>
            <Input
              id="reference"
              name="reference"
              value={paymentData.reference}
              onChange={handleInputChange}
              placeholder="e.g., Transaction ID, Check No."
            />
            <p className="text-xs text-muted-foreground">
              Enter a unique reference for this payment
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup 
              value={paymentData.paymentMethod} 
              onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}
              className="flex flex-col space-y-2"
            >
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="font-normal cursor-pointer flex items-center">
                    {method.icon}
                    <span className="ml-2">{method.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Payment Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={paymentData.notes}
              onChange={handleInputChange}
              placeholder="Additional details about this payment"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Record Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;