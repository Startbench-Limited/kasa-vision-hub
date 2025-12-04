import { FileCheck, BadgeCheck, ClipboardList, RefreshCcw, AlertCircle, ShieldCheck } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: FileCheck,
      title: "Signage Permit Application",
      description: "Apply for permits to display billboards, banners, and other outdoor advertisements across Kano State.",
      features: ["Easy online application", "Fast processing", "Digital verification"]
    },
    {
      icon: BadgeCheck,
      title: "License Verification",
      description: "Verify the authenticity of signage permits using our QR code system for instant validation.",
      features: ["QR code scanning", "Real-time status", "Expiry tracking"]
    },
    {
      icon: ClipboardList,
      title: "Compliance Inspection",
      description: "Regular inspection services to ensure all outdoor advertisements meet regulatory standards.",
      features: ["Scheduled inspections", "Compliance reports", "Remediation guidance"]
    },
    {
      icon: RefreshCcw,
      title: "Permit Renewal",
      description: "Seamlessly renew your signage permits before expiration to maintain compliance.",
      features: ["Auto-renewal reminders", "Quick processing", "Payment tracking"]
    },
    {
      icon: AlertCircle,
      title: "Violation Reporting",
      description: "Report unauthorized advertisements or violations for prompt action by our enforcement team.",
      features: ["Anonymous reporting", "Photo evidence", "Case tracking"]
    },
    {
      icon: ShieldCheck,
      title: "Payment Verification",
      description: "Track and verify payment status for all permits and fees using our secure system.",
      features: ["Transaction history", "Receipt generation", "Payment confirmation"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Comprehensive Signage Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From permit applications to compliance verification, KASA provides end-to-end 
            services for outdoor advertising regulation in Kano State.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="group bg-card rounded-2xl p-8 card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
