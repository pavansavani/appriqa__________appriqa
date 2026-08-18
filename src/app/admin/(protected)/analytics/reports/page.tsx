"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileOutput, Download, Calendar, Filter, FileText } from "lucide-react";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (type: string) => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Successfully generated ${type} report! CSV download will begin shortly.`);
    }, 1500);
  };

  const reports = [
    { id: "orders", name: "Orders Report", desc: "Detailed history of all orders, statuses, and customer information.", icon: FileText },
    { id: "sales", name: "Sales & Revenue", desc: "Revenue breakdown by day, week, or month including taxes and shipping.", icon: FileOutput },
    { id: "products", name: "Product Performance", desc: "Views, sales, and conversion rates for all published products.", icon: FileText },
    { id: "inventory", name: "Inventory Status", desc: "Current stock levels, low stock alerts, and recent adjustments.", icon: FileText },
    { id: "customers", name: "Customer Analytics", desc: "Customer acquisition, lifetime value, and order frequency.", icon: FileText },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Reports</h1>
        <p className="text-[#8A8A8A] text-sm mt-1">Generate and export detailed data reports.</p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader className="border-b border-[#2A2A2A] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-white">Export Data</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-[#1E1E1E] border-[#2A2A2A] text-white hover:bg-[#2A2A2A]">
                <Calendar className="w-4 h-4 mr-2 text-[#8A8A8A]" />
                Last 30 Days
              </Button>
              <Button variant="outline" className="bg-[#1E1E1E] border-[#2A2A2A] text-white hover:bg-[#2A2A2A]">
                <Filter className="w-4 h-4 mr-2 text-[#8A8A8A]" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#2A2A2A]">
            {reports.map((report) => (
              <div key={report.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1A1A1A] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
                    <report.icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{report.name}</h3>
                    <p className="text-[#8A8A8A] text-sm mt-1">{report.desc}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerate(report.name)}
                  disabled={isGenerating}
                  className="bg-[#2A2A2A] hover:bg-[#333] text-white self-start sm:self-center shrink-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate CSV
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
