import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Eye, Check, X, Trash2, Calendar, MapPin, Tag, Edit, AlertTriangle, LogOut } from 'lucide-react';
import { getStoredReports, updateReportStatus, deleteReport, updateReport, SelfReportSubmission } from '@/services/adminService';
import { EditReportForm } from '@/components/forms/EditReportForm';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<SelfReportSubmission[]>([]);
    const [selectedReport, setSelectedReport] = useState<SelfReportSubmission | null>(null);
    const [editingReport, setEditingReport] = useState<SelfReportSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const user = authService.getUser();

    const handleLogout = () => {
        authService.clearUser();
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
        navigate('/');
    };

    // Load reports on component mount
    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setIsLoading(true);
        try {
            const allReports = await getStoredReports();
            setReports(allReports);
        } catch (error) {
            toast({
                title: "Error Loading Reports",
                description: "Failed to load submitted reports.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (reportId: string) => {
        try {
            await updateReportStatus(reportId, 'approved');
            await loadReports();
            toast({
                title: "Report Approved",
                description: "The report has been approved and published.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve the report.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (reportId: string) => {
        try {
            await updateReportStatus(reportId, 'rejected');
            await loadReports();
            toast({
                title: "Report Rejected",
                description: "The report has been rejected.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject the report.",
                variant: "destructive",
            });
        }
    };

    const handleMarkAsJunk = async (reportId: string) => {
        try {
            await updateReportStatus(reportId, 'junk');
            await loadReports();
            toast({
                title: "Report Marked as Junk",
                description: "The report has been marked as spam/junk.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark the report as junk.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (reportId: string) => {
        try {
            await deleteReport(reportId);
            await loadReports();
            toast({
                title: "Report Deleted",
                description: "The report has been permanently deleted.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete the report.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = async (reportData: any) => {
        if (!editingReport) return;

        setIsSubmitting(true);
        try {
            await updateReport(editingReport.id, reportData);
            await loadReports();
            setEditingReport(null);
            toast({
                title: "Report Updated",
                description: "The report has been successfully updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update the report.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
            case 'junk':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Junk</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pendingReports = reports.filter(r => r.status === 'pending');
    const approvedReports = reports.filter(r => r.status === 'approved');
    const rejectedReports = reports.filter(r => r.status === 'rejected');
    const junkReports = reports.filter(r => r.status === 'junk');

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                            <Link to="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        {user && (
                            <div className="flex items-center gap-3">
                                {user.picture && (
                                    <img 
                                        src={user.picture} 
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border border-border"
                                    />
                                )}
                                <div className="text-sm font-medium">
                                    {user.name}
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold">Admin Panel</h1>
                            <p className="text-muted-foreground mt-1">
                                Review and manage submitted AI incident reports
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reports.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{pendingReports.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{approvedReports.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{rejectedReports.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Junk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{junkReports.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reports Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submitted Reports</CardTitle>
                        <CardDescription>
                            Review and manage AI incident reports submitted by users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">Loading reports...</div>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No reports submitted yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium max-w-xs">
                                                <div className="truncate" title={report.title}>
                                                    {report.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {Array.isArray(report.country) ? report.country.join(', ') : report.country}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Tag className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{report.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(report.date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(report.submittedAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {/* View Details */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedReport(report)}
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Report Details</DialogTitle>
                                                                <DialogDescription>
                                                                    Review the full details of this incident report
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            {selectedReport && (
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-2">Title</h4>
                                                                        <p className="text-sm">{selectedReport.title}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-2">Description</h4>
                                                                        <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Country</h4>
                                                                            <p className="text-sm">{Array.isArray(selectedReport.country) ? selectedReport.country.join(', ') : selectedReport.country}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Category</h4>
                                                                            <p className="text-sm">{selectedReport.category}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Incident Date</h4>
                                                                            <p className="text-sm">{new Date(selectedReport.date).toLocaleDateString()}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Submitted</h4>
                                                                            <p className="text-sm">{formatDate(selectedReport.submittedAt)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-2">Status</h4>
                                                                        {getStatusBadge(selectedReport.status)}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>

                                                    {/* Edit Report */}
                                                    <Dialog open={editingReport?.id === report.id} onOpenChange={(open) => {
                                                        if (!open) setEditingReport(null);
                                                    }}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingReport(report)}
                                                                title="Edit Report"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Report</DialogTitle>
                                                                <DialogDescription>
                                                                    Make changes to the incident report details
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            {editingReport && (
                                                                <EditReportForm
                                                                    report={editingReport}
                                                                    onSubmit={handleEdit}
                                                                    onCancel={() => setEditingReport(null)}
                                                                    isSubmitting={isSubmitting}
                                                                />
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>

                                                    {/* Approve */}
                                                    {report.status === 'pending' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleApprove(report.id)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            title="Approve Report"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    {/* Reject */}
                                                    {report.status === 'pending' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject(report.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            title="Reject Report"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    {/* Mark as Junk */}
                                                    {(report.status === 'pending' || report.status === 'approved') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsJunk(report.id)}
                                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                            title="Mark as Junk/Spam"
                                                        >
                                                            <AlertTriangle className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    {/* Delete */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(report.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
