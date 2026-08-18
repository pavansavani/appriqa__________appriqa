"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  href: string;
  tags?: string[];
  className?: string;
  children?: React.ReactNode;
}

export function ProjectCard({ title, description, imageSrc, href, tags, className }: CardProps) {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      whileHover={{ y: -8 }}
      transition={{ duration: DURATION.fast, ease: EASE.standard }}
      className={cn(
        "group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-shadow",
        className
      )}
    >
      <Link href={href}>
        {imageSrc && (
          <div className="relative h-64 overflow-hidden">
            <OptimizedImage
              src={imageSrc}
              alt={title}
              fill
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-8">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/10 text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </div>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeatureCard({ title, description, href, children, className, listItems }: CardProps & { listItems?: string[] }) {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: DURATION.fast, ease: EASE.standard }}
      className={cn(
        "group p-6 md:p-8 bg-card border border-border rounded-xl hover:bg-white/[0.02] transition-colors relative overflow-hidden",
        className
      )}
    >
      <Link href={href} className="block h-full">
        <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
          {children}
        </div>
        <h3 className="font-heading font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        {listItems && listItems.length > 0 && (
          <ul className="mt-5 space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </motion.div>
  );
}
