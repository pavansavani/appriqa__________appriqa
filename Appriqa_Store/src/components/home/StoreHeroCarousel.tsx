"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BANNERS = [
  {
    id: 1,
    href: "/store",
    image: "/images/store/banner-1.png",
  },
  {
    id: 2,
    href: "/store/category/3d-printing",
    image: "/images/store/banner-2.png",
  },
  {
    id: 3,
    href: "/store/category/robotics",
    image: "/images/store/banner-3.png",
  },
  {
    id: 4,
    href: "/store/category/iot",
    image: "/images/store/banner-4.png",
  }
];

export function StoreHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-black overflow-hidden group">
      
      {/* Carousel Track */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full flex items-center bg-cover bg-center bg-no-repeat cursor-pointer"
            style={{ backgroundImage: `url(${BANNERS[currentIndex].image})` }}
            onClick={() => window.location.href = BANNERS[currentIndex].href}
          >
            {/* The banner image covers the entire area. Text overlays have been removed. */}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 border border-white/10 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 border border-white/10 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={cn(
              "transition-all duration-300 rounded-full",
              currentIndex === idx 
                ? "w-8 h-2 bg-primary" 
                : "w-2 h-2 bg-white/40 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}

