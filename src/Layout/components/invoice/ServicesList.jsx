import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';
import { Plus, Trash2, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

import { formatCurrency } from './utils/invoiceUtils';

export default function ServicesList({ services, setServices }) {
  const addService = () => {
    setServices([
      ...services,
      {
        id: nanoid(),
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        hsnSacCode: ''
      }
    ]);
  };
  
  const removeService = (id) => {
    if (services.length <= 1) {
      toast.error("You can't remove the last item");
      return;
    }
    
    setServices(services.filter(service => service.id !== id));
  };
  
  const handleServiceChange = (id, field, value) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const updatedService = { ...service, [field]: value };
        
        // Auto-calculate amount when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedService.amount = updatedService.quantity * updatedService.unitPrice;
        }
        
        return updatedService;
      }
      return service;
    }));
  };

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-row justify-between items-center">
        <CardTitle className="flex items-center text-lg font-semibold">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Items & Services
        </CardTitle>
        
        <Button variant="outline" size="sm" onClick={addService}>
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr className="text-xs text-slate-500">
                <th className="px-4 py-3 text-left font-medium w-[30%]">Item & Description</th>
                <th className="px-4 py-3 text-left font-medium w-[15%]">HSN/SAC</th>
                <th className="px-4 py-3 text-right font-medium w-[15%]">Quantity</th>
                <th className="px-4 py-3 text-right font-medium w-[15%]">Rate</th>
                <th className="px-4 py-3 text-right font-medium w-[20%]">Amount</th>
                <th className="px-4 py-3 text-right font-medium w-[5%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {services.map((service) => (
                  <motion.tr 
                    key={service.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <Input 
                          placeholder="Item name"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          className="border-slate-200"
                        />
                        <Input 
                          placeholder="Description (optional)"
                          value={service.description}
                          onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                          className="text-sm text-muted-foreground border-slate-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        placeholder="HSN/SAC Code"
                        value={service.hsnSacCode}
                        onChange={(e) => handleServiceChange(service.id, 'hsnSacCode', e.target.value)}
                        className="border-slate-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        type="number"
                        min="1"
                        step="1"
                        value={service.quantity}
                        onChange={(e) => handleServiceChange(service.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="text-right border-slate-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={service.unitPrice}
                          onChange={(e) => handleServiceChange(service.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="pl-8 text-right border-slate-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-right font-medium">
                        {formatCurrency(service.quantity * service.unitPrice)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeService(service.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={addService} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}