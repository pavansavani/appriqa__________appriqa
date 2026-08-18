"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export function StoreCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from the public endpoint
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories"); // For public, we should ideally have a public route, but we use the admin one which returns all or we can filter it.
        if (res.ok) {
          const data = await res.json();
          // Filter only active categories for public display
          const activeCategories = data.categories?.filter((c: any) => c.status === "active") || [];
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch store categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading || categories.length === 0) return null;

  // Duplicate for seamless infinite scrolling
  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Appriqa Store</h2>
          <p className="text-[#8A8A8A] text-lg max-w-2xl">
            Explore products, designs, robotics, and DIY creations built for innovators, makers, learners, and technology enthusiasts.
          </p>
        </div>
        <Link href="/store" className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors whitespace-nowrap">
          Explore All Products 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="relative w-full overflow-hidden flex z-10 pb-8">
        {/* The scrolling track */}
        <div className="flex gap-6 animate-marquee min-w-max hover:pause pl-6">
          {duplicatedCategories.map((cat, idx) => (
            <Link 
              key={`${cat.id}-${idx}`}
              href={`/products/${cat.slug}`}
              className="group relative w-[280px] md:w-[320px] h-[380px] rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-[#2A2A2A] hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 bg-[#141414] shrink-0 hover:shadow-[0_0_30px_rgba(255,106,0,0.15)]"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${cat.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'})`,
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white font-heading group-hover:text-primary transition-colors duration-300">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mt-3">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

