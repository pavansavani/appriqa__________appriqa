"use client";

import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/motion";

type Stat = {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
};

const STATS: Stat[] = [
  { label: "MVPs Shipped", value: 12, suffix: "+" },
  { label: "Hackathon Wins", value: 3, suffix: "" },
  { label: "Agile Workflows", value: 100, suffix: "%" },
  { label: "Weeks to Prototype", value: 2, suffix: "" },
];

export function StatsSection() {
  return (
    <section className="relative w-full overflow-hidden py-0">
      {/* Ambient glow behind the bar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      </div>

      {/* Full-width stats bar */}
      <div className="relative w-full border-y border-border/60 bg-[#111113]/80 backdrop-blur-md">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={VARIANTS.fadeUp}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-8 md:py-10 px-6 relative group cursor-default
                ${idx < STATS.length - 1 ? "border-r border-border/40" : ""}
                hover:bg-primary/5 transition-colors duration-300
              `}
            >
              {/* Hover bottom accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 rounded-full" />

              <div className="text-4xl md:text-5xl font-heading font-extrabold text-primary drop-shadow-sm">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
