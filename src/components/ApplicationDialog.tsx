import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Clock, ExternalLink } from "lucide-react";
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

interface ApplicationDialogProps {
  children: React.ReactNode;
}

const ApplicationDialog = ({ children }: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
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
      toast.success("Application submitted successfully!");
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

  const resetForm = () => {
    setFormData({
      businessName: "",
      email: "",
      phone: "",
      signageType: "",
      location: "",
      description: ""
    });
    setApplicationId(null);
  };

  const verifyUrl = applicationId 
    ? `${window.location.origin}/verify?id=${applicationId}`
    : "";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {!applicationId ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Apply for Signage Permit</DialogTitle>
              <DialogDescription>
                Fill in your details to begin the permit application process
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input 
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signageType">Signage Type *</Label>
                <Select onValueChange={(value) => handleInputChange("signageType", value)}>
                  <SelectTrigger>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea 
                  id="description"
                  placeholder="Provide any additional information..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-center">Application Submitted!</DialogTitle>
              <DialogDescription className="text-center">
                Your permit application has been received
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-6">
              <div className="bg-secondary rounded-xl p-4 mb-4">
                <QRCodeSVG 
                  value={verifyUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  bgColor="transparent"
                  fgColor="hsl(145, 63%, 32%)"
                />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Application ID</p>
              <p className="text-primary font-mono text-lg font-semibold mb-4">{applicationId}</p>
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-secondary-foreground">Status: Pending Payment</span>
              </div>
              <Link 
                to={`/verify?id=${applicationId}`}
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                onClick={() => setOpen(false)}
              >
                <ExternalLink className="w-4 h-4" />
                View verification page
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
