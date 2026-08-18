"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!url) return;
    
    setIsImporting(true);
    setResults(null);
    
    try {
      // Basic validation for Google Sheets URL
      let sheetId = "";
      if (url.includes("/d/")) {
        sheetId = url.split("/d/")[1].split("/")[0];
      } else {
        throw new Error("Invalid Google Sheets URL");
      }

      // Convert to CSV export URL
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Google Sheet. Ensure it is published to the web or anyone with the link can view.");
      }
      
      const csvText = await response.text();
      
      // Parse CSV (basic implementation)
      const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      
      if (rows.length < 2) {
        throw new Error("Sheet is empty or has no data rows");
      }
      
      const headers = rows[0].map(h => h.toLowerCase());
      
      let successCount = 0;
      let failedCount = 0;
      let errors = [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i].length < 2 || !rows[i][0]) continue; // Skip empty rows
        
        try {
          const rowData = rows[i];
          const productObj: any = {
            name: "",
            price: 0,
            sale_price: 0,
            description: "",
            category: "",
            sku: "",
            stock: 0,
            status: "draft"
          };
          
          headers.forEach((header, index) => {
            const val = rowData[index];
            if (header.includes("name") || header.includes("title")) productObj.name = val;
            if (header.includes("price") && !header.includes("sale")) productObj.price = parseFloat(val) || 0;
            if (header.includes("sale")) productObj.sale_price = parseFloat(val) || null;
            if (header.includes("desc")) productObj.description = val;
            if (header.includes("cat")) productObj.category = val;
            if (header.includes("sku")) productObj.sku = val;
            if (header.includes("stock") || header.includes("qty")) productObj.stock = parseInt(val) || 0;
            if (header.includes("status")) productObj.status = val.toLowerCase() === 'active' ? 'active' : 'draft';
          });
          
          if (!productObj.name || !productObj.price) {
            failedCount++;
            errors.push(`Row ${i + 1}: Missing required fields (Name or Price)`);
            continue;
          }

          const { error } = await supabase
            .from('products')
            .upsert({
              name: productObj.name,
              price: productObj.price,
              sale_price: productObj.sale_price,
              description: productObj.description,
              category: productObj.category,
              sku: productObj.sku || `SKU-${Date.now()}-${i}`,
              stock: productObj.stock,
              status: productObj.status,
              updated_at: new Date().toISOString()
            }, { onConflict: 'sku' });

          if (error) {
            failedCount++;
            errors.push(`Row ${i + 1}: ${error.message}`);
          } else {
            successCount++;
          }
          
        } catch (err: any) {
          failedCount++;
          errors.push(`Row ${i + 1}: ${err.message}`);
        }
      }
      
      setResults({ success: successCount, failed: failedCount, errors });
      
    } catch (error: any) {
      setResults({ success: 0, failed: 1, errors: [error.message] });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Google Sheets Import</h1>
        <p className="text-[#8A8A8A] text-sm mt-1">Bulk import products directly from a Google Sheet.</p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-[#20C878]" />
            Connect Google Sheet
          </CardTitle>
          <CardDescription className="text-[#8A8A8A]">
            Make sure your Google Sheet is shared as "Anyone with the link can view". The first row must contain headers (e.g. Name, Price, SKU, Stock).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#D4D4D4]">Google Sheet URL</label>
            <Input 
              placeholder="https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit" 
              className="bg-[#1E1E1E] border-[#333] text-white"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-[#2A2A2A] pt-4">
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
            onClick={handleImport}
            disabled={!url || isImporting}
          >
            {isImporting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isImporting ? "Importing..." : "Import Products"}
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#141414] border-[#20C878]/30">
              <CardContent className="p-4 flex items-center">
                <CheckCircle2 className="w-8 h-8 text-[#20C878] mr-4" />
                <div>
                  <p className="text-sm text-[#8A8A8A]">Successfully Imported</p>
                  <p className="text-2xl font-bold text-white">{results.success} Products</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#141414] border-[#FF3B3B]/30">
              <CardContent className="p-4 flex items-center">
                <AlertCircle className="w-8 h-8 text-[#FF3B3B] mr-4" />
                <div>
                  <p className="text-sm text-[#8A8A8A]">Failed Imports</p>
                  <p className="text-2xl font-bold text-white">{results.failed} Rows</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {results.errors.length > 0 && (
            <Card className="bg-[#141414] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-[#FF3B3B]" />
                  Import Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#D4D4D4]">
                  {results.errors.map((error, index) => (
                    <li key={index} className="text-[#FF3B3B]">{error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
