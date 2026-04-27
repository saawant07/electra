"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, FileCheck } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { useElectraStore } from "@/store/electra-store";
import { ACCEPTED_DOCUMENTS } from "@/data/documents";
import { celebrate } from "@/lib/confetti";
import { cn } from "@/lib/utils";

export default function DocumentsPage() {
  const selectedDocuments = useElectraStore((s) => s.profile.selectedDocuments);
  const updateProfile = useElectraStore((s) => s.updateProfile);
  const completeStep = useElectraStore((s) => s.completeStep);
  const isFirstTime = useElectraStore((s) => s.profile.isFirstTimeVoter);
  const [saved, setSaved] = useState(false);

  const toggleDoc = (id: string) => {
    const next = selectedDocuments.includes(id)
      ? selectedDocuments.filter((d) => d !== id)
      : [...selectedDocuments, id];
    updateProfile({ selectedDocuments: next });
  };

  const handleSave = () => {
    completeStep(2);
    celebrate(0.5, 0.4);
    setSaved(true);
  };

  const count = selectedDocuments.length;
  const recommended = isFirstTime
    ? ["epic", "aadhaar"]
    : ["epic"];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium md:text-3xl">Document Checker</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Tap to select documents you have. You need at least 1.
            </p>
          </div>
          <div className="surface-card px-4 py-2 text-center">
            <p className="text-2xl font-medium tabular-nums">{count}</p>
            <p className="text-xs text-[var(--muted-foreground)]">selected</p>
          </div>
        </div>

        {count >= 1 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-[#057A55]/30 bg-[#057A55]/5 p-4 text-center">
            <p className="font-medium text-[#057A55]">✅ You&apos;re ready to vote!</p>
            <p className="text-sm text-[var(--muted-foreground)]">You have {count} valid document{count > 1 ? "s" : ""}.</p>
          </motion.div>
        )}

        {isFirstTime && (
          <div className="mb-6 rounded-xl border border-[#1A56DB]/20 bg-[#1A56DB]/5 p-4">
            <p className="text-sm"><strong>Recommendation for first-time voters:</strong> Carry your Voter Photo ID Card (EPIC) and Aadhaar Card as backup.</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {ACCEPTED_DOCUMENTS.map((doc, i) => {
            const isSelected = selectedDocuments.includes(doc.id);
            const isRecommended = recommended.includes(doc.id);
            return (
              <motion.button
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => toggleDoc(doc.id)}
                className={cn(
                  "surface-card flex items-start gap-3 p-4 text-left transition",
                  isSelected && "border-[#057A55]/40 bg-[#057A55]/5",
                  isRecommended && !isSelected && "border-[#1A56DB]/20"
                )}
              >
                <div className="mt-0.5">
                  {isSelected
                    ? <CheckCircle2 className="h-5 w-5 text-[#057A55]" />
                    : <Circle className="h-5 w-5 text-[var(--muted-foreground)]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{doc.icon}</span>
                    <span className="font-medium">{doc.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{doc.description}</p>
                  {isRecommended && <span className="mt-1 inline-block rounded-full bg-[#1A56DB]/15 px-2 py-0.5 text-xs text-[#1A56DB]">Recommended</span>}
                </div>
              </motion.button>
            );
          })}
        </div>

        {count >= 1 && !saved && (
          <div className="mt-6 text-center">
            <Button onClick={handleSave} className="h-12 bg-[#057A55] hover:bg-[#057A55]/90">
              <FileCheck className="mr-2 h-4 w-4" /> Save to My Checklist
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
