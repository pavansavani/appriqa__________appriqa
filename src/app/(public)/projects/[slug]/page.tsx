"use client";

import { useParams } from "next/navigation";
import { Section, SectionHeader } from "@/components/layout/Section";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { motion } from "framer-motion";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const project = PROJECTS.find(p => p.slug === slug);
  const title = project?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const imageSrc = project?.imageSrc || "/images/home-hero.png";

  return (
    <div className="pt-20">
      <Section className="bg-secondary/10 border-b border-border">
        <div className="max-w-4xl">
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" animate="visible" className="mb-4">
            <Link href="/projects" className="text-primary hover:underline text-sm font-medium">
              &larr; Back to Projects
            </Link>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground"
          >
            {title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {(project?.categories || ["Robotics", "AI", "Manufacturing"]).map(tag => (
              <span key={tag} className="px-3 py-1 bg-background border border-border rounded-full text-sm font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance, delay: 0.2 }}
            className="w-full h-64 md:h-96 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 z-10" />
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">The Challenge</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The client required a highly scalable, fault-tolerant system capable of operating under extreme industrial conditions. Previous iterations had failed due to latency issues and hardware degradation. They approached APPRIQA to completely re-engineer the stack from the hardware layer up to the cloud infrastructure.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Our Solution</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We deployed a cross-functional team of embedded engineers, AI researchers, and cloud architects. The core solution utilized a custom-designed Edge node architecture communicating with a highly available distributed backend.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Custom PCB design for extreme temperatures", 
                  "Real-time Rust-based embedded firmware",
                  "Computer vision models optimized for edge",
                  "Zero-trust secure telemetry pipeline"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border p-8 rounded-2xl">
              <h3 className="text-xl font-heading font-bold mb-6">Key Results</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-heading font-bold text-primary mb-1">
                    <AnimatedCounter value={40} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Throughput Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-heading font-bold text-accent mb-1">
                    <AnimatedCounter value={99.99} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">System Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-heading font-bold text-foreground mb-1">
                    <AnimatedCounter value={6} suffix="mo" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Deployment Time</div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl text-center">
              <h3 className="text-xl font-heading font-bold mb-4 text-foreground">Have a similar project?</h3>
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">Consult an Engineer <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
