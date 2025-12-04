import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import kasaLogo from '@/assets/kasa-logo.jpg';
import { toast } from 'sonner';
import { LogOut, Search, RefreshCcw, CheckCircle, XCircle, Clock, AlertTriangle, CreditCard, Building, Users, FileText } from 'lucide-react';

type ApplicationStatus = 'pending_payment' | 'paid' | 'approved' | 'rejected' | 'expired';

interface Application {
  id: string;
  application_id: string;
  business_name: string;
  email: string;
  phone: string | null;
  signage_type: string;
  location: string | null;
  status: ApplicationStatus;
  amount_due: number;
  amount_paid: number;
  payment_date: string | null;
  issued_date: string | null;
  expiry_date: string | null;
  created_at: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_payment: { label: 'Pending Payment', variant: 'secondary' },
  paid: { label: 'Paid', variant: 'default' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'outline' },
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchApplications();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('admin-applications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'signage_applications' },
          () => fetchApplications()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('signage_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as Application[]);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to load applications');
    } finally {
      setLoadingData(false);
    }
  };

  const updateStatus = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const app = applications.find(a => a.id === id);
      
      const updates: {
        status: ApplicationStatus;
        amount_paid?: number;
        payment_date?: string;
        issued_date?: string;
        expiry_date?: string;
      } = { status: newStatus };
      
      if (newStatus === 'paid' && app) {
        updates.amount_paid = app.amount_due;
        updates.payment_date = new Date().toISOString();
      }
      
      if (newStatus === 'approved') {
        updates.issued_date = new Date().toISOString();
        updates.expiry_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error } = await supabase
        .from('signage_applications')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status updated to ${statusConfig[newStatus].label}`);
      fetchApplications();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending_payment').length,
    paid: applications.filter(a => a.status === 'paid').length,
    approved: applications.filter(a => a.status === 'approved').length,
  };

  if (loading || (!user && !isAdmin)) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={kasaLogo} 
                alt="KASA Logo" 
                className="w-12 h-12 rounded-full bg-primary-foreground p-1"
              />
              <div className="text-primary-foreground">
                <h1 className="text-lg font-bold">KASA Admin</h1>
                <p className="text-xs opacity-90">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="heroOutline" size="sm">
                  View Site
                </Button>
              </Link>
              <Button variant="hero" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.paid}</p>
                  <p className="text-sm text-muted-foreground">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="font-display text-xl">Applications</CardTitle>
                <CardDescription>Manage signage permit applications</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchApplications}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-center py-12 text-muted-foreground">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No applications found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-sm">{app.application_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.business_name}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{app.signage_type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(app.amount_due)}</p>
                            {app.amount_paid > 0 && (
                              <p className="text-xs text-green-600">Paid: {formatCurrency(app.amount_paid)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[app.status].variant}>
                            {statusConfig[app.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(app.created_at)}</TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(value) => updateStatus(app.id, value as ApplicationStatus)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending_payment">Pending Payment</SelectItem>
                              <SelectItem value="paid">Mark as Paid</SelectItem>
                              <SelectItem value="approved">Approve</SelectItem>
                              <SelectItem value="rejected">Reject</SelectItem>
                              <SelectItem value="expired">Mark Expired</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
