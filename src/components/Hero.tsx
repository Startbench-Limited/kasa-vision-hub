import kasaLogo from "@/assets/kasa-logo.jpg";
import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationDialog from "./ApplicationDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src={kasaLogo} 
              alt="KASA Logo" 
              className="w-16 h-16 rounded-full bg-primary-foreground p-1 shadow-lg"
            />
            <div className="text-primary-foreground">
              <h1 className="text-lg font-bold tracking-tight">KASA</h1>
              <p className="text-xs opacity-90">Kano State Signage & Advertisement Agency</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium">About</a>
            <a href="#services" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium">Services</a>
            <Link to="/verify" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium">Verify</Link>
            <a href="#contact" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium">Contact</a>
          </nav>
          <ApplicationDialog>
            <Button variant="hero" size="sm" className="hidden md:flex">
              Apply Now
            </Button>
          </ApplicationDialog>
        </header>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center min-h-[70vh] pt-8">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-primary-foreground text-sm font-medium">Transforming Kano's Urban Landscape</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Kano State Signage &
              <br />
              <span className="text-primary-foreground/90">Advertisement Agency</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Regulating and controlling outdoor advertising to improve urban aesthetics, 
              ensure compliance, and drive economic growth in Kano State.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <ApplicationDialog>
                <Button variant="hero" size="xl">
                  Apply for Signage Permit
                </Button>
              </ApplicationDialog>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">₦1.5B</p>
                <p className="text-sm text-primary-foreground/70">Revenue Target 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">100%</p>
                <p className="text-sm text-primary-foreground/70">Compliance Goal</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">Growing</p>
                <p className="text-sm text-primary-foreground/70">Industry Standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <a href="#about" className="flex flex-col items-center text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <span className="text-xs font-medium mb-2">Scroll to explore</span>
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
