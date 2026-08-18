import { StoreHeroCarousel } from "@store/components/home/StoreHeroCarousel";

export const metadata = {
  title: "Appriqa Store | Premium Tech & DIY Hardware",
  description: "Shop for 3D Printers, Robotics Kits, IoT Sensors, Custom Acrylic Decor, and more at the Appriqa Store.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24">
      <StoreHeroCarousel />
      
      <div className="container mx-auto px-4 md:px-6 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-[#2A2A2A] pb-4">
          Featured Categories
        </h2>
        
        {/* Placeholder for the upcoming category grid section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="h-64 rounded-2xl bg-[#141414] border border-[#2A2A2A] animate-pulse flex items-center justify-center text-foreground/50">Grid Layout Coming Next...</div>
           <div className="h-64 rounded-2xl bg-[#141414] border border-[#2A2A2A] animate-pulse"></div>
           <div className="h-64 rounded-2xl bg-[#141414] border border-[#2A2A2A] animate-pulse"></div>
           <div className="h-64 rounded-2xl bg-[#141414] border border-[#2A2A2A] animate-pulse"></div>
        </div>
      </div>
    </main>
  );
}
