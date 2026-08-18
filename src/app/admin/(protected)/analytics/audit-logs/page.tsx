"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Search, Filter, ShieldCheck, Database, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  module: string;
  user_email: string;
  details: any;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
          
        if (error) {
          // If table doesn't exist yet, we'll gracefully handle it
          console.warn("Audit logs table might not exist yet:", error.message);
          setLogs([]);
        } else {
          setLogs(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.module.toLowerCase().includes(search.toLowerCase()) ||
    (log.user_email && log.user_email.toLowerCase().includes(search.toLowerCase()))
  );

  const getModuleIcon = (module: string) => {
    switch(module.toLowerCase()) {
      case 'ecommerce': return <Database className="w-4 h-4" />;
      case 'website': return <FileText className="w-4 h-4" />;
      case 'auth': return <ShieldCheck className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Audit Logs</h1>
        <p className="text-[#8A8A8A] text-sm mt-1">Track admin activity and system changes securely.</p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader className="border-b border-[#2A2A2A] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-white text-base">System Activity</CardTitle>
            <div className="flex relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
              <Input 
                className="pl-9 bg-[#1E1E1E] border-[#2A2A2A] text-white focus:border-[#FF6B00]" 
                placeholder="Search logs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#8A8A8A]">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Activity className="w-12 h-12 text-[#2A2A2A] mb-4" />
              <h3 className="text-white font-medium mb-1">No Audit Logs Found</h3>
              <p className="text-[#8A8A8A] text-sm max-w-sm">
                No system activity has been recorded yet, or the audit_logs tracking table has not been initialized.
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-[#8A8A8A]">No logs match your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#8A8A8A] uppercase bg-[#1A1A1A] border-b border-[#2A2A2A]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Module</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="px-4 py-3 text-[#D4D4D4] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {log.user_email || 'System'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#2A2A2A] text-xs font-medium text-[#D4D4D4]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8A8A8A]">
                        <div className="flex items-center gap-2 capitalize">
                          {getModuleIcon(log.module)}
                          {log.module}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#8A8A8A] max-w-xs truncate" title={JSON.stringify(log.details)}>
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
