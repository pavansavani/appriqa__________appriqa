import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { CartProvider } from "@/context/CartContext";
import { WebsiteContentProvider } from "@/components/WebsiteContentProvider";
import { supabase } from "@/lib/supabase";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch published website content globally for SEO and client-side editing
  const { data: content } = await supabase.from("website_content").select("*").eq("status", "published");
  
  const contentMap = content?.reduce((acc: any, item: any) => {
    acc[item.content_key] = item;
    return acc;
  }, {}) || {};

  return (
    <>
      <ParticlesBackground />
      <WebsiteContentProvider initialContent={contentMap}>
        <CartProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </CartProvider>
      </WebsiteContentProvider>
    </>
  );
}
