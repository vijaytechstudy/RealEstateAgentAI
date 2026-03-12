"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

export default function GenerateListingPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        amenities: form.amenities
          ? form.amenities.split(",").map((a) => a.trim())
          : [],
      };
      const res = await api.post("/listings/generate", payload);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              AI Property Listing Generator
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Fill in the property details and let AI craft the perfect listing.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-200">Property title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                  placeholder="Luxury 3BHK with city view"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-200">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                  placeholder="Bandra West, Mumbai"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                placeholder="₹3.2 Cr"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-slate-200">Bedrooms</label>
                <input
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  type="number"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-200">Bathrooms</label>
                <input
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  type="number"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-200">Amenities</label>
                <input
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                  placeholder="Pool, Gym, Parking"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Property description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                placeholder="Describe the property, building, neighbourhood, etc."
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate listing"}
            </button>
          </form>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-slate-100">Generated listing</h2>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                AI output
              </span>
            </div>
            {!result && (
              <p className="text-xs text-slate-500">
                Fill the form and generate to see the AI-crafted listing here.
              </p>
            )}
            {result && (
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Headline
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-50">
                    {result.generated?.headline}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Description
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {result.generated?.description}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Highlights
                  </div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-200">
                    {result.generated?.highlights?.map((h: string, i: number) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Marketing copy
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {result.generated?.marketingCopy}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

