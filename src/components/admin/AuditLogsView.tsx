import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AuditLog } from '../../types/database';
import { formatDateTime } from '../../lib/utils';
import { ShieldCheck, Database, Key, CheckCircle2, AlertCircle, RefreshCw, Terminal, ExternalLink } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const loadLogs = async () => {
    const list = await db.getAuditLogs();
    setLogs(list);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const sampleEnv = `# VMOVE LOGISTICS - SUPABASE PRODUCTION CREDENTIALS
# Add these variables to your .env or hosting environment:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Audit Logs &amp; Database Architecture</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable change history, security event monitoring, and Supabase deployment status.
        </p>
      </div>

      {/* Supabase Status Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-brand-orange'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-brand-navy">
                Supabase Backend Engine:
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-brand-orange'
              }`}>
                {isSupabaseConfigured ? 'Connected & Active' : 'Operating in Local Storage Mock Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSupabaseConfigured
                ? 'All queries are interacting with live Supabase PostgreSQL tables.'
                : 'Interactive out-of-the-box local storage engine active. Ready for instant live Supabase link via .env.'}
            </p>
          </div>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Environment Config Quick Guide */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-xl shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Key className="w-4 h-4" />
            <span>Environment Variable Configuration (.env)</span>
          </div>
          <button
            onClick={copyEnvToClipboard}
            className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/15"
          >
            {copiedEnv ? 'Copied!' : 'Copy Template'}
          </button>
        </div>

        <pre className="p-3 bg-black/40 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
          {sampleEnv}
        </pre>

        <p className="text-[11px] text-slate-400">
          The complete PostgreSQL migration script is available in{' '}
          <code className="text-slate-200">supabase/migrations/20261030000000_vmove_schema.sql</code> with full Row Level Security (RLS) policies.
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            Operational Audit Trail ({logs.length} events logged)
          </h3>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Triggered By</th>
                <th className="py-3 px-4">Change Payload / Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No audit records registered yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>

                    <td className="py-3 px-4 font-bold text-brand-navy uppercase text-[10px]">
                      {log.entity_type}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {log.changed_by || 'System'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {log.changes ? JSON.stringify(log.changes) : '—'}
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
};
