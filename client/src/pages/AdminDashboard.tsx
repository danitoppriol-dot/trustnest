import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Download,
  MessageSquare,
} from "lucide-react";

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: "tenant" | "landlord";
  status: "pending" | "approved" | "rejected";
  documents: {
    id: string;
    type: "id" | "selfie" | "property" | "company";
    status: "pending" | "approved" | "rejected";
    uploadedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
  }[];
  riskFlags: string[];
  submittedAt: string;
  priority: "low" | "medium" | "high";
}

interface AdminStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  averageReviewTime: number;
  flaggedUsers: number;
}

// Mock data
const mockVerifications: VerificationRequest[] = [
  {
    id: "VER001",
    userId: "USR001",
    userName: "Mario Rossi",
    userEmail: "mario.rossi@example.it",
    userType: "tenant",
    status: "pending",
    documents: [
      { id: "DOC001", type: "id", status: "pending", uploadedAt: "2026-02-19T10:30:00Z" },
      { id: "DOC002", type: "selfie", status: "pending", uploadedAt: "2026-02-19T10:31:00Z" },
    ],
    riskFlags: [],
    submittedAt: "2026-02-19T10:30:00Z",
    priority: "medium",
  },
  {
    id: "VER002",
    userId: "USR002",
    userName: "Anna Bianchi",
    userEmail: "anna.bianchi@example.it",
    userType: "landlord",
    status: "pending",
    documents: [
      { id: "DOC003", type: "id", status: "approved", uploadedAt: "2026-02-18T14:00:00Z" },
      { id: "DOC004", type: "property", status: "pending", uploadedAt: "2026-02-18T14:05:00Z" },
      { id: "DOC005", type: "company", status: "pending", uploadedAt: "2026-02-18T14:10:00Z" },
    ],
    riskFlags: ["duplicate_email"],
    submittedAt: "2026-02-18T14:00:00Z",
    priority: "high",
  },
  {
    id: "VER003",
    userId: "USR003",
    userName: "Erik Svensson",
    userEmail: "erik.svensson@example.se",
    userType: "tenant",
    status: "approved",
    documents: [
      { id: "DOC006", type: "id", status: "approved", uploadedAt: "2026-02-17T09:00:00Z" },
      { id: "DOC007", type: "selfie", status: "approved", uploadedAt: "2026-02-17T09:05:00Z" },
    ],
    riskFlags: [],
    submittedAt: "2026-02-17T09:00:00Z",
    priority: "low",
  },
];

const mockStats: AdminStats = {
  totalPending: 12,
  totalApproved: 287,
  totalRejected: 8,
  averageReviewTime: 45,
  flaggedUsers: 3,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
              <p className="text-slate-600 mb-4">You do not have permission to access the admin dashboard.</p>
              <Button variant="outline">Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredVerifications = mockVerifications.filter((v) => {
    const matchesSearch =
      v.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    const matchesPriority = filterPriority === "all" || v.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage verification requests and user trust badges</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{mockStats.totalPending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{mockStats.totalApproved}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{mockStats.totalRejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Avg Review Time</p>
                  <p className="text-3xl font-bold text-blue-600">{mockStats.averageReviewTime}m</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Flagged Users</p>
                  <p className="text-3xl font-bold text-red-600">{mockStats.flaggedUsers}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="queue">Verification Queue</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Verification Queue Tab */}
          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <CardTitle>Verification Requests</CardTitle>
                <CardDescription>Review and approve/reject user verification documents</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={(v: any) => setFilterPriority(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification List */}
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRequest(verification)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{verification.userName}</h3>
                            <Badge variant="outline">{verification.userType}</Badge>
                            <Badge className={getPriorityColor(verification.priority)}>
                              {verification.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{verification.userEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(verification.status)}
                          <span className="text-sm font-medium text-slate-700 capitalize">{verification.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {verification.documents.map((doc) => (
                            <Badge key={doc.id} variant="secondary" className="text-xs">
                              {doc.type}: {doc.status}
                            </Badge>
                          ))}
                        </div>
                        {verification.riskFlags.length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-medium">{verification.riskFlags.length} flags</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detail Panel */}
            {selectedRequest && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedRequest.userName}</CardTitle>
                      <CardDescription>{selectedRequest.userEmail}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">User Type</p>
                      <p className="font-semibold text-slate-900 capitalize">{selectedRequest.userType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedRequest.status)}
                        <span className="font-semibold text-slate-900 capitalize">{selectedRequest.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Priority</p>
                      <Badge className={getPriorityColor(selectedRequest.priority)}>
                        {selectedRequest.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Submitted</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(selectedRequest.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Risk Flags */}
                  {selectedRequest.riskFlags.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">Risk Flags</h4>
                      </div>
                      <ul className="space-y-1">
                        {selectedRequest.riskFlags.map((flag, idx) => (
                          <li key={idx} className="text-sm text-red-800">
                            • {flag.replace(/_/g, " ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Documents</h4>
                    <div className="space-y-3">
                      {selectedRequest.documents.map((doc) => (
                        <div key={doc.id} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900 capitalize">{doc.type}</p>
                              <p className="text-xs text-slate-600">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(doc.status)}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedRequest.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button className="flex-1" variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button className="flex-1" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request Info
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and trust badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">User management interface coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Verification statistics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
