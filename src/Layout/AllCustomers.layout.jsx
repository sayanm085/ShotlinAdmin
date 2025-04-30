import React, { useState, useEffect } from "react";
// Import Shadcn UI components (adjust import paths as needed)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Icons from lucide-react for actions & verified status
import { MoreHorizontal, Check, X } from "lucide-react";

export default function AllCustomers() {
  // State for demo customers data & search term.
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state: current page & page size.
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    // Simulated API call – replacing with demo data for 20 customers.
    const demoData = [
      {
        id: 1,
        name: "Alice Johnson",
        username: "aliceJ",
        email: "alice@service.com",
        country: "United States",
        registeredAt: "2025-03-25",
        avatar: "/avatars/alice.png",
        verified: true,
      },
      {
        id: 2,
        name: "Bob Smith",
        username: "bobS",
        email: "bob@service.com",
        country: "Canada",
        registeredAt: "2025-04-02",
        avatar: "/avatars/bob.png",
        verified: false,
      },
      {
        id: 3,
        name: "Carol Danvers",
        username: "carolD",
        email: "carol@service.com",
        country: "Australia",
        registeredAt: "2025-04-08",
        avatar: "/avatars/carol.png",
        verified: true,
      },
      {
        id: 4,
        name: "David Lee",
        username: "davidL",
        email: "david@service.com",
        country: "United Kingdom",
        registeredAt: "2025-04-10",
        avatar: "/avatars/david.png",
        verified: true,
      },
      {
        id: 5,
        name: "Ella Fitzgerald",
        username: "ellaF",
        email: "ella@service.com",
        country: "France",
        registeredAt: "2025-04-12",
        avatar: "/avatars/ella.png",
        verified: false,
      },
      {
        id: 6,
        name: "Frank Ocean",
        username: "frankO",
        email: "frank@service.com",
        country: "USA",
        registeredAt: "2025-04-14",
        avatar: "/avatars/frank.png",
        verified: true,
      },
      {
        id: 7,
        name: "Grace Hopper",
        username: "graceH",
        email: "grace@service.com",
        country: "United States",
        registeredAt: "2025-04-16",
        avatar: "/avatars/grace.png",
        verified: true,
      },
      {
        id: 8,
        name: "Henry Ford",
        username: "henryF",
        email: "henry@service.com",
        country: "USA",
        registeredAt: "2025-04-18",
        avatar: "/avatars/henry.png",
        verified: false,
      },
      {
        id: 9,
        name: "Isabella Rossellini",
        username: "bellaR",
        email: "bella@service.com",
        country: "Italy",
        registeredAt: "2025-04-20",
        avatar: "/avatars/isabella.png",
        verified: true,
      },
      {
        id: 10,
        name: "Jackie Chan",
        username: "jackieC",
        email: "jackie@service.com",
        country: "China",
        registeredAt: "2025-04-22",
        avatar: "/avatars/jackie.png",
        verified: true,
      },
      {
        id: 11,
        name: "Katherine Johnson",
        username: "katherineJ",
        email: "katherine@service.com",
        country: "United States",
        registeredAt: "2025-04-24",
        avatar: "/avatars/katherine.png",
        verified: true,
      },
      {
        id: 12,
        name: "Leonardo DiCaprio",
        username: "leoD",
        email: "leo@service.com",
        country: "USA",
        registeredAt: "2025-04-26",
        avatar: "/avatars/leo.png",
        verified: false,
      },
      {
        id: 13,
        name: "Maria Sharapova",
        username: "mariaS",
        email: "maria@service.com",
        country: "Russia",
        registeredAt: "2025-04-28",
        avatar: "/avatars/maria.png",
        verified: true,
      },
      {
        id: 14,
        name: "Natalie Portman",
        username: "natalieP",
        email: "natalie@service.com",
        country: "Israel",
        registeredAt: "2025-04-30",
        avatar: "/avatars/natalie.png",
        verified: true,
      },
      {
        id: 15,
        name: "Oliver Stone",
        username: "oliverS",
        email: "oliver@service.com",
        country: "USA",
        registeredAt: "2025-05-02",
        avatar: "/avatars/oliver.png",
        verified: false,
      },
      {
        id: 16,
        name: "Patricia Clarkson",
        username: "patriciaC",
        email: "patricia@service.com",
        country: "United Kingdom",
        registeredAt: "2025-05-04",
        avatar: "/avatars/patricia.png",
        verified: true,
      },
      {
        id: 17,
        name: "Quentin Tarantino",
        username: "quentinT",
        email: "quentin@service.com",
        country: "USA",
        registeredAt: "2025-05-06",
        avatar: "/avatars/quentin.png",
        verified: true,
      },
      {
        id: 18,
        name: "Rachel McAdams",
        username: "rachelM",
        email: "rachel@service.com",
        country: "Canada",
        registeredAt: "2025-05-08",
        avatar: "/avatars/rachel.png",
        verified: false,
      },
      {
        id: 19,
        name: "Samuel L. Jackson",
        username: "samuelJ",
        email: "samuel@service.com",
        country: "USA",
        registeredAt: "2025-05-10",
        avatar: "/avatars/samuel.png",
        verified: true,
      },
      {
        id: 20,
        name: "Tina Fey",
        username: "tinaF",
        email: "tina@service.com",
        country: "USA",
        registeredAt: "2025-05-12",
        avatar: "/avatars/tina.png",
        verified: true,
      },
    ];

    setCustomers(demoData);
  }, []);

  // Filter customers by name, username, or email.
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const indexOfLastCustomer = currentPage * pageSize;
  const indexOfFirstCustomer = indexOfLastCustomer - pageSize;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card className="shadow-sm bg-white">
      {/* Simplified all-white header */}
      <CardHeader className="bg-white border-b p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-t-md">
        <CardTitle className="text-2xl font-bold text-gray-900">All Customers</CardTitle>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search by name, username, or email..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search.
            }}
          />
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Filter
          </Button>
        </div>
      </CardHeader>

      {/* Table Container */}
      <CardContent className="p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="border-b border-gray-200 bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                {/* Customer Info */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                </td>
                {/* Username */}
                <td className="px-6 py-4 text-sm text-gray-600">{customer.username}</td>
                {/* Email */}
                <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                {/* Country */}
                <td className="px-6 py-4 text-sm text-gray-500">{customer.country}</td>
                {/* Registered */}
                <td className="px-6 py-4 text-sm text-gray-500">{customer.registeredAt}</td>
                {/* Verified */}
                <td className="px-6 py-4">
                  {customer.verified ? (
                    <Check className="h-5 w-5 text-green-500" aria-label="Verified" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" aria-label="Not verified" />
                  )}
                </td>
                {/* Actions */}
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {currentCustomers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
            {/* Generate Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
