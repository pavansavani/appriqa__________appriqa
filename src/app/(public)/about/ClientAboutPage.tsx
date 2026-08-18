"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronRight, Target, Lightbulb, Compass, Users, Globe, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editable } from "@/components/Editable";

const XIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Mock fallbacks if JSON settings are empty
const FALLBACKS = {
  hero: { title: "Building the Future Through Innovation", subtitle: "We design, build, and deploy the AI and robotics infrastructure of tomorrow, moving from concept to MVP in record time." },
  whoWeAre: { overview: "APPRIQA is a lean deep-tech startup.", whatWeDo: "We provide end-to-end solutions.", problems: "We solve complex manufacturing problems.", expertise: "AI & Robotics", commitment: "100% innovation focused." },
  story: [
    { title: "Idea", desc: "The concept was born." },
    { title: "Research", desc: "Extensive market and tech research." },
    { title: "Foundation", desc: "Company officially founded." },
    { title: "First Prototype", desc: "Shipped our first working model." },
    { title: "Growth", desc: "Expanded team and capabilities." },
    { title: "Future Vision", desc: "Scaling globally." }
  ],
  missionVision: { mission: "To aggressively iterate on AI and robotics paradigms.", vision: "To be the definitive brain behind the next generation of autonomous systems." },
  whatWeBuild: [
    { title: "3D Designing & Printing", desc: "Rapid Prototyping & Custom Parts", link: "/solutions/3d-designing-and-printing", img: "/images/home-hero.png" },
    { title: "Software Solutions", desc: "Web, App, CRM Solutions", link: "/solutions/software-solutions", img: "/images/project-1.png" },
    { title: "AI Solutions", desc: "AI Agents & Automation", link: "/solutions/ai-solutions", img: "/images/project-2.png" },
    { title: "Robotics Prototyping", desc: "IoT & Embedded Systems", link: "/solutions/robotics-prototyping", img: "/images/project-3.png" },
    { title: "Product Designing & Development", desc: "CAD & Mechanical Design", link: "/solutions/product-designing-and-development", img: "/images/project-4.png" }
  ],
  workProcess: [
    { title: "Understand", desc: "Deep dive into requirements." },
    { title: "Research", desc: "Feasibility and technology stack." },
    { title: "Design", desc: "UI/UX and Mechanical Design." },
    { title: "Prototype", desc: "Rapid iterations." },
    { title: "Develop", desc: "Full-scale engineering." },
    { title: "Test", desc: "Rigorous QA and validation." },
    { title: "Deliver", desc: "Deployment and launch." },
    { title: "Support", desc: "Continuous maintenance." }
  ],
  whyChooseUs: [
    "Innovation Driven", "End-to-End Development", "Multi-Technology Expertise",
    "Custom Engineering", "Scalable Solutions", "Customer-Focused Approach"
  ],
  technologies: {
    "Software": ["React", "Node.js", "Python"],
    "AI": ["TensorFlow", "PyTorch", "OpenAI"],
    "Robotics": ["ROS", "C++", "Arduino"],
    "Design": ["Figma", "SolidWorks", "Blender"],
    "Manufacturing": ["3D Printing", "CNC", "Injection Molding"]
  },
  industries: ["Manufacturing", "Education", "Research", "Startups", "Healthcare", "Agriculture", "Industrial Automation", "Consumer Products"],
  values: ["Innovation", "Quality", "Reliability", "Sustainability", "Transparency", "Continuous Learning"],
  cta: { title: "Have an Idea?", desc: "Let's build something extraordinary together. Our engineering team is ready." }
};

