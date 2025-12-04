import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import kasaLogo from "@/assets/kasa-logo.jpg";
import { Search, CheckCircle, XCircle, Clock, AlertTriangle, ArrowLeft, QrCode, Building, MapPin, Calendar, CreditCard } from "lucide-react";

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

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending_payment: { label: "Pending Payment", color: "bg-yellow-500", icon: Clock },
  paid: { label: "Paid", color: "bg-blue-500", icon: CreditCard },
  approved: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
  expired: { label: "Expired", color: "bg-gray-500", icon: AlertTriangle },
};

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [applicationId, setApplicationId] = useState(searchParams.get("id") || "");
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setApplicationId(id);
      handleSearch(id);
    }
  }, [searchParams]);

  // Realtime subscription
  useEffect(() => {
    if (!application) return;

    const channel = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'signage_applications',
          filter: `application_id=eq.${application.application_id}`
        },
        (payload) => {
          setApplication(payload.new as Application);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [application?.application_id]);

  const handleSearch = async (id?: string) => {
    const searchId = id || applicationId.trim();
    if (!searchId) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: dbError } = await supabase
        .from('signage_applications')
        .select('*')
        .eq('application_id', searchId)
        .maybeSingle();

      if (dbError) throw dbError;

      if (data) {
        setApplication(data as Application);
      } else {
        setApplication(null);
        setError("No application found with this ID");
      }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const StatusIcon = application ? statusConfig[application.status].icon : Clock;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={kasaLogo} 
                alt="KASA Logo" 
                className="w-12 h-12 rounded-full bg-primary-foreground p-1"
              />
              <div className="text-primary-foreground">
                <h1 className="text-lg font-bold">KASA</h1>
                <p className="text-xs opacity-90">Permit Verification</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="heroOutline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Section */}
          <Card className="card-shadow mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Verify Permit</CardTitle>
              <CardDescription>
                Enter an application ID or scan a QR code to verify permit status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter Application ID (e.g., KASA-XXXXX-XXXXX)"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12"
                />
                <Button onClick={() => handleSearch()} disabled={loading} size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {searched && !loading && (
            <>
              {error && !application && (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="pt-6 text-center">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-medium">{error}</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Please check the application ID and try again
                    </p>
                  </CardContent>
                </Card>
              )}

              {application && (
                <Card className="card-shadow overflow-hidden">
                  {/* Status Banner */}
                  <div className={`${statusConfig[application.status].color} px-6 py-4`}>
                    <div className="flex items-center justify-between text-primary-foreground">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-6 h-6" />
                        <div>
                          <p className="font-semibold">{statusConfig[application.status].label}</p>
                          <p className="text-sm opacity-90">Application ID: {application.application_id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                        {application.signage_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Business Info */}
                    <div className="grid gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Business Name</p>
                          <p className="font-semibold text-foreground">{application.business_name}</p>
                        </div>
                      </div>

                      {application.location && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold text-foreground">{application.location}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-secondary rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Payment Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Due</p>
                          <p className="font-semibold text-foreground">{formatCurrency(application.amount_due)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Paid</p>
                          <p className={`font-semibold ${application.amount_paid >= application.amount_due ? 'text-green-600' : 'text-amber-600'}`}>
                            {formatCurrency(application.amount_paid)}
                          </p>
                        </div>
                        {application.payment_date && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Payment Date</p>
                            <p className="font-semibold text-foreground">{formatDate(application.payment_date)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-secondary rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Important Dates
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Application Date</p>
                          <p className="font-semibold text-foreground">{formatDate(application.created_at)}</p>
                        </div>
                        {application.issued_date && (
                          <div>
                            <p className="text-sm text-muted-foreground">Issued Date</p>
                            <p className="font-semibold text-foreground">{formatDate(application.issued_date)}</p>
                          </div>
                        )}
                        {application.expiry_date && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Expiry Date</p>
                            <p className={`font-semibold ${new Date(application.expiry_date) < new Date() ? 'text-red-600' : 'text-foreground'}`}>
                              {formatDate(application.expiry_date)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Realtime indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Status updates in real-time
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Verify;
