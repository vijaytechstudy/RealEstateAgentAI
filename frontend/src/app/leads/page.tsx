"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";
import { ContentLanguage, LANGUAGE_OPTIONS, languageLabel } from "@/lib/languages";

type LeadStatus = "New" | "Contacted" | "Visit scheduled" | "Closed";

interface Lead {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  propertyInterestedIn?: string;
  status: LeadStatus;
  preferredLanguage?: ContentLanguage;
}

const STATUSES: LeadStatus[] = ["New", "Contacted", "Visit scheduled", "Closed"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingLeadId, setSendingLeadId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterestedIn: "",
    status: "New" as LeadStatus,
    preferredLanguage: "english" as ContentLanguage,
  });

  const fetchLeads = async () => {
    try {
      const res = await api.get<Lead[]>("/leads");
      setLeads(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", form);
      setForm({
        name: "",
        email: "",
        phone: "",
        propertyInterestedIn: "",
        status: "New",
        preferredLanguage: "english",
      });
      fetchLeads();
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (leadId: string, status: LeadStatus) => {
    await api.put(`/leads/${leadId}`, { status });
    fetchLeads();
  };

  const sendWhatsApp = async (lead: Lead) => {
    if (!lead.phone) {
      alert("This lead has no phone number.");
      return;
    }

    setSendingLeadId(lead._id);
    try {
      await api.post("/whatsapp/send", {
        leadId: lead._id,
      });

      alert("WhatsApp message sent (Cloud API).");
    } catch (err: any) {
      alert(
        err.response?.data?.details?.error?.message ||
          err.response?.data?.message ||
          "Failed to send WhatsApp message"
      );
    } finally {
      setSendingLeadId(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Leads CRM
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Track buyers, property visits and deal status.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleCreate}
            className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm"
          >
            <div className="space-y-1">
              <label className="text-slate-200">Lead name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-200">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-200">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Property</label>
              <input
                value={form.propertyInterestedIn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, propertyInterestedIn: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Preferred language</label>
              <select
                value={form.preferredLanguage}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    preferredLanguage: e.target.value as ContentLanguage,
                  }))
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add lead"}
            </button>
          </form>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm">
            <div className="mb-1 text-xs font-medium text-slate-200">
              Your leads
            </div>
            {leads.length === 0 && (
              <p className="text-xs text-slate-500">
                No leads yet. Add your first buyer inquiry on the left.
              </p>
            )}
            <div className="space-y-2">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-50">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {lead.propertyInterestedIn || "No property specified"}
                      </div>
                    </div>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateStatus(lead._id, e.target.value as LeadStatus)
                      }
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                    {lead.email && <span>{lead.email} · </span>}
                    {lead.phone && <span>{lead.phone}</span>}
                    <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {languageLabel(lead.preferredLanguage)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => sendWhatsApp(lead)}
                      disabled={sendingLeadId !== null}
                      className="rounded-md border border-slate-700 bg-slate-900/50 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-900 disabled:opacity-60"
                    >
                      {sendingLeadId === lead._id ? "Sending..." : "Send via WhatsApp"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

