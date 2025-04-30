import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

/**
 * ContactRequestsTable
 * Displays mock "Contact Us" submissions in a responsive admin dashboard.
 * Provides a search bar to filter by Unique ID, pagination, and a modal to view details.
 */
export default function ContactRequestsTable() {
  const mockRequests = [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-0100', message: 'I need help with my order.', status: 'Open', contactUniqueNumber: 'CR-1001' },
    { name: 'Bob Smith', email: 'bob.smith@example.com', phone: '555-0101', message: 'Can you update my payment method?', status: 'In Progress', contactUniqueNumber: 'CR-1002' },
    { name: 'Catherine Lee', email: 'catherine.lee@example.com', phone: '555-0102', message: 'Where can I find your pricing?', status: 'Closed', contactUniqueNumber: 'CR-1003' },
    { name: 'David Kim', email: 'david.kim@example.com', phone: '555-0103', message: 'I want to cancel my subscription.', status: 'Open', contactUniqueNumber: 'CR-1004' },
    { name: 'Eva Green', email: 'eva.green@example.com', phone: '555-0104', message: 'How do I change my account email?', status: 'In Progress', contactUniqueNumber: 'CR-1005' },
    { name: 'Frank Wright', email: 'frank.wright@example.com', phone: '555-0105', message: 'My coupon code is not working.', status: 'Open', contactUniqueNumber: 'CR-1006' },
    { name: 'Grace Liu', email: 'grace.liu@example.com', phone: '555-0106', message: 'I experienced an error on checkout.', status: 'Closed', contactUniqueNumber: 'CR-1007' },
    { name: 'Hector Martinez', email: 'hector.martinez@example.com', phone: '555-0107', message: 'Can I get an invoice?', status: 'In Progress', contactUniqueNumber: 'CR-1008' },
    { name: 'Isabella Fernandez', email: 'isabella.fernandez@example.com', phone: '555-0108', message: 'How to track my shipment?', status: 'Open', contactUniqueNumber: 'CR-1009' },
    { name: 'Jack Wilson', email: 'jack.wilson@example.com', phone: '555-0109', message: 'Need help resetting password.', status: 'Closed', contactUniqueNumber: 'CR-1010' },
    { name: 'Karen Davis', email: 'karen.davis@example.com', phone: '555-0110', message: 'Issue with mobile app login.', status: 'Open', contactUniqueNumber: 'CR-1011' },
    { name: 'Liam Brown', email: 'liam.brown@example.com', phone: '555-0111', message: 'Requesting account deletion.', status: 'In Progress', contactUniqueNumber: 'CR-1012' },
    { name: 'Mia Wilson', email: 'mia.wilson@example.com', phone: '555-0112', message: 'Are there any discounts available?', status: 'Closed', contactUniqueNumber: 'CR-1013' },
    { name: 'Noah Moore', email: 'noah.moore@example.com', phone: '555-0113', message: 'Website is loading slowly.', status: 'Open', contactUniqueNumber: 'CR-1014' },
    { name: 'Olivia Taylor', email: 'olivia.taylor@example.com', phone: '555-0114', message: 'Subscription upgrade question.', status: 'In Progress', contactUniqueNumber: 'CR-1015' },
    { name: 'Paul Anderson', email: 'paul.anderson@example.com', phone: '555-0115', message: 'Received a damaged product.', status: 'Closed', contactUniqueNumber: 'CR-1016' },
    { name: 'Quinn Thomas', email: 'quinn.thomas@example.com', phone: '555-0116', message: 'How to apply referral code?', status: 'Open', contactUniqueNumber: 'CR-1017' },
    { name: 'Rachel Scott', email: 'rachel.scott@example.com', phone: '555-0117', message: 'Feedback on your new feature.', status: 'Closed', contactUniqueNumber: 'CR-1018' },
    { name: 'Sam Peterson', email: 'sam.peterson@example.com', phone: '555-0118', message: 'Need assistance with API integration.', status: 'In Progress', contactUniqueNumber: 'CR-1019' },
    { name: 'Tina Black', email: 'tina.black@example.com', phone: '555-0119', message: 'Question about data privacy.', status: 'Open', contactUniqueNumber: 'CR-1020' },
  ];

  const [searchId, setSearchId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests = useMemo(
    () => mockRequests.filter(req =>
      req.contactUniqueNumber.toLowerCase().includes(searchId.toLowerCase())
    ),
    [searchId]
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDialogOpenChange = (open) => {
    if (!open) setSelectedRequest(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-full">
      <h2 className="text-2xl font-semibold mb-4">Contact Us Requests</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <Input
          placeholder="Search by Unique ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="max-w-xs mb-2 sm:mb-0"
        />
        <p className="text-sm text-gray-500">
          Showing {filteredRequests.length} of {mockRequests.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Unique ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequests.map((req) => (
              <TableRow key={req.contactUniqueNumber} className="hover:bg-gray-50">
                <TableCell>{req.name}</TableCell>
                <TableCell>{req.email}</TableCell>
                <TableCell>{req.phone}</TableCell>
                <TableCell className="max-w-xs truncate" title={req.message}>
                  {req.message}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === 'Open'
                        ? 'outline'
                        : req.status === 'In Progress'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>{req.contactUniqueNumber}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog
                    open={
                      !!selectedRequest && selectedRequest.contactUniqueNumber === req.contactUniqueNumber
                    }
                    onOpenChange={handleDialogOpenChange}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact Request Details</DialogTitle>
                        <DialogDescription>
                          Detailed information for {selectedRequest?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 mt-4">
                        <p><strong>Name:</strong> {selectedRequest?.name}</p>
                        <p><strong>Email:</strong> {selectedRequest?.email}</p>
                        <p><strong>Phone:</strong> {selectedRequest?.phone}</p>
                        <p><strong>Message:</strong> {selectedRequest?.message}</p>
                        <p><strong>Status:</strong> {selectedRequest?.status}</p>
                        <p><strong>Unique ID:</strong> {selectedRequest?.contactUniqueNumber}</p>
                      </div>
                      <DialogFooter>
                        <DialogClose>Close</DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="secondary">
                    Close
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant="outline"
              className={page === currentPage ? 'bg-black text-white' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
