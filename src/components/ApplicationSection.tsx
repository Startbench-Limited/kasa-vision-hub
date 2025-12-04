import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, QrCode, Shield, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type SignageType = 'billboard' | 'banner' | 'neon_sign' | 'led_display' | 'wall_mount' | 'vehicle_wrap' | 'other';

const signageTypeMap: Record<string, SignageType> = {
  'billboard': 'billboard',
  'banner': 'banner',
  'neon-sign': 'neon_sign',
  'led-display': 'led_display',
  'wall-mount': 'wall_mount',
  'vehicle-wrap': 'vehicle_wrap',
  'other': 'other'
};

const ApplicationSection = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    signageType: "",
    location: "",
    description: ""
  });

  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateApplicationId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `KASA-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.email || !formData.signageType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const newId = generateApplicationId();
      
      const { error } = await supabase
        .from('signage_applications')
        .insert({
          application_id: newId,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone || null,
          signage_type: signageTypeMap[formData.signageType],
          location: formData.location || null,
          description: formData.description || null
        });

      if (error) throw error;

      setApplicationId(newId);
      toast.success("Application submitted successfully! Use your QR code for verification.");
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const verifyUrl = applicationId 
    ? `${window.location.origin}/verify?id=${applicationId}`
    : "";

  return (
    <section id="apply" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Get Started
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Apply for Signage Permit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete the form below to apply for your outdoor advertising permit. 
            Upon submission, you'll receive a QR code for payment tracking and verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Application Form */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Application Form</CardTitle>
              <CardDescription>Fill in your details to begin the permit application process</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input 
                    id="businessName"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="+234..."
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signageType">Signage Type *</Label>
                  <Select onValueChange={(value) => handleInputChange("signageType", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select signage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billboard">Billboard</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="neon-sign">Neon Sign</SelectItem>
                      <SelectItem value="led-display">LED Display</SelectItem>
                      <SelectItem value="wall-mount">Wall Mount</SelectItem>
                      <SelectItem value="vehicle-wrap">Vehicle Wrap</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Proposed Location</Label>
                  <Input 
                    id="location"
                    placeholder="Enter signage location address"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea 
                    id="description"
                    placeholder="Provide any additional information about your signage..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <div className="space-y-6">
            <Card className="card-shadow bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-3">
                  <QrCode className="w-7 h-7" />
                  QR Code Verification System
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Every approved permit includes a unique QR code for instant verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationId ? (
                  <div className="bg-primary-foreground rounded-2xl p-8 text-center">
                    <div className="inline-block p-4 bg-background rounded-xl mb-4">
                      <QRCodeSVG 
                        value={verifyUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                        bgColor="transparent"
                        fgColor="hsl(145, 63%, 32%)"
                      />
                    </div>
                    <p className="text-foreground font-semibold mb-1">Application ID</p>
                    <p className="text-primary font-mono text-lg mb-4">{applicationId}</p>
                    <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm mb-4">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-secondary-foreground">Status: Pending Payment</span>
                    </div>
                    <div>
                      <Link 
                        to={`/verify?id=${applicationId}`}
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View verification page
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary-foreground/10 border-2 border-dashed border-primary-foreground/30 rounded-2xl p-12 text-center">
                    <QrCode className="w-16 h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-primary-foreground/80">
                      Your unique QR code will appear here after submitting the application
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid gap-4">
              {[
                { icon: Shield, title: "Secure Verification", desc: "Each QR code is uniquely encrypted" },
                { icon: Clock, title: "Expiry Tracking", desc: "Monitor permit validity in real-time" },
                { icon: CheckCircle, title: "Payment Status", desc: "Instantly verify payment completion" }
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 bg-secondary rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verify Link */}
            <Link 
              to="/verify"
              className="block bg-secondary rounded-xl p-4 text-center hover:bg-secondary/80 transition-colors"
            >
              <p className="font-semibold text-foreground">Already have a permit?</p>
              <p className="text-sm text-primary flex items-center justify-center gap-2 mt-1">
                <QrCode className="w-4 h-4" />
                Verify your permit status here
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
