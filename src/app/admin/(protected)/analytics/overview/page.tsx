"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function AnalyticsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("30");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Build date filter
        const dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - parseInt(filter));
        
        // Load Orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, total, status, created_at, user_id")
          .gte("created_at", dateFilter.toISOString());
          
        const orders = ordersData || [];
        
        // Load Users/Customers
        const { data: usersData } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "customer")
          .gte("created_at", dateFilter.toISOString());
          
        // Load Products count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: 'exact', head: true });

        const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
        
        setStats({
          revenue,
          orders: orders.length,
          products: productsCount || 0,
          customers: usersData?.length || 0
        });

        // Get top 5 recent orders for the list
        const { data: topOrders } = await supabase
          .from("orders")
          .select("id, total, status, created_at, profiles(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(5);
          
        setRecentOrders(topOrders || []);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [filter]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Analytics Overview</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Real-time store performance data</p>
        </div>
        
        <div className="flex bg-[#141414] border border-[#2A2A2A] rounded-lg p-1">
          {[
            { label: "7D", val: "7" },
            { label: "30D", val: "30" },
            { label: "90D", val: "90" },
            { label: "1Y", val: "365" }
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilter(f.val)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === f.val ? 'bg-[#2A2A2A] text-white' : 'text-[#8A8A8A] hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4].map(i => (
            <Card key={i} className="bg-[#141414] border-[#2A2A2A] h-28"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#D4D4D4]">Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-[#20C878]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.revenue.toFixed(2)}</div>
              <p className="text-xs text-[#8A8A8A] mt-1 text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1"/> Data from past {filter} days
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#D4D4D4]">Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-[#FF6B00]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.orders}</div>
              <p className="text-xs text-[#8A8A8A] mt-1 text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1"/> Data from past {filter} days
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#D4D4D4]">New Customers</CardTitle>
              <Users className="w-4 h-4 text-[#3B82F6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.customers}</div>
              <p className="text-xs text-[#8A8A8A] mt-1 text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1"/> Data from past {filter} days
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#141414] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#D4D4D4]">Total Products</CardTitle>
              <Package className="w-4 h-4 text-[#8A8A8A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.products}</div>
              <p className="text-xs text-[#8A8A8A] mt-1">All time</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#141414] border-[#2A2A2A] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-base">Sales Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-72 border-t border-[#2A2A2A] flex items-center justify-center">
             <div className="text-center">
                <BarChart className="w-12 h-12 text-[#2A2A2A] mx-auto mb-3" />
                <p className="text-[#8A8A8A] text-sm">Detailed charts require additional charting libraries.</p>
                <p className="text-[#8A8A8A] text-sm">Raw data successfully aggregated.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#141414] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="border-t border-[#2A2A2A] pt-4 p-0">
             {loading ? (
               <div className="p-4 space-y-4">
                 <div className="h-10 bg-[#1E1E1E] animate-pulse rounded"></div>
                 <div className="h-10 bg-[#1E1E1E] animate-pulse rounded"></div>
               </div>
             ) : recentOrders.length === 0 ? (
               <div className="p-8 text-center text-[#8A8A8A] text-sm">No recent orders found.</div>
             ) : (
               <div className="divide-y divide-[#2A2A2A]">
                 {recentOrders.map(order => (
                   <div key={order.id} className="p-4 hover:bg-[#1A1A1A] transition-colors">
                     <div className="flex justify-between mb-1">
                       <span className="text-white font-medium truncate pr-2">
                         {order.profiles?.full_name || 'Anonymous User'}
                       </span>
                       <span className="text-[#20C878] font-medium">${order.total?.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                       <span className="text-[#8A8A8A] truncate max-w-[150px]">
                         Order #{order.id.slice(0, 8)}
                       </span>
                       <span className="text-[#8A8A8A]">
                         {new Date(order.created_at).toLocaleDateString()}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
