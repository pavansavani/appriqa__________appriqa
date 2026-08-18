"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The Query page has been merged into the Contact & Queries page.
// This component automatically redirects to /contact
export default function QueryRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/contact");
  }, [router]);

  return (
    <div className="pt-32 flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground text-sm">Redirecting to Contact & Queries...</p>
    </div>
  );
}
