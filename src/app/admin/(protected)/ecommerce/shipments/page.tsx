"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Truck } from "lucide-react";

interface Shipment {
  id: string;
  order_id: string;
  customer_name: string;
  shipping_address: string;
  shipping_provider: string;
  tracking_number: string;
  shipment_status: string;
  expected_delivery: string | null;
  delivery_date: string | null;
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/shipments");
      if (!res.ok) throw new Error("Failed to fetch shipments");
      const data = await res.json();
      setShipments(data.shipments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: string) => {
    try {
      const payload: any = { [field]: value };
      if (field === 'shipment_status' && value === 'delivered') {
        payload.delivery_date = new Date().toISOString();
      }
      
      const res = await fetch(`/api/admin/shipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Failed to update ${field}`);
      fetchShipments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shipments</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage physical product deliveries.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search by Customer, Order ID or Tracking..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF6B00] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E1E1E]/50 border-b border-[#2A2A2A]">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Order & Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Shipping Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading shipments...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <Truck className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No shipments found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{shipment.customer_name}</div>
                      <div className="text-xs text-[#8A8A8A] mt-1" title={shipment.order_id}>Order: {shipment.order_id?.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#D4D4D4] line-clamp-2" title={shipment.shipping_address}>
                        {shipment.shipping_address || 'No address provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Provider (e.g. FedEx)"
                        className="bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-white px-2 py-1 rounded w-28 outline-none mb-1 block focus:border-[#FF6B00]"
                        value={shipment.shipping_provider || ''}
                        onChange={(e) => handleUpdateField(shipment.id, 'shipping_provider', e.target.value)}
                        onBlur={(e) => handleUpdateField(shipment.id, 'shipping_provider', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Tracking Number"
                        className="bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-white px-2 py-1 rounded w-32 outline-none block focus:border-[#FF6B00]"
                        value={shipment.tracking_number || ''}
                        onChange={(e) => handleUpdateField(shipment.id, 'tracking_number', e.target.value)}
                        onBlur={(e) => handleUpdateField(shipment.id, 'tracking_number', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={shipment.shipment_status}
                        onChange={(e) => handleUpdateField(shipment.id, 'shipment_status', e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          shipment.shipment_status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          ['pending', 'processing'].includes(shipment.shipment_status) ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          ['shipped', 'in_transit', 'out_for_delivery'].includes(shipment.shipment_status) ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="pending">Pending</option>
                        <option className="bg-[#141414] text-white" value="processing">Processing</option>
                        <option className="bg-[#141414] text-white" value="shipped">Shipped</option>
                        <option className="bg-[#141414] text-white" value="in_transit">In Transit</option>
                        <option className="bg-[#141414] text-white" value="out_for_delivery">Out for Delivery</option>
                        <option className="bg-[#141414] text-white" value="delivered">Delivered</option>
                        <option className="bg-[#141414] text-white" value="cancelled">Cancelled</option>
                        <option className="bg-[#141414] text-white" value="returned">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-[#8A8A8A]">
                        <span className="font-semibold">Expected:</span><br/>
                        <input
                          type="date"
                          className="bg-transparent border-b border-[#2A2A2A] text-white outline-none mt-1 mb-2 w-full text-xs"
                          value={shipment.expected_delivery ? shipment.expected_delivery.split('T')[0] : ''}
                          onChange={(e) => handleUpdateField(shipment.id, 'expected_delivery', e.target.value ? new Date(e.target.value).toISOString() : null as any)}
                        />
                      </div>
                      <div className="text-xs text-[#8A8A8A]">
                        <span className="font-semibold">Delivered:</span><br/>
                        {shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
