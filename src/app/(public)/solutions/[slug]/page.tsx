"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { SOLUTIONS_DATA } from "@/lib/data/solutions-detail";
import { FeatureCard, ProjectCard } from "@/components/features/Card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function SolutionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = SOLUTIONS_DATA[slug];
  const [openFaq, setOpenFaq] = useState<string[]>([]);

  if (!data) {
    return notFound();
  }

  const Icon = data.icon;

  return (
    <div className="pt-20">
      {/* 1. Short Introduction (Hero) */}
      <Section className="bg-secondary/10 border-b border-border overflow-hidden relative py-12 md:py-24">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl relative z-10">
          <motion.div variants={VARIANTS.fadeUp} initial="hidden" animate="visible" className="mb-8 flex items-center gap-3">
            <Link href="/solutions" className="text-primary hover:underline text-sm font-medium">
              &larr; Solutions
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-foreground text-sm font-medium">{data.title}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance }}
            className="flex items-center gap-6 mb-10"
          >
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Icon className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground">
              {data.title}
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl"
          >
            {data.intro}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.entrance, delay: 0.2 }}
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full">
              <Link href="/contact">Discuss Your Project <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* 2. Sub-Solution Cards */}
      <Section className="py-24 md:py-32 bg-background">
        <div className="mb-16">
          <SectionHeader 
            title="Core Capabilities" 
            subtitle={`Explore the specialized domains we cover under ${data.title}.`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {data.subSolutions.map((sub, idx) => (
            <div key={idx} className="bg-card border border-border p-8 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-colors group relative overflow-hidden">
              <h3 className="text-xl font-heading font-bold text-foreground mb-3 relative z-10">{sub.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow relative z-10">{sub.description}</p>
              <div className="relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Key Capabilities</h4>
                <ul className="space-y-2">
                  {sub.capabilities.map((cap, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Process / Workflow & Why Choose Us */}
      <Section className="py-24 md:py-32 bg-secondary/5 border-y border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          
          {/* Workflow */}
          <div>
            <h2 className="text-4xl font-heading font-bold mb-12">Our Process</h2>
            <div className="space-y-12">
              {data.workflow.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-heading shrink-0 text-lg">
                      {idx + 1}
                    </div>
                    {idx !== data.workflow.length - 1 && (
                      <div className="w-px h-full bg-border mt-4" />
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-background border border-border p-10 md:p-14 rounded-[2.5rem] shadow-2xl sticky top-24">
            <div className="mb-10 inline-flex p-4 rounded-2xl bg-primary/10 text-primary">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-heading font-bold mb-8">Why Choose Appriqa?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              We bring unparalleled deep-tech expertise to {data.title.toLowerCase()}, ensuring your projects are executed flawlessly from day one.
            </p>
            <ul className="space-y-5">
              {data.whyChooseUs.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-5 p-5 rounded-2xl bg-secondary/20 border border-transparent hover:border-primary/20 transition-colors">
                  <CheckCircle className="w-7 h-7 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground text-lg leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </Section>

      {/* 4. Relevant Projects */}
      {data.projects && data.projects.length > 0 && (
        <Section className="py-24 md:py-32 bg-background">
          <div className="mb-16">
            <SectionHeader 
              title="Featured Projects" 
              subtitle={`See how we've deployed ${data.title.toLowerCase()} in the real world.`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {data.projects.map((project, idx) => (
              <ProjectCard 
                key={idx}
                title={project.title}
                description="Explore the case study to see how we engineered this solution from the ground up."
                href={project.href}
                imageSrc={project.imageSrc}
                tags={[data.title]}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 5. FAQ */}
      <Section className="py-24 md:py-32 bg-secondary/10 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <SectionHeader 
              title="Frequently Asked Questions" 
              align="center"
            />
          </div>
          <Accordion value={openFaq} onValueChange={(val: any) => setOpenFaq(val)} className="w-full space-y-6">
            {data.faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`} 
                onMouseEnter={() => setOpenFaq([`item-${idx}`])}
                onMouseLeave={() => setOpenFaq([])}
                className="bg-background border border-border rounded-2xl px-8 py-3 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-xl font-semibold hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* 6. CTA */}
      <Section className="py-32 bg-background text-center">
        <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8 leading-tight">Ready to accelerate your <br className="hidden md:block"/> {data.title.toLowerCase()}?</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Partner with our elite engineering team. We're ready to evaluate your requirements and architect a custom solution tailored to your exact needs.
        </p>
        <Button asChild size="lg" className="h-16 px-12 text-xl rounded-full">
          <Link href="/contact">Let's Build Together <ArrowRight className="ml-3 w-6 h-6" /></Link>
        </Button>
      </Section>
    </div>
  );
}
