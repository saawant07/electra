"use client";

import { startTransition, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATE_OPTIONS } from "@/data/timelines";
import type { AgeGroup, Profile, SupportedLanguage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AGE_GROUPS: AgeGroup[] = ["18-19", "20-24", "25-34", "35+"];
const LANGUAGES: Array<{ id: SupportedLanguage; label: string }> = [
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
  { id: "bn", label: "Bengali" },
  { id: "ta", label: "Tamil" },
];

export function OnboardingDialog({
  open,
  initialProfile,
  onComplete,
}: {
  open: boolean;
  initialProfile: Profile;
  onComplete: (profile: Profile) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<Profile>(initialProfile);

  const setField = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((state) => ({ ...state, [key]: value }));
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <Badge className="w-fit" variant="default">
            Smart Onboarding
          </Badge>
          <DialogTitle>{t("onboardingTitle")}</DialogTitle>
          <DialogDescription>
            Electra uses this to unlock the right missions, surface the right booth support, and select your voice coach.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Name</span>
            <Input
              placeholder="A first-time voter"
              value={draft.name}
              onChange={(event) => setField("name", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">State going to polls</span>
            <select
              className="h-11 rounded-xl border bg-transparent px-3 text-sm"
              value={draft.state}
              onChange={(event) => setField("state", event.target.value as Profile["state"])}
            >
              {STATE_OPTIONS.map((state) => (
                <option className="text-slate-950" key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-2 text-sm">
          <span className="font-medium">Age group</span>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {AGE_GROUPS.map((ageGroup) => (
              <Button
                key={ageGroup}
                type="button"
                variant={draft.ageGroup === ageGroup ? "default" : "secondary"}
                onClick={() => setField("ageGroup", ageGroup)}
              >
                {ageGroup}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <span className="font-medium">First-time voter?</span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={draft.isFirstTimeVoter ? "default" : "secondary"}
              onClick={() => setField("isFirstTimeVoter", true)}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!draft.isFirstTimeVoter ? "default" : "secondary"}
              onClick={() => setField("isFirstTimeVoter", false)}
            >
              No
            </Button>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <span className="font-medium">Do you have a disability?</span>
          <div className="grid gap-2 md:grid-cols-3">
            <Button
              type="button"
              variant={draft.hasPwD === true ? "default" : "secondary"}
              onClick={() => setField("hasPwD", true)}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={draft.hasPwD === false ? "default" : "secondary"}
              onClick={() => setField("hasPwD", false)}
            >
              No
            </Button>
            <Button
              type="button"
              variant={draft.hasPwD === null ? "default" : "secondary"}
              onClick={() => setField("hasPwD", null)}
            >
              Prefer not to say
            </Button>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <span className="font-medium">NRI voter?</span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={draft.isNri ? "default" : "secondary"}
              onClick={() => setField("isNri", true)}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!draft.isNri ? "default" : "secondary"}
              onClick={() => setField("isNri", false)}
            >
              No
            </Button>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <span className="font-medium">{t("language")}</span>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {LANGUAGES.map((language) => (
              <Button
                key={language.id}
                type="button"
                variant={draft.language === language.id ? "default" : "secondary"}
                onClick={() => setField("language", language.id)}
              >
                {language.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mission 8 unlocks your Election Passport after the rest of your readiness work is done.
          </p>
          <Button
            className="md:min-w-48"
            disabled={!draft.name.trim()}
            onClick={() =>
              startTransition(() => {
                onComplete(draft);
              })
            }
          >
            Enter Mission Control
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
