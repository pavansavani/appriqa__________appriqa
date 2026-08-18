"use client";

import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ children, className, containerClassName, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 lg:py-32 overflow-hidden", className)} {...props}>
      <motion.div
        className={cn("container mx-auto px-4 md:px-6 lg:px-8", containerClassName)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={VARIANTS.staggerContainer}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center mx-auto" : "text-left",
        className
      )}
    >
      <motion.h2
        variants={VARIANTS.fadeUp}
        className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={VARIANTS.fadeUp}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          style={align === "center" ? { margin: "0 auto" } : {}}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
