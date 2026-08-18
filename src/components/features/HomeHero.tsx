"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { Editable } from "@/components/Editable";

export function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[128px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={VARIANTS.staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={VARIANTS.fadeUp} className="mb-6">
            <span className="inline-block py-1.5 px-3 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-semibold tracking-wide uppercase">
              <Editable contentKey="home.hero.label" defaultContent="AI & Robotics Disruptors" />
            </span>
          </motion.div>
          
          <motion.h1 
            variants={VARIANTS.fadeUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground leading-[1.1] tracking-tight mb-6 md:mb-8"
          >
            <Editable contentKey="home.hero.title1" defaultContent="Bringing " /><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"><Editable contentKey="home.hero.title2" defaultContent="Intelligence" /></span> <Editable contentKey="home.hero.title3" defaultContent="to Life." />
          </motion.h1>
          
          <motion.p 
            variants={VARIANTS.fadeUp}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            <Editable contentKey="home.hero.desc" defaultContent="Empowering the next generation of embodied AI and autonomous robotics. We turn visionary concepts into production-ready reality at warp speed." />
          </motion.p>
          
          <motion.div 
            variants={VARIANTS.fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/solutions">
                <Editable contentKey="home.hero.btn1" defaultContent="Explore Solutions" /> <ArrowRight className="ml-2 w-5 h-5 inline-block" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-border hover:bg-white/5">
              <Link href="/projects">
                <Editable contentKey="home.hero.btn2" defaultContent="View Projects" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: DURATION.hero, ease: EASE.entrance, delay: 0.4 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:flex items-center justify-end pr-10 pointer-events-none"
      >
        <div className="relative w-full max-w-[800px] aspect-square rounded-full overflow-hidden border border-white/5 opacity-80 mix-blend-lighten mask-image-radial-gradient z-20">
          <Editable 
            contentKey="home.hero.image" 
            type="image" 
            defaultContent={<img src="/images/home-hero.png" alt="Industrial Robotics" className="object-cover w-full h-full" />}
          />
        </div>
      </motion.div>
    </section>
  );
}
