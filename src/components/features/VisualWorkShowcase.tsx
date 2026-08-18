import { GalleryService } from "@/services/gallery.service";
import { ShowcaseItem } from "@/types";
import { Section } from "@/components/layout/Section";
import { Play } from "lucide-react";

export async function VisualWorkShowcase() {
  const items = await GalleryService.getPublishedItems();

  if (!items || items.length === 0) {
    // Return empty if no items, or a placeholder if required
    return null;
  }

  // Helper to determine bento grid sizing
  const getGridClass = (item: ShowcaseItem, index: number) => {
    if (item.is_featured) return "md:col-span-2 md:row-span-2 min-h-[400px]";
    
    // Create an asymmetric pattern for standard items
    const pattern = index % 7;
    if (pattern === 1 || pattern === 5) return "md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-full"; // Tall
    if (pattern === 3) return "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-full"; // Wide
    
    return "md:col-span-1 md:row-span-1 min-h-[200px] md:min-h-full"; // Standard square
  };

  return (
    <Section className="py-20 md:py-32 bg-[#0A0A0A] overflow-hidden border-t border-border/30">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          Built. Designed. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Engineered.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          A glimpse into the ideas, prototypes, products, and technologies we bring to life.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(200px,_auto)] md:auto-rows-[220px]">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,106,0,0.15)] hover:-translate-y-1 hover:z-10 ${getGridClass(item, index)}`}
            >
              {/* Media Content */}
              {item.type === "video" ? (
                <video
                  src={item.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title || "Appriqa Showcase"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Overlay Gradient for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Hover Glow Edge */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-colors duration-500 pointer-events-none" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end">
                {item.type === "video" && (
                  <div className="mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white shadow-lg">
                      <Play className="w-3 h-3 ml-0.5 fill-white" />
                    </span>
                  </div>
                )}
                {item.title && (
                  <h3 className="font-heading font-bold text-white text-lg md:text-xl drop-shadow-md">
                    {item.title}
                  </h3>
                )}
                {item.caption && (
                  <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 drop-shadow-md">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
