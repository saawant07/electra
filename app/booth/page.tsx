"use client";

import { useState } from "react";
import { MapPin, ExternalLink, CheckCircle2 } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useElectraStore } from "@/store/electra-store";
import { VOTER_PORTAL, VOTER_HELPLINE } from "@/data/elections";
import { celebrate } from "@/lib/confetti";

export default function BoothPage() {
  const boothDetails = useElectraStore((s) => s.profile.boothDetails);
  const state = useElectraStore((s) => s.profile.state);
  const updateProfile = useElectraStore((s) => s.updateProfile);
  const completeStep = useElectraStore((s) => s.completeStep);
  const [number, setNumber] = useState(boothDetails?.number ?? "");
  const [address, setAddress] = useState(boothDetails?.address ?? "");

  const handleSave = () => {
    updateProfile({ boothDetails: { number, address } });
    completeStep(3);
    celebrate(0.5, 0.4);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        <h1 className="mb-2 text-2xl font-medium md:text-3xl">Find Your Polling Booth</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">
          You must vote at your assigned booth. Look it up on the ECI portal.
        </p>

        <div className="surface-card mb-6 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-[#1A56DB]" />
            <h2 className="text-lg font-medium">Step 1: Look up your booth</h2>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Visit the official ECI Voter Portal or call the helpline to find your assigned booth.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={VOTER_PORTAL} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" /> ECI Voter Portal
              </Button>
            </a>
            <a href={`tel:${VOTER_HELPLINE}`}>
              <Button variant="secondary">📞 Call {VOTER_HELPLINE}</Button>
            </a>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-lg font-medium mb-4">Step 2: Save booth details</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            State: <strong>{state}</strong> — Save your booth details here for quick reference on polling day.
          </p>
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Booth number</span>
              <Input placeholder="e.g. 145" value={number} onChange={(e) => setNumber(e.target.value)} id="booth-number" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Booth address</span>
              <Input placeholder="e.g. Govt. Primary School, Ward 12" value={address} onChange={(e) => setAddress(e.target.value)} id="booth-address" />
            </label>
            <Button onClick={handleSave} disabled={!number.trim()} className="h-12 bg-[#057A55] hover:bg-[#057A55]/90">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Save & Mark Step Done
            </Button>
          </div>
        </div>

        {boothDetails && (
          <div className="mt-6 surface-card border-[#057A55]/30 p-4">
            <p className="text-sm font-medium text-[#057A55]">✅ Booth saved</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Booth #{boothDetails.number} · {boothDetails.address}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
