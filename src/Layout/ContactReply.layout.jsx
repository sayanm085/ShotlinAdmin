import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Send, 
  Save,
  Eye,
  Mail,
  Phone,
  Calendar,
  Hash
} from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ContactReply = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Mock contact data - in real app this would come from API
  const contact = {
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
  };

  // Quill modules configuration for toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Quill formats
  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'color', 'background',
    'link', 'image'
  ];

  const handleSendMessage = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    console.log("Message sent:", { subject, message, contactId: id });
    navigate("/contacts");
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", { subject, message, contactId: id });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/contacts")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Contacts</span>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reply to Contact</h1>
              <p className="text-gray-600 mt-1">Compose your professional response</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Message Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Original Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {contact.uniqueCode}
                    </Badge>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.mobile}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {contact.date}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{contact.subject}</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{contact.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reply Composer */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    Compose Reply
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{isPreview ? "Edit" : "Preview"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveDraft}
                      className="flex items-center space-x-1"
                    >
                      <Save className="h-4 w-4" />
                      <span>Draft</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input
                    placeholder={`Re: ${contact.subject}`}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="text-sm"
                    disabled={isPreview}
                  />
                </div>

                {/* Message Content with React Quill */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  {isPreview ? (
                    <div 
                      className="min-h-[300px] p-4 border rounded-lg bg-white prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: message || "Your message preview will appear here..." }}
                    />
                  ) : (
                    <div className="border rounded-lg bg-white">
                      <ReactQuill
                        theme="snow"
                        value={message}
                        onChange={setMessage}
                        modules={modules}
                        formats={formats}
                        placeholder="Type your professional response here..."
                        style={{ 
                          minHeight: '300px',
                        }}
                        className="quill-editor"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!subject.trim() || !message.trim() || isSending}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 flex-1 md:flex-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? "Sending..." : "Send Reply"}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex items-center space-x-2 flex-1 md:flex-none"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save as Draft</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate("/contacts")}
                    className="flex-1 md:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .quill-editor .ql-editor {
          min-height: 300px;
          font-size: 14px;
          line-height: 1.6;
        }
        .quill-editor .ql-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-bottom: 1px solid #e5e7eb;
        }
        .quill-editor .ql-container {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default ContactReply;