import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import axiosInstance from '@/lib/axios';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ConversionModal = ({ isOpen, onClose, invoice }) => {
  const navigate = useNavigate();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionType, setConversionType] = useState(invoice?.type === 'quotation' ? 'advance' : 'final');
  const [advancePercent, setAdvancePercent] = useState(40);
  const [discountCode, setDiscountCode] = useState('');

  const handleConversion = async () => {
    setIsConverting(true);
    
    try {
      let endpoint;
      let payload;
      
      // Set up the endpoint and payload based on the invoice type
      if (invoice.type === 'quotation') {
        endpoint = '/api/v1/invoice/invoice-from-quotation';
        payload = {
          quotationId: invoice._id,
          type: conversionType
        };
        
        // Add advance percent if converting to advance payment
        if (conversionType === 'advance') {
          payload.advancepaymentpercent = parseInt(advancePercent, 10);
        }
      } else if (invoice.type === 'advance') {
        endpoint = '/api/v1/invoice/invoice-from-advance';
        payload = {
          advanceInvoiceId: invoice._id
        };
      }
      
      // Add discount code if provided
      if (discountCode.trim()) {
        payload.discountCode = discountCode.trim();
      }
      
      // Make API call
      const response = await axiosInstance.post(endpoint, payload);
      
      // Handle success
      if (response.data && response.data.success) {
        toast.success(
          invoice.type === 'quotation' 
            ? `Quotation converted to ${conversionType === 'advance' ? 'advance payment' : 'final'} invoice successfully` 
            : 'Advance payment converted to final invoice successfully'
        );
        
        // Navigate to the new invoice
        navigate(`/invoice/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      toast.error(error.response?.data?.message || 'Failed to convert invoice');
    } finally {
      setIsConverting(false);
      onClose();
    }
  };

  // Different content based on invoice type
  const renderContent = () => {
    if (invoice.type === 'quotation') {
      return (
        <>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Convert To</Label>
              <RadioGroup 
                value={conversionType} 
                onValueChange={setConversionType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advance" id="advance" />
                  <Label htmlFor="advance" className="font-normal cursor-pointer">
                    Advance Payment Invoice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="final" id="final" />
                  <Label htmlFor="final" className="font-normal cursor-pointer">
                    Final Invoice
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {conversionType === 'advance' && (
              <div className="space-y-2">
                <Label htmlFor="advancePercent">Advance Payment Percentage</Label>
                <div className="flex items-center">
                  <Input
                    id="advancePercent"
                    type="number"
                    min="1"
                    max="100"
                    value={advancePercent}
                    onChange={(e) => setAdvancePercent(e.target.value)}
                    className="w-24"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="discountCode">Discount Code (Optional)</Label>
              <Input
                id="discountCode"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </div>
          </div>
        </>
      );
    } else if (invoice.type === 'advance') {
      return (
        <div className="space-y-4 py-2">
          <p>You're converting an advance payment invoice to a final invoice.</p>
          
          <div className="space-y-2">
            <Label htmlFor="discountCode">Discount Code (Optional)</Label>
            <Input
              id="discountCode"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>
        </div>
      );
    }
    
    return <p>Unsupported invoice type for conversion.</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Convert {invoice?.type === 'quotation' ? 'Quotation' : 'Advance Payment'}
          </DialogTitle>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConverting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConversion} 
            disabled={isConverting || (invoice?.type === 'quotation' && conversionType === 'advance' && (advancePercent < 1 || advancePercent > 100))}
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Convert
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionModal;