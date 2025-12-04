import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ApplicationSection from "@/components/ApplicationSection";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <ApplicationSection />
      <Footer />
      <AIAssistant />
    </main>
  );
};

export default Index;
