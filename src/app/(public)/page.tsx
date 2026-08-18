import { HomeHero } from "@/components/features/HomeHero";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FeatureCard, ProjectCard } from "@/components/features/Card";
import { Cpu, Bot, Factory, Zap, Code, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VisualWorkShowcase } from "@/components/features/VisualWorkShowcase";
import { NavigationCards } from "@/components/features/NavigationCards";
import { StoreCarousel } from "@/components/features/StoreCarousel";
import { Editable } from "@/components/Editable";

export default function Home() {
  return (
    <>
      <HomeHero />
      
      <Section className="bg-secondary/10 py-12 md:py-16">
        <SectionHeader 
          title={<Editable contentKey="home.engineering.title" defaultContent="Engineering Excellence" />} 
          subtitle={<Editable contentKey="home.engineering.subtitle" defaultContent="We bridge the gap between AI research and physical reality, delivering rapid prototypes and scalable MVPs for autonomous systems." />}
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="Robotics & AI" 
            description="Autonomous systems, computer vision, and machine learning models for industrial automation."
            href="/solutions/robotics-prototyping"
          >
            <Bot className="w-8 h-8" />
          </FeatureCard>
          <FeatureCard 
            title="Embedded Systems" 
            description="Custom PCB design, firmware development, and IoT infrastructure for mission-critical operations."
            href="/solutions/embedded-systems"
          >
            <Cpu className="w-8 h-8" />
          </FeatureCard>
          <FeatureCard 
            title="Energy Solutions" 
            description="Sustainable energy management, smart grid integration, and next-gen battery tech."
            href="/solutions/energy-solutions"
          >
            <Zap className="w-8 h-8" />
          </FeatureCard>
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/solutions">View All Solutions</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeader 
          title={<Editable contentKey="home.projects.title" defaultContent="Featured Projects" />}
          subtitle={<Editable contentKey="home.projects.subtitle" defaultContent="A selection of our recent engineering achievements." />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard 
            title="Project Alpha-R" 
            description="Autonomous robotic arm software for modular micro-factories. Built with advanced computer vision for dynamic pick-and-place."
            href="/projects/alpha-r"
            imageSrc="/images/project-1.png"
            tags={["Robotics", "AI", "Manufacturing"]}
          />
          <ProjectCard 
            title="Nexus Edge AI" 
            description="Smart grid IoT sensor mesh prototype designed to detect energy anomalies using edge AI."
            href="/projects/nexus-edge-ai"
            imageSrc="/images/project-2.png"
            tags={["IoT", "Energy", "Smart Cities"]}
          />
        </div>
        <div className="mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">Explore Portfolio</Link>
          </Button>
        </div>
      </Section>

      <StoreCarousel />

      <Section className="bg-transparent py-20 md:py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="flex flex-col items-center justify-center mb-16 relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-5 shadow-sm">
            <Editable contentKey="home.why.label" defaultContent="The Advantage" />
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
            <Editable contentKey="home.why.title1" defaultContent="WHY CHOOSE " />
            <span className="font-brand font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm tracking-wider">
              <Editable contentKey="home.why.title2" defaultContent="APPRIQA?" />
            </span>
          </h2>
          <div className="w-14 h-1 bg-primary rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
          {/* Card 1 */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Code className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">A Lean Team of Builders</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">No corporate bloat. Just obsessed engineers shipping AI and robotics solutions at breakneck speed. We move fast and build things that actually work.</p>
          </div>

          {/* Card 2 — center/featured */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Rapid Prototyping</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">From napkin sketch to working MVP in weeks, not years. We bridge the gap between AI research and physical reality.</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Fail Fast, Scale Hard</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">We iterate aggressively to find product-market fit in deep-tech, delivering scalable MVPs for autonomous systems across industries.</p>
          </div>

          {/* Card 4 */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">AI-First Approach</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Every solution we build starts with intelligent design. Computer vision, edge AI, and autonomous decision-making baked in from day one.</p>
          </div>

          {/* Card 5 */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Cpu className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Deep Hardware Expertise</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Custom PCBs, firmware, embedded systems and IoT — we own the full stack from silicon to cloud for mission-critical applications.</p>
          </div>

          {/* Card 6 */}
          <div className="group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-border hover:border-primary/50 transition-all duration-400 p-8 rounded-2xl flex flex-col items-center text-center cursor-default shadow-md hover:shadow-[0_0_30px_rgba(255,106,0,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Sustainable Energy</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Smart grid integration, next-gen battery tech, and energy management systems that power tomorrow's sustainable industrial operations.</p>
          </div>
        </div>
      </Section>

      <VisualWorkShowcase />
      
      <NavigationCards />

      <Section className="text-center py-20 bg-secondary/20">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
          <Editable contentKey="home.cta.title" defaultContent="Ready to disrupt the status quo?" />
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          <Editable contentKey="home.cta.desc" defaultContent="Partner with our agile engineering team to rapidly validate and scale your next big AI or Robotics idea." />
        </p>
        <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full">
          <Link href="/contact"><Editable contentKey="home.cta.button" defaultContent="Let's Build" /></Link>
        </Button>
      </Section>
    </>
  );
}