export default function ClientAboutPage({ settings, team, milestones, partners, gallery }: any) {
  const hero = settings.hero?.title ? settings.hero : FALLBACKS.hero;
  const whoWeAre = settings.who_we_are?.overview ? settings.who_we_are : FALLBACKS.whoWeAre;
  const story = settings.story?.length ? settings.story : FALLBACKS.story;
  const missionVision = settings.mission_vision?.mission ? settings.mission_vision : FALLBACKS.missionVision;
  const whatWeBuild = settings.what_we_build?.length ? settings.what_we_build : FALLBACKS.whatWeBuild;
  const workProcess = settings.work_process?.length ? settings.work_process : FALLBACKS.workProcess;
  const whyChooseUs = settings.why_choose_us?.length ? settings.why_choose_us : FALLBACKS.whyChooseUs;
  const technologies = settings.technologies && Object.keys(settings.technologies).length ? settings.technologies : FALLBACKS.technologies;
  const industries = settings.industries?.length ? settings.industries : FALLBACKS.industries;
  const values = settings.values?.length ? settings.values : FALLBACKS.values;
  const cta = settings.cta?.title ? settings.cta : FALLBACKS.cta;

  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <div className="relative w-full min-h-[70vh] flex items-center justify-center py-24 overflow-hidden border-b border-border">
        {/* Background Image with Blending */}
        <div className="absolute inset-0 z-0">
          <img src="/images/about-hero.png" alt="APPRIQA Lab" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent opacity-80" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold mb-6 text-foreground tracking-tight"
          >
            <Editable contentKey="about.hero.title" defaultContent={hero.title} page="about" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10 max-w-3xl mx-auto"
          >
            <Editable contentKey="about.hero.subtitle" defaultContent={hero.subtitle} page="about" />
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, delay: 0.2 }} className="flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8"><Link href="/solutions">Explore Solutions</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent hover:bg-white/5 border-border hover:border-primary/50"><Link href="/contact">Contact Us</Link></Button>
          </motion.div>
        </div>
      </div>

      {/* 2. Who We Are */}
      <Section className="py-24 bg-background">
        <SectionHeader title="Who We Are" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-2xl lg:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Company Overview</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{whoWeAre.overview}</p>
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">What We Do</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{whoWeAre.whatWeDo}</p>
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Problems We Solve</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{whoWeAre.problems}</p>
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Our Expertise</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{whoWeAre.expertise}</p>
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Commitment to Innovation</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{whoWeAre.commitment}</p>
          </motion.div>
        </div>
      </Section>



      {/* 4. Mission & Vision */}
      <Section className="py-24 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-10 rounded-3xl text-center">
            <Target className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-4 text-foreground">Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{missionVision.mission}</p>
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-10 rounded-3xl text-center">
            <Compass className="w-16 h-16 text-accent mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-4 text-foreground">Vision</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{missionVision.vision}</p>
          </motion.div>
        </div>
      </Section>

      {/* 5. What We Build */}
      <Section className="py-24 bg-secondary/10 border-y border-border">
        <SectionHeader title="What We Build" subtitle="Our core solution domains." align="center" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {whatWeBuild.map((item: any, idx: number) => (
            <motion.div key={idx} variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border rounded-2xl overflow-hidden group">
              <div className="h-48 bg-muted overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-muted-foreground mb-6 h-12">{item.desc}</p>
                <Button asChild variant="outline" className="w-full rounded-full"><Link href={item.link}>Explore <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>



      {/* 7. Why Choose Appriqa */}
      <Section className="py-24 bg-secondary/5 border-y border-border">
        <SectionHeader title="Why Choose Appriqa" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {whyChooseUs.map((feature: string, idx: number) => (
            <motion.div key={idx} variants={VARIANTS.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card border border-border p-6 rounded-2xl flex items-center">
              <CheckCircle2 className="w-6 h-6 text-primary mr-4 shrink-0" />
              <h4 className="font-bold text-lg">{feature}</h4>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 8. Technologies We Work With */}
      <Section className="py-24 bg-background">
        <SectionHeader title="Technologies We Work With" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16 max-w-6xl mx-auto">
          {Object.entries(technologies).map(([category, techs]: any, idx: number) => (
            <div key={idx} className="bg-card border border-border p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">{category}</h4>
              <ul className="space-y-2">
                {techs.map((tech: string, i: number) => (
                  <li key={i} className="text-muted-foreground flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-primary/50" /> {tech}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Industries We Serve */}
      <Section className="py-24 bg-secondary/10 border-y border-border">
        <SectionHeader title="Industries We Serve" align="center" />
        <div className="flex flex-wrap justify-center gap-4 mt-16 max-w-4xl mx-auto">
          {industries.map((ind: string, idx: number) => (
            <div key={idx} className="bg-card border border-primary/20 text-foreground px-6 py-3 rounded-full font-medium shadow-sm hover:border-primary transition-colors">
              {ind}
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Our Values */}
      <Section className="py-24 bg-background">
        <SectionHeader title="Our Values" align="center" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {values.map((val: string, idx: number) => (
            <div key={idx} className="bg-secondary/5 border border-border p-6 text-center rounded-2xl">
              <h4 className="font-bold text-lg">{val}</h4>
            </div>
          ))}
        </div>
      </Section>



      {/* 14. Our Partners */}
      <Section className="py-24 bg-background">
        <SectionHeader title="Our Partners" align="center" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-5xl mx-auto">
          {partners && partners.length > 0 ? partners.map((p: any) => (
            <div key={p.id} className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-primary transition-colors">
              <img src={p.logo_url || "/images/placeholder.jpg"} alt={p.name} className="w-20 h-20 object-contain mb-4 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all" />
              <h4 className="font-bold">{p.name}</h4>
              <p className="text-xs text-primary uppercase mt-1">{p.category}</p>
            </div>
          )) : (
            <div className="col-span-full text-center text-muted-foreground">Partners will be displayed here.</div>
          )}
        </div>
      </Section>

      {/* 15. Final Call To Action */}
      <Section className="py-32 bg-primary/10 border-t border-primary/20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-foreground"><Editable contentKey="about.cta.title" defaultContent={cta.title} page="about" /></h2>
          <p className="text-xl text-muted-foreground mb-10"><Editable contentKey="about.cta.desc" defaultContent={cta.desc} page="about" /></p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg"><Link href="/projects">Start a Project</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg"><Link href="/solutions">Explore Solutions</Link></Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg"><Link href="/contact">Contact Us</Link></Button>
          </div>
          <div className="flex justify-center gap-6 text-muted-foreground items-center">
            <a href="https://www.youtube.com/@Appriqa" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col items-center gap-1">
              <YoutubeIcon className="w-8 h-8" />
            </a>
            <a href="https://x.com/appriqa" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col items-center gap-1">
              <XIcon className="w-7 h-7" />
            </a>
            <a href="https://www.instagram.com/appriqa_pvt_ltd?igsh=MW5mMnUzcDB1aW90Nw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex flex-col items-center gap-1">
              <InstagramIcon className="w-7 h-7" />
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
