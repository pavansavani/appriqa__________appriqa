"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ProjectCard } from "@/components/features/Card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Editable } from "@/components/Editable";

const FILTERS = [
  "All", 
  "3D Designing & Printing", 
  "Software Solutions", 
  "AI Solutions", 
  "Robotics Prototyping", 
  "Product Designing and Development"
];

import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = PROJECTS.filter(project => 
    activeFilter === "All" || project.categories.includes(activeFilter)
  );

  return (
    <div className="pt-20">
      <Section className="bg-secondary/10 border-b border-border pb-12">
        <SectionHeader 
          title={<Editable contentKey="projects.hero.title" defaultContent="Our Projects" />}
          subtitle={<Editable contentKey="projects.hero.subtitle" defaultContent="A comprehensive portfolio of deep-tech engineering solutions delivered to global industry leaders." />}
        />
        
        {/* Filter Strip */}
        <div className="flex flex-wrap gap-2 mt-8">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                activeFilter === filter 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </Section>

      <Section className="py-20">
        <motion.div 
          key={activeFilter}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              href={`/projects/${project.slug}`}
              imageSrc={project.imageSrc}
              tags={project.categories}
              className="h-full"
            />
          ))}
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No projects found for the selected category.
          </div>
        )}
      </Section>

      {/* Build With Us CTA Section */}
      <Section className="py-24 bg-secondary/5 border-t border-border">
        <div className="bg-card border border-primary/20 p-12 md:p-20 rounded-[2.5rem] text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 relative z-10">
            <Editable contentKey="projects.cta.title" defaultContent="Build Your Project With Us" />
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            <Editable contentKey="projects.cta.desc" defaultContent="Have a complex deep-tech challenge? Our elite engineering team is ready to architect and build a custom solution from the ground up, tailored to your exact requirements." />
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
              <Link href="/contact">Contact Us <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-transparent hover:bg-white/5 border-border hover:border-primary/50 transition-colors">
              <Link href="/query">Submit a Query</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

