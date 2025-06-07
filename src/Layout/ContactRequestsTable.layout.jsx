import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, Mail, Calendar, MessageSquare, Star, CheckCircle, X, Phone, Hash } from "lucide-react";

const Contacts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const contacts = [
    {
      id: 1,
      uniqueCode: "CU001",
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      mobile: "+1 (555) 123-4567",
      subject: "Partnership Inquiry",
      message: "Hi, I'm interested in exploring a potential partnership opportunity with your company. Could we schedule a call to discuss this further?",
      date: "2024-05-30",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      uniqueCode: "CU002",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@email.com",
      mobile: "+1 (555) 987-6543",
      subject: "Product Demo Request",
      message: "I would like to request a demo of your product for our team. We are evaluating solutions for our upcoming project.",
      date: "2024-05-29",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 3,
      uniqueCode: "CU003",
      name: "James Wilson",
      email: "james.wilson@email.com",
      mobile: "+1 (555) 456-7890",
      subject: "Technical Support",
      message: "I'm experiencing issues with the login functionality. The system keeps giving me an error message when I try to access my account.",
      date: "2024-05-28",
      status: "resolved",
      priority: "high"
    },
    {
      id: 4,
      uniqueCode: "CU004",
      name: "Sophie Chen",
      email: "sophie.chen@email.com",
      mobile: "+1 (555) 234-5678",
      subject: "Feature Request",
      message: "Would it be possible to add a dark mode option to the application? Many users in our organization would find this feature very helpful.",
      date: "2024-05-27",
      status: "pending",
      priority: "low"
    },
    {
      id: 5,
      uniqueCode: "CU005",
      name: "Robert Davis",
      email: "robert.davis@email.com",
      mobile: "+1 (555) 345-6789",
      subject: "Billing Question",
      message: "I have a question about my recent invoice. There seems to be a discrepancy in the charges. Could someone please review this?",
      date: "2024-05-26",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 6,
      uniqueCode: "CU006",
      name: "Emily Johnson",
      email: "emily.johnson@email.com",
      mobile: "+1 (555) 567-8901",
      subject: "Feedback on Service",
      message: "I wanted to share some positive feedback about your customer service team. They were incredibly helpful in resolving my recent issue.",
      date: "2024-05-25",
      status: "closed",
      priority: "low"
    },
    {
      id: 7,
      uniqueCode: "CU007",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      mobile: "+1 (555) 678-9012",
      subject: "Integration Support",
      message: "We need assistance with integrating your API into our existing system. Could we schedule a technical consultation?",
      date: "2024-05-24",
      status: "pending",
      priority: "high"
    },
    {
      id: 8,
      uniqueCode: "CU008",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      mobile: "+1 (555) 789-0123",
      subject: "Account Setup",
      message: "I'm having trouble setting up my new account. The verification email hasn't arrived and I can't complete the registration process.",
      date: "2024-05-23",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 9,
      uniqueCode: "CU009",
      name: "David Martinez",
      email: "david.martinez@email.com",
      mobile: "+1 (555) 890-1234",
      subject: "Training Request",
      message: "Our team would like to request training sessions for your platform. What options do you have available for enterprise customers?",
      date: "2024-05-22",
      status: "resolved",
      priority: "low"
    },
    {
      id: 10,
      uniqueCode: "CU010",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      mobile: "+1 (555) 901-2345",
      subject: "Security Inquiry",
      message: "I have questions about your data security measures and compliance certifications. Could you provide more detailed information?",
      date: "2024-05-21",
      status: "pending",
      priority: "high"
    },
    {
      id: 11,
      uniqueCode: "CU011",
      name: "Christopher Lee",
      email: "christopher.lee@email.com",
      mobile: "+1 (555) 012-3456",
      subject: "Customization Request",
      message: "We're interested in customizing the dashboard to better fit our company's branding. What customization options are available?",
      date: "2024-05-20",
      status: "closed",
      priority: "medium"
    },
    {
      id: 12,
      uniqueCode: "CU012",
      name: "Amanda Taylor",
      email: "amanda.taylor@email.com",
      mobile: "+1 (555) 123-4567",
      subject: "Performance Issues",
      message: "We've noticed some performance issues during peak hours. The system seems to slow down significantly. Can this be addressed?",
      date: "2024-05-19",
      status: "in-progress",
      priority: "high"
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Star className="h-4 w-4 text-red-500 fill-red-500" />;
      case "medium":
        return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
      case "low":
        return <Star className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = (contactId, newStatus) => {
    console.log(`Updating contact ${contactId} status to ${newStatus}`);
    // Here you would update the status in your state management or API
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Manage all customer inquiries and feedback</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search contacts, emails, subjects, or codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap w-full lg:w-auto">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
                className="flex-1 lg:flex-none"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
                className="flex-1 lg:flex-none"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "in-progress" ? "default" : "outline"}
                onClick={() => setFilterStatus("in-progress")}
                size="sm"
                className="flex-1 lg:flex-none"
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === "resolved" ? "default" : "outline"}
                onClick={() => setFilterStatus("resolved")}
                size="sm"
                className="flex-1 lg:flex-none"
              >
                Resolved
              </Button>
              <Button
                variant={filterStatus === "closed" ? "default" : "outline"}
                onClick={() => setFilterStatus("closed")}
                size="sm"
                className="flex-1 lg:flex-none"
              >
                Closed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {currentContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
                  <div className="flex items-start space-x-3 flex-1">
                    {getPriorityIcon(contact.priority)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.subject}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {contact.uniqueCode}
                          </Badge>
                          {getStatusBadge(contact.status)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium">{contact.name}</p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.mobile}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{contact.date}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 my-4">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{contact.message}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 sm:flex-none"
                    onClick={() => navigate(`/dashboard/contactreply/${contact.id}`)}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1 sm:flex-none"
                    onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    onClick={() => handleStatusUpdate(contact.id, 'closed')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close Query
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-4 py-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
