import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="relative mb-8">
        <div className="text-[150px] font-heading font-black text-white/5 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">System Not Found</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The requested resource has been moved, deleted, or never existed in our infrastructure.
      </p>
      <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/">Return to Main System</Link>
      </Button>
    </div>
  );
}
