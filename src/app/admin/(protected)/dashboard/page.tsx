"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="space-y-6">
        <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard Overview</h1>
        <p className="text-[#8A8A8A] text-sm mt-1">Welcome to the Appriqa Admin Control Center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#D4D4D4]">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-[#20C878]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,231.89</div>
            <p className="text-xs text-[#8A8A8A] mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#D4D4D4]">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-[#FF6B00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+2350</div>
            <p className="text-xs text-[#8A8A8A] mt-1">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#D4D4D4]">Total Products</CardTitle>
            <Package className="w-4 h-4 text-[#D4D4D4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">345</div>
            <p className="text-xs text-[#8A8A8A] mt-1">12 pending review</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#D4D4D4]">Active Customers</CardTitle>
            <Users className="w-4 h-4 text-[#D4D4D4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+573</div>
            <p className="text-xs text-[#8A8A8A] mt-1">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart and Recent Orders placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="bg-[#141414] border-[#2A2A2A] lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-[#2A2A2A]">
            <span className="text-[#8A8A8A]">Chart Area Placeholder</span>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#2A2A2A] lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="border-t border-[#2A2A2A] pt-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center">
                    <span className="text-xs text-white">OM</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-white">Olivia Martin</p>
                    <p className="text-sm text-[#8A8A8A]">olivia.martin@email.com</p>
                  </div>
                  <div className="ml-auto font-medium text-[#20C878]">+$1,999.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
