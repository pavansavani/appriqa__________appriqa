"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, CreditCard } from "lucide-react";

interface Payment {
  id: string;
  order_id: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  payment_gateway: string;
  transaction_id: string;
  payment_status: string;
  refund_status: string | null;
  payment_date: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id: string, field: string, value: string) => {
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) throw new Error("Failed to update payment");
      fetchPayments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Monitor transactions and refunds.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search by Customer, Order ID or Txn ID..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Transaction Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Refund Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#8A8A8A]">Loading payments...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <CreditCard className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No payments found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {payment.payment_method || 'Unknown'} - {payment.payment_gateway || 'Manual'}
                      </div>
                      <div className="text-xs text-[#8A8A8A] mt-1">Txn: {payment.transaction_id || 'N/A'}</div>
                      <div className="text-xs text-[#8A8A8A] mt-0.5" title={payment.order_id}>Order: {payment.order_id?.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white">₹{payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#D4D4D4]">{payment.customer_name || 'Guest'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={payment.payment_status}
                        onChange={(e) => handleUpdateStatus(payment.id, 'payment_status', e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          payment.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          payment.payment_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="pending">Pending</option>
                        <option className="bg-[#141414] text-white" value="paid">Paid</option>
                        <option className="bg-[#141414] text-white" value="failed">Failed</option>
                        <option className="bg-[#141414] text-white" value="refunded">Refunded</option>
                        <option className="bg-[#141414] text-white" value="partially_refunded">Partially Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={payment.refund_status || ''}
                        onChange={(e) => handleUpdateStatus(payment.id, 'refund_status', e.target.value || null as any)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          payment.refund_status ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="">No Refund</option>
                        <option className="bg-[#141414] text-white" value="requested">Requested</option>
                        <option className="bg-[#141414] text-white" value="processing">Processing</option>
                        <option className="bg-[#141414] text-white" value="completed">Completed</option>
                        <option className="bg-[#141414] text-white" value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {new Date(payment.payment_date).toLocaleString()}
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
