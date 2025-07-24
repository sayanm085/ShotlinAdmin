import React, { useState, useEffect, useRef } from 'react';
import { User, Plus, Search, Loader2, X, Check, Building, UserCircle, AtSign, Phone, Clock } from 'lucide-react';
import axiosInstance from '@/lib/axios';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { toast } from 'react-hot-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ClientForm({ client, setClient }) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  
  // Current timestamp and user info - updated with the latest values
  const currentDateTime = "2025-07-16 10:53:22";
  const currentUser = "sayanm085";
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    },
    gstin: '',
    panNumber: '',
    clientType: 'company',
    contactPersons: [
      {
        name: '',
        position: '',
        email: '',
        phone: '',
        isPrimary: true
      }
    ],
    paymentTerms: 30
  });

  // Function to fetch initial client data or search results
  const fetchClientData = async (term = '') => {
    setIsSearching(true);
    
    try {
      // Use the same endpoint for both initial data and search
      const response = await axiosInstance.get(`/api/v1/users/clients-suggestions${term ? `?search=${encodeURIComponent(term)}` : ''}`);
      console.log("Client data response:", response.data);
      
      if (response.data && response.data.data && response.data.data.clients) {
        setSuggestions(response.data.data.clients);
        setInitialDataLoaded(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to fetch clients");
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Fetch default data when dropdown opens
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    
    // If opening the dropdown and we haven't loaded data yet
    if (newOpen) {
      // Always fetch fresh client data when opening the dropdown
      fetchClientData(searchTerm.length >= 2 ? searchTerm : '');
    }
  };
  
  // Debounced search - Fixed to handle short search terms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (open) {
      // Always search when dropdown is open, using empty string for default data
      searchTimeoutRef.current = setTimeout(() => {
        fetchClientData(searchTerm.length >= 2 ? searchTerm : '');
      }, 300);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, open]);

  const handleAddClient = async () => {
    // Basic validation
    if (!newClient.name) {
      toast.error("Client name is required");
      return;
    }
    
    if (!newClient.email) {
      toast.error("Email is required");
      return;
    }
    
    // Format contact person if name is not provided
    const formattedClient = {
      ...newClient,
      contactPersons: newClient.contactPersons.filter(contact => contact.name)
    };

    // If no contact persons are provided but we have client name/email, create a primary contact
    if (formattedClient.contactPersons.length === 0) {
      formattedClient.contactPersons = [
        {
          name: formattedClient.name,
          email: formattedClient.email,
          phone: formattedClient.phone,
          isPrimary: true
        }
      ];
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post('/api/v1/users/clients', formattedClient);
      console.log("Client creation response:", response);
      
      // Check if we have valid data in the response
      if (response.data && response.data.data) {
        // Get the newly created client from the response
        const createdClient = response.data.data;
        
        // Make sure the client data has the expected format and properties
        // Adding primaryContact if it doesn't exist
        if (!createdClient.primaryContact && createdClient.contactPersons?.length > 0) {
          const primaryContact = createdClient.contactPersons.find(c => c.isPrimary) || createdClient.contactPersons[0];
          createdClient.primaryContact = primaryContact;
        }

        // Ensure fullAddress exists
        if (!createdClient.fullAddress && createdClient.address) {
          createdClient.fullAddress = [
            createdClient.address.street, 
            createdClient.address.city, 
            createdClient.address.state,
            createdClient.address.postalCode,
            createdClient.address.country !== 'India' ? createdClient.address.country : null
          ].filter(Boolean).join(', ');
        }

        // Log the client before setting it
        console.log("Client to be set:", createdClient);

        // Set the client in the parent component with a slight delay to ensure state updates properly
        setTimeout(() => {
          setClient(createdClient);
          setIsAdding(false);
        }, 0);
        
        toast.success("Client added successfully");
        
        // Reset initial data loaded flag to fetch fresh data next time
        setInitialDataLoaded(false);
        
        // Reset the new client form
        setNewClient({
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India'
          },
          gstin: '',
          panNumber: '',
          clientType: 'company',
          contactPersons: [
            {
              name: '',
              position: '',
              email: '',
              phone: '',
              isPrimary: true
            }
          ],
          paymentTerms: 30
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error(error.response?.data?.message || "Failed to add client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectClient = (selectedClient) => {
    console.log("Selected client:", selectedClient);
    setClient(selectedClient);
    setOpen(false);
    setSearchTerm('');
  };

  // Debug useEffect to monitor client state changes
  useEffect(() => {
    console.log("Current client state:", client);
  }, [client]);

  // Handle input click separately to prevent event bubbling issues
  const handleInputClick = (e) => {
    e.stopPropagation();
    setOpen(true);
    
    // If we haven't loaded data yet, do it now
    if (!initialDataLoaded) {
      fetchClientData();
    }
  };

  const getClientTypeLabel = (type) => {
    switch (type) {
      case 'company': return 'Business';
      case 'individual': return 'Individual';
      case 'non-profit': return 'Non-Profit';
      case 'government': return 'Government';
      default: return type;
    }
  };

  const getClientTypeBadgeColor = (type) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'individual': return 'bg-green-100 text-green-800 border-green-200';
      case 'non-profit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'government': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Check if client exists and has necessary data
  if (client && client.name) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Client</Label>
          <Button variant="ghost" size="sm" onClick={() => setClient(null)}>
            Change
          </Button>
        </div>
        
        <div className="p-4 border border-slate-200 rounded-md bg-slate-50/50">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base">{client.name}</h3>
            {client.clientType && (
              <Badge variant="outline" className={getClientTypeBadgeColor(client.clientType)}>
                {getClientTypeLabel(client.clientType)}
              </Badge>
            )}
          </div>
          
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <AtSign className="h-3.5 w-3.5 text-slate-400" />
              <span>{client.email}</span>
            </div>
            
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{client.phone}</span>
              </div>
            )}
            
            {(client.fullAddress || client.address) && (
              <div className="flex items-start gap-2">
                <Building className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                <span>{client.fullAddress || 
                  [
                    client.address?.street,
                    client.address?.city,
                    client.address?.state,
                    client.address?.postalCode,
                    client.address?.country !== 'India' ? client.address?.country : null
                  ].filter(Boolean).join(', ')
                }</span>
              </div>
            )}
            
            {client.gstin && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">GST: </span>
                <span className="font-medium">{client.gstin}</span>
              </div>
            )}
            
            {client.primaryContact && client.primaryContact.name !== client.name && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Primary Contact:</div>
                <div className="flex items-center gap-2">
                  <UserCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium">{client.primaryContact.name}</span>
                </div>
                {client.primaryContact.position && (
                  <div className="text-xs text-slate-500 ml-5.5">
                    {client.primaryContact.position}
                  </div>
                )}
              </div>
            )}
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
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
            <Input 
              id="clientName" 
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Client name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clientEmail">Email <span className="text-red-500">*</span></Label>
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
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clientType">Client Type</Label>
              <Select
                value={newClient.clientType}
                onValueChange={value => setNewClient(prev => ({ ...prev, clientType: value }))}
              >
                <SelectTrigger id="clientType">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Business</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="non-profit">Non-Profit</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
              <Select
                value={String(newClient.paymentTerms)}
                onValueChange={value => setNewClient(prev => ({ ...prev, paymentTerms: parseInt(value) }))}
              >
                <SelectTrigger id="paymentTerms">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="45">45 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
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
                value={newClient.address.postalCode}
                onChange={(e) => setNewClient(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, postalCode: e.target.value } 
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
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="gstin">GST Number</Label>
              <Input 
                id="gstin"
                value={newClient.gstin}
                onChange={(e) => setNewClient(prev => ({ ...prev, gstin: e.target.value }))}
                placeholder="GST Number"
              />
            </div>
            
            <div>
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input 
                id="panNumber"
                value={newClient.panNumber}
                onChange={(e) => setNewClient(prev => ({ ...prev, panNumber: e.target.value }))}
                placeholder="PAN Number"
              />
            </div>
          </div>
          
          <div className="border border-slate-200 rounded-md p-3">
            <Label className="text-sm font-medium mb-2 block">Primary Contact Person (Optional)</Label>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input 
                placeholder="Contact Name"
                value={newClient.contactPersons[0].name}
                onChange={(e) => setNewClient(prev => {
                  const updatedContacts = [...prev.contactPersons];
                  updatedContacts[0] = { ...updatedContacts[0], name: e.target.value };
                  return { ...prev, contactPersons: updatedContacts };
                })}
              />
              <Input 
                placeholder="Position/Title"
                value={newClient.contactPersons[0].position}
                onChange={(e) => setNewClient(prev => {
                  const updatedContacts = [...prev.contactPersons];
                  updatedContacts[0] = { ...updatedContacts[0], position: e.target.value };
                  return { ...prev, contactPersons: updatedContacts };
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="Contact Email"
                value={newClient.contactPersons[0].email}
                onChange={(e) => setNewClient(prev => {
                  const updatedContacts = [...prev.contactPersons];
                  updatedContacts[0] = { ...updatedContacts[0], email: e.target.value };
                  return { ...prev, contactPersons: updatedContacts };
                })}
              />
              <Input 
                placeholder="Contact Phone"
                value={newClient.contactPersons[0].phone}
                onChange={(e) => setNewClient(prev => {
                  const updatedContacts = [...prev.contactPersons];
                  updatedContacts[0] = { ...updatedContacts[0], phone: e.target.value };
                  return { ...prev, contactPersons: updatedContacts };
                })}
              />
            </div>
            
            <p className="text-xs text-slate-500 mt-2">
              Leave blank to use client name and email as primary contact.
            </p>
          </div>
          
          <Button 
            className="w-full mt-2" 
            onClick={handleAddClient}
            disabled={isSubmitting || !newClient.name || !newClient.email}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Client...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Add Client
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="client" className="text-base font-medium">Client <span className="text-red-500">*</span></Label>
      
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                ref={inputRef}
                placeholder="Search clients by name, email, phone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Always keep dropdown open when typing
                  if (!open) {
                    setOpen(true);
                  }
                }}
                onClick={handleInputClick}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the popover again
                    setSearchTerm('');
                    
                    // Fetch default data when clearing search
                    fetchClientData();
                    
                    // Keep the dropdown open
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 0);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
            <Command>
              <CommandList className="max-h-[300px] overflow-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <CommandEmpty>
                      {searchTerm.length >= 2 ? 
                        "No clients found. Try different keywords or add a new client." : 
                        "No clients available. Add your first client to get started."}
                    </CommandEmpty>
                    {suggestions.length > 0 && (
                      <CommandGroup heading={searchTerm.length >= 2 ? 
                        `Search Results (${suggestions.length})` : 
                        `All Clients (${suggestions.length})`}>
                        {suggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion._id}
                            onSelect={() => handleSelectClient(suggestion)}
                            className="flex flex-col items-start py-2"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="font-medium">{suggestion.name}</div>
                              {suggestion.clientType && (
                                <Badge variant="outline" className={`${getClientTypeBadgeColor(suggestion.clientType)} text-xs py-0`}>
                                  {getClientTypeLabel(suggestion.clientType)}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-xs text-slate-500 mt-0.5">{suggestion.email}</div>
                            
                            {suggestion.phone && (
                              <div className="text-xs text-slate-500">{suggestion.phone}</div>
                            )}
                            
                            {suggestion.address?.city && (
                              <div className="text-xs text-slate-400 mt-0.5">
                                {suggestion.address.city}{suggestion.address.state ? `, ${suggestion.address.state}` : ''}
                              </div>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Button variant="secondary" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
      
      <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 mt-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          <span>Last updated: {currentDateTime}</span>
        </div>
        <div className="flex items-center text-muted-foreground mt-1">
          <User className="mr-1.5 h-3.5 w-3.5" />
          <span>User: {currentUser}</span>
        </div>
      </div>
    </div>
  );
}