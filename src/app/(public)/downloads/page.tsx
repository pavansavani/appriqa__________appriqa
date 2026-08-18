"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ShieldCheck, ArrowRight, FileType, CheckCircle, RefreshCw, Key } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

interface DigitalProduct {
  id: string;
  name: string;
  category: string;
  fileFormat: string;
  fileSize: string;
  license: string;
  compatibility: string;
  version: string;
  status: "active" | "expired";
  downloadLimit: number;
  downloadCount: number;
}

export default function DownloadsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Mock list of purchased digital products
  const [purchasedProducts, setPurchasedProducts] = useState<DigitalProduct[]>([
    {
      id: "p3",
      name: "Modular Quadcopter Frame STL Pack",
      category: "3D Printed Designs",
      fileFormat: "STL / 3MF / STEP",
      fileSize: "18.4 MB",
      license: "CC BY-NC-SA 4.0 (Non-Commercial)",
      compatibility: "FDM & SLA 3D Printers",
      version: "v1.2.0",
      status: "active",
      downloadLimit: 10,
      downloadCount: 2
    },
    {
      id: "p4",
      name: "Mechanical Digital Sundial 3D Model",
      category: "3D Printed Designs",
      fileFormat: "STL / 3MF",
      fileSize: "12.1 MB",
      license: "Personal Use Only",
      compatibility: "High-precision FDM Printers (0.4mm nozzle)",
      version: "v1.0.4",
      status: "active",
      downloadLimit: 5,
      downloadCount: 1
    }
  ]);

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setDownloadSuccess(null);

    // Simulate secure token generation and download
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccess(id);
      
      // Update download count
      setPurchasedProducts(prev => 
        prev.map(p => 
          p.id === id 
            ? { ...p, downloadCount: Math.min(p.downloadLimit, p.downloadCount + 1) } 
            : p
        )
      );

      // Create a dummy download trigger in browser
      const element = document.createElement("a");
      const file = new Blob(["mock 3d model file content"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${name.toLowerCase().replace(/\s+/g, '-')}-model-files.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1800);
  };

  return (
    <div className="pt-20">
      <Section className="pb-8">
        <SectionHeader 
          title="Digital Downloads Dashboard" 
          subtitle="Access your purchased 3D printing blueprints, CAD files, and digital resources. Download links utilize secure temporary signed tokens."
        />
      </Section>

      <Section className="pt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {purchasedProducts.map(prod => (
            <div 
              key={prod.id} 
              className="bg-card border border-border/80 hover:border-primary/30 rounded-2xl p-6 shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
            >
              {/* Top gradient blur */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              {/* Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-wider mb-2">
                    Digital Download
                  </span>
                  <h3 className="text-xl font-heading font-bold text-foreground">{prod.name}</h3>
                  <span className="text-xs text-muted-foreground">Version: {prod.version} &bull; Category: {prod.category}</span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-border/40">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Format</span>
                    <span className="block font-bold mt-0.5 text-foreground">{prod.fileFormat}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">File Size</span>
                    <span className="block font-bold mt-0.5 text-foreground">{prod.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Downloads</span>
                    <span className="block font-bold mt-0.5 text-foreground">{prod.downloadCount} / {prod.downloadLimit} limit</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">License</span>
                    <span className="block font-bold mt-0.5 text-foreground truncate max-w-[120px]" title={prod.license}>{prod.license}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 justify-end items-stretch md:items-end">
                <Button
                  onClick={() => handleDownload(prod.id, prod.name)}
                  disabled={downloadingId !== null || prod.downloadCount >= prod.downloadLimit}
                  className="px-6 h-12 text-xs font-bold gap-2"
                >
                  {downloadingId === prod.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                      <span>Securing Connection...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Archive</span>
                    </>
                  )}
                </Button>

                {/* Status indicator */}
                <div className="text-[10px] text-center md:text-right text-muted-foreground">
                  {downloadSuccess === prod.id && (
                    <span className="text-emerald-500 font-bold flex items-center justify-center md:justify-end gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Secure link verified!
                    </span>
                  )}
                  <span className="flex items-center justify-center md:justify-end gap-1.5 font-medium">
                    <Key className="w-3 h-3 text-primary" />
                    <span>Temporary Token Active</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Secure Info Alert */}
          <div className="flex gap-4 p-5 border border-border/80 bg-secondary/15 rounded-2xl mt-8">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-foreground block">Appriqa Digital Rights Protection (DRM)</strong>
              <p className="text-muted-foreground leading-relaxed">
                Blueprints and designs are subject to personal, non-commercial licenses. Re-distribution or public hosting of design files is strictly prohibited under our terms of service. For developer or commercial manufacturing licenses, please contact our solutions desk.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1 text-primary font-bold hover:underline mt-2">
                Inquire Commercial License <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
