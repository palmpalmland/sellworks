"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getStoredActiveBrandId } from "@/lib/brand-session";

type UpgradeButtonProps = {
  planKey?: "pro" | "team";
  label?: string;
};

export default function UpgradeButton({
  planKey = "pro",
  label,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;

      if (!accessToken) {
        alert("Please log in first");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          planKey,
          brandId: getStoredActiveBrandId(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      if (!data.url) {
        alert("No checkout url returned");
        console.log("missing url response:", data);
        return;
      }
      
      window.location.href = data.url;
      
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="cta-primary w-full px-6 py-4 text-sm uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Redirecting..." : label || `Upgrade to ${planKey === "team" ? "Team" : "Pro"}`}
    </button>
  );
}
