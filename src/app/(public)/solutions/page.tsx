"use client";

import { Section, SectionHeader } from "@/components/layout/Section";
import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Editable } from "@/components/Editable";

const SOLUTIONS = [
  { 
    id: "3d-designing-and-printing", 
    title: "3D Designing & Printing", 
    desc: "Rapid Prototyping & Custom Parts", 
    img: "/images/home-hero.png",
    subsolutions: [
      "3D Printing Services",
      "Rapid Prototyping",
      "Custom 3D Printing",
      "Functional Prototyping",
      "Custom Parts & Components"
    ]
  },
  { 
    id: "software-solutions", 
    title: "Software Solutions", 
    desc: "Web, App, CRM Solutions", 
    img: "/images/project-1.png",
    subsolutions: [
      "Web Development",
      "App Development",
      "CRM Solutions"
    ]
  },
  { 
    id: "ai-solutions", 
    title: "AI Solutions", 
    desc: "AI Agents & Automation", 
    img: "/images/project-2.png",
    subsolutions: [
      "AI Agents",
      "Generative AI",
      "AI Automation",
      "AI Data & Intelligence",
      "Custom AI Solutions"
    ]
  },
  { 
    id: "robotics-prototyping", 
    title: "Robotics Prototyping", 
    desc: "IoT & Embedded Systems", 
    img: "/images/project-3.png",
    subsolutions: [
      "Embedded Systems",
      "IoT Solutions",
      "Robotics Prototyping",
      "Automation Solutions"
    ]
  },
  { 
    id: "product-designing-and-development", 
    title: "Product Designing and Development", 
    desc: "CAD & Mechanical Design", 
    img: "/images/project-4.png",
    subsolutions: [
      "Industrial Product Design",
      "3D Product Design",
      "CAD Design",
      "3D Modeling",
      "Mechanical Design",
      "Functional Design",
      "Prototype Design",
      "Design Optimization",
      "Design for Manufacturing"
    ]
  },
];

export default function SolutionsPage() {
  return (
    <div className="pt-20">
      <Section className="bg-secondary/5 pb-24 border-b border-border">
        <SectionHeader 
          title={<Editable contentKey="solutions.hero.title" defaultContent="Engineering Solutions" />}
          subtitle={<Editable contentKey="solutions.hero.subtitle" defaultContent="Comprehensive deep-tech capabilities tailored for complex industrial challenges." />}
          className="mb-12 md:mb-16"
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SOLUTIONS.map((sol, idx) => (
            <motion.div 
              key={sol.id} 
              variants={VARIANTS.fadeUp} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              custom={idx}
              className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden group flex flex-col transition-colors hover:border-[#FF6B00]/50"
            >
              <div className="h-56 bg-muted overflow-hidden shrink-0 relative">
                <img 
                  src={sol.img} 
                  alt={sol.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-60" />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-white mb-2"><Editable contentKey={`solutions.${sol.id}.title`} defaultContent={sol.title} /></h4>
                <p className="text-[#8A8A8A] mb-6 flex-1 leading-relaxed"><Editable contentKey={`solutions.${sol.id}.desc`} defaultContent={sol.desc} /></p>
                
                <ul className="space-y-2 mb-8">
                  {sol.subsolutions.map((sub, i) => (
                    <li key={i} className="flex items-center text-sm text-[#D4D4D4]">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-[#FF6B00] shrink-0" />
                      {sub}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/solutions/${sol.id}`}
                  className="flex items-center justify-center w-full py-3 px-4 rounded-full border border-[#2A2A2A] text-white font-medium hover:bg-white/5 transition-colors group/btn mt-auto"
                >
                  Explore <ArrowRight className="w-4 h-4 ml-2 text-[#8A8A8A] group-hover/btn:text-white transition-colors" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

