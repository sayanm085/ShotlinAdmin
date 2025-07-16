import React, { useState } from 'react';
import { User, Plus, Search } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ClientForm({ client, setClient }) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    gstNumber: ''
  });

  // For demo purposes, we'll just use a dummy client object
  const dummyClient = {
    _id: '687558b349667acf1ca0e510',
    name: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    phone: '+91 9876543210',
    address: {
      street: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    gstNumber: '27AABCU9603R1ZX'
  };

  const handleAddClient = () => {
    // In a real app, we would save the client to the database
    // For demo purposes, we'll just set a fake ID and use the client
    const clientWithId = {
      ...newClient,
      _id: `client_${Date.now()}`
    };
    setClient(clientWithId);
    setIsAdding(false);
  };

  const handleQuickSelect = () => {
    // In a real app, this would be replaced with actual client data
    setClient(dummyClient);
  };

  if (client) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Client</Label>
          <Button variant="ghost" size="sm" onClick={() => setClient(null)}>
            Change
          </Button>
        </div>
        
        <div className="p-4 border border-slate-200 rounded-md bg-slate-50/50">
          <h3 className="font-medium text-base">{client.name}</h3>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>{client.email}</p>
            <p>{client.phone}</p>
            <p>{[client.address?.street, client.address?.city, client.address?.state].filter(Boolean).join(', ')}</p>
            {client.gstNumber && <p>GST: {client.gstNumber}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (isAdding) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Add New Client</Label>
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input 
              id="clientName" 
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Client name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input 
                id="clientEmail" 
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
            </div>
            
            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input 
                id="clientPhone"
                value={newClient.phone}
                onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="clientAddress">Address</Label>
            <Input 
              id="clientAddress"
              value={newClient.address.street}
              onChange={(e) => setNewClient(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value } 
              }))}
              placeholder="Street address"
              className="mb-2"
            />
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input 
                placeholder="City"
                value={newClient.address.city}
                onChange={(e) => setNewClient(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value } 
                }))}
              />
              <Input 
                placeholder="State/Province"
                value={newClient.address.state}
                onChange={(e) => setNewClient(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value } 
                }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="ZIP/Postal Code"
                value={newClient.address.zipCode}
                onChange={(e) => setNewClient(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, zipCode: e.target.value } 
                }))}
              />
              <Input 
                placeholder="Country"
                value={newClient.address.country}
                onChange={(e) => setNewClient(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, country: e.target.value } 
                }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input 
              id="gstNumber"
              value={newClient.gstNumber}
              onChange={(e) => setNewClient(prev => ({ ...prev, gstNumber: e.target.value }))}
              placeholder="GST Number (if applicable)"
            />
          </div>
          
          <Button 
            className="w-full mt-2" 
            onClick={handleAddClient}
            disabled={!newClient.name}
          >
            Add Client
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="client" className="text-base font-medium">Client <span className="text-red-500">*</span></Label>
      
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="w-full" onClick={handleQuickSelect}>
          <User className="mr-2 h-4 w-4" />
          Quick Select Demo Client
        </Button>
        
        <Button variant="secondary" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
    </div>
  );
}