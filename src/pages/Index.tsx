import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ApplicationSection from "@/components/ApplicationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <ApplicationSection />
      <Footer />
    </main>
  );
};

export default Index;
