import { CheckCircle, Users, Building, Leaf, Linkedin, Facebook } from "lucide-react";
import dgImage from "@/assets/dg-image.png";

const About = () => {
  const goals = [
    {
      icon: CheckCircle,
      title: "Regulatory Compliance",
      description: "Ensuring all outdoor advertisements meet state standards and regulations."
    },
    {
      icon: Building,
      title: "Urban Aesthetics",
      description: "Improving the visual appeal of Kano's urban environment through controlled advertising."
    },
    {
      icon: Users,
      title: "Investor Attraction",
      description: "Creating a favorable environment for advertising sector investments."
    },
    {
      icon: Leaf,
      title: "Sustainable Growth",
      description: "Maximizing state revenue while promoting responsible advertising practices."
    }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* DG Profile Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Profile Text - Left Side */}
          <div className="animate-slide-up order-2 lg:order-1">
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Kabiru Saidu Dakata
            </h2>
            <p className="text-primary font-semibold mb-6">Director General, KASA</p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Kabiru Saidu Dakata is the Director General of the Kano State Signage & Advertisement Agency (KASA). He obtained an M.Sc. in Peace and Conflict Resolution, a Master's in Development Studies (MDS), a Master's in Business Administration (MBA), B.Sc. in Economics, as well as an Advanced Diploma in Law.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              He has more than 10 years' experience in research, advocacy and public awareness on issues related to promoting democratic accountability, social justice and peace-building in Nigeria. He is an advocate for policy reform in the social and economic sectors, like education, health, youth employment, tax justice, etc.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              He is a passionate development activist with experience in community development, community needs assessment, budget tracking, peace-building, gender issues, conflict prevention, monitoring & evaluation, and proposal writing. He is a member of the Nigerian Institute of Management (NIM) and a graduate member of the African Centre for Leadership Strategy and Development.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/kabiru-dakata-049ab5246" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/kabir.dakata.5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* DG Image - Right Side */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden card-shadow">
                <img 
                  src={dgImage} 
                  alt="Kabiru Saidu Dakata - Director General of KASA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                Director General
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              About KASA
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              Regulating Outdoor Advertising in Kano State
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              The Kano State Signage and Advertisement Agency (KASA) is the government body 
              responsible for regulating and controlling outdoor advertising in Kano State. 
              Recently established, our agency aims to enforce compliance with advertising 
              regulations, improve the aesthetics of the urban environment, and attract 
              investors to the advertising sector.
            </p>
            <div className="bg-secondary rounded-2xl p-6 border-l-4 border-primary">
              <h3 className="font-display font-semibold text-foreground mb-2">Our Mandate</h3>
              <p className="text-muted-foreground">
                To regulate and control the practice of signage and outdoor advertisement in Kano State, 
                ensuring a harmonious urban landscape while generating sustainable revenue for state development.
              </p>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <div 
                key={goal.title}
                className="group bg-card rounded-2xl p-6 card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <goal.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{goal.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Banner */}
        <div className="mt-20 bg-primary rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative">
            <span className="inline-block bg-primary-foreground/20 text-primary-foreground text-sm font-medium px-4 py-1 rounded-full mb-4">
              Recent News
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
              Operational Support from Governor Abba K. Yusuf
            </h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              KASA has received operational vehicles from His Excellency, Governor Abba K. Yusuf, 
              to strengthen our enforcement capabilities and better serve Kano State's advertising industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
