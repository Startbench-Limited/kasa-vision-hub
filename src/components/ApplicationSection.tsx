import { QrCode, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ApplicationDialog from "./ApplicationDialog";

const ApplicationSection = () => {
  return (
    <section id="apply" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Ready to Begin?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Start Your Application
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Apply for your outdoor advertising permit today. Upon submission, you'll receive 
            a unique QR code for payment tracking and instant verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ApplicationDialog>
              <Button size="xl">
                Apply for Signage Permit
              </Button>
            </ApplicationDialog>
            <Link to="/verify">
              <Button variant="outline" size="xl">
                Verify Existing Permit
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Secure Verification", desc: "Each permit includes a uniquely encrypted QR code for instant verification" },
              { icon: Clock, title: "Expiry Tracking", desc: "Monitor permit validity and receive renewal reminders before expiration" },
              { icon: CheckCircle, title: "Payment Status", desc: "Instantly verify payment completion and track your application status" }
            ].map((feature) => (
              <div key={feature.title} className="bg-secondary rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
