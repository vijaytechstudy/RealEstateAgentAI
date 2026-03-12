"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

type PlanKey = "starter" | "professional" | "agency";

const plans: { id: PlanKey; name: string; price: string; features: string[] }[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹499 / month",
    features: ["Up to 20 listing generations / month", "Basic CRM", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹999 / month",
    features: [
      "Up to 100 listing generations / month",
      "Advanced CRM filters",
      "Priority support",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "₹2999 / month",
    features: [
      "Unlimited listing generations",
      "Multi-agent seats",
      "Dedicated success manager",
    ],
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [meEmail, setMeEmail] = useState<string>("");
  const [meName, setMeName] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const [billingRes, meRes] = await Promise.all([
          api.get("/billing/me"),
          api.get("/auth/me"),
        ]);
        setCurrentPlan(billingRes.data.plan || "free");
        setMeEmail(meRes.data.email || "");
        setMeName(meRes.data.name || "");
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async (plan: PlanKey) => {
    setActionError(null);
    setLoadingPlan(plan);
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        throw new Error("Failed to load Razorpay Checkout");
      }

      const res = await api.post("/billing/create-subscription", { plan });
      const { subscriptionId, razorpayKeyId } = res.data;

      const options: any = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "RealEstate Agent AI",
        description: `Subscription: ${plan}`,
        prefill: {
          name: meName || undefined,
          email: meEmail || undefined,
        },
        theme: { color: "#38bdf8" },
        handler: async (response: any) => {
          try {
            await api.post("/billing/verify", response);
            const billingRes = await api.get("/billing/me");
            setCurrentPlan(billingRes.data.plan || "free");
          } catch (err: any) {
            setActionError(
              err.response?.data?.message || "Payment succeeded but verification failed"
            );
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setActionError(resp?.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (err: any) {
      setActionError(
        err.response?.data?.details ||
          err.response?.data?.message ||
          err.message ||
          "Billing request failed. Check backend .env Razorpay settings."
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Billing & plans
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Free plan includes 3 listing generations per month. Upgrade as you grow.
          </p>
        </div>

        {actionError && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs text-red-200">
            {actionError}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Free
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-50">
              ₹0 / month
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>3 listing generations / month</li>
              <li>Basic CRM</li>
            </ul>
            <div className="mt-3 text-[11px] text-slate-500">
              Current plan:{" "}
              <span className="font-medium text-sky-300">
                {currentPlan === "free" ? "Free" : currentPlan}
              </span>
            </div>
          </div>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {plan.name}
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-50">
                {plan.price}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan !== null}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400"
              >
                {loadingPlan === plan.id ? "Creating..." : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

