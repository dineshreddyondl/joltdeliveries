"use client";

/**
 * PilotFlow — 3-step pilot request dialog · Brief 03 (Goal 2 wiring)
 *
 * Step 1 (4 fields, uplift §4.2): name, email, phone, company.
 * Step 2: origin → destination lane + monthly volume + payload class
 *         + optional preferred call time (research 04:§Step 2).
 * Step 3: success — reference ID from POST /api/pilot + the 2-business-
 *         hour callback promise + WhatsApp alternative (pre-filled).
 *
 * Copy follows research 04:§Pilot verbatim where cited; trust rows and
 * the WhatsApp template come from the same section. Provider config is
 * server-side only — this client posts to /api/pilot and renders the
 * response verbatim (no fabricated states or IDs).
 *
 * A11y: Radix dialog semantics, aria-live announcer, first-field
 * autofocus per step, per-field errors via aria-describedby, reduced-
 * motion-gated transitions.
 */

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WHATSAPP_NUMBER } from "@/components/serviceability/serviceability-checker";
import { cn } from "@/lib/utils";

/* ---------------------------- copy + config ---------------------------- */

const waUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const VOLUME_OPTIONS = ["1–4", "5–15", "16–50", "50+"] as const;
const PAYLOAD_OPTIONS = [
  "Furniture",
  "Appliances",
  "Auto parts",
  "Other",
] as const;
const CALL_TIME_OPTIONS = [
  "Morning 9–12",
  "Afternoon 12–4",
  "Evening 4–7",
] as const;

const step1Schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(10, "10-digit mobile number").max(15),
  company: z.string().trim().min(2, "Company is required"),
});

const step2Schema = z.object({
  origin: z.string().trim().min(2, "Pickup city or pincode required"),
  destination: z.string().trim().min(2, "Delivery city or pincode required"),
  monthlyVolume: z.enum(VOLUME_OPTIONS),
  payloadClass: z.enum(PAYLOAD_OPTIONS),
  callTime: z.enum(CALL_TIME_OPTIONS).optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

/* ------------------------------- ui bits ------------------------------- */

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-[15px] shrink-0", className)}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const PRIMARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#E85A2C] px-4 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[#08080A] transition-colors duration-200 hover:bg-white";
const SECONDARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.22)] px-4 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#E8E8EA] transition-colors duration-200 hover:border-white hover:bg-[rgba(255,255,255,0.04)]";
const MUTED_LINK =
  "font-mono text-[12px] text-[#8B8B90] underline-offset-4 transition-colors duration-200 hover:text-[#E8E8EA]";

const labelClass =
  "mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#8B8B90]";
const errorClass = "mt-[6px] font-mono text-[11px] text-[#E85A2C]";
const fieldClass = (invalid: boolean) =>
  cn(
    "w-full rounded-[10px] border bg-[rgba(255,255,255,0.05)] px-4 py-[13px] text-[16px] text-white outline-none transition-colors duration-200 placeholder:text-[#8B8B90]",
    invalid
      ? "border-[rgba(232,90,44,0.6)] focus:border-[#E85A2C]"
      : "border-[rgba(255,255,255,0.16)] focus:border-[#E85A2C]",
  );

/* ---------------------------- the component ---------------------------- */

type Phase = "step1" | "step2" | "loading" | "success" | "error";

export function PilotFlow({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("step1");
  const [reference, setReference] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const reduceMotion = useReducedMotion();

  const step1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });
  const step2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      origin: "",
      destination: "",
      monthlyVolume: undefined,
      payloadClass: undefined,
      callTime: undefined,
    },
  });

  const submittedRef = React.useRef<{ s1: Step1Values; s2: Step2Values } | null>(
    null,
  );
  const step1Ref = React.useRef<HTMLInputElement>(null);
  const step2Ref = React.useRef<HTMLInputElement>(null);

  const resetFlow = React.useCallback(() => {
    setPhase("step1");
    setReference(null);
    setAnnouncement("");
    submittedRef.current = null;
    step1.reset();
    step2.reset();
  }, [step1, step2]);

  /* External open hook: lets other conversion surfaces (serviceability
     checker's "request pilot pricing") open this dialog via the
     `jolt:open-pilot` window event. */
  React.useEffect(() => {
    const onOpen = () => {
      resetFlow();
      setOpen(true);
    };
    window.addEventListener("jolt:open-pilot", onOpen);
    return () => window.removeEventListener("jolt:open-pilot", onOpen);
  }, [resetFlow]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) resetFlow();
  };

  async function submitPilot(s1: Step1Values, s2: Step2Values) {
    submittedRef.current = { s1, s2 };
    setPhase("loading");
    setAnnouncement("Submitting your pilot request…");
    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s1.name,
          email: s1.email,
          phone: s1.phone,
          company: s1.company,
          origin: s2.origin,
          destination: s2.destination,
          monthlyVolume: s2.monthlyVolume,
          payloadClass: s2.payloadClass,
          callTime: s2.callTime,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: unknown = await res.json();
      if (!body || typeof body !== "object") throw new Error("Invalid payload");
      const payload = body as { ok?: boolean; reference?: string };
      if (payload.ok !== true || !payload.reference) throw new Error("API error");
      setReference(payload.reference);
      setPhase("success");
      setAnnouncement("Pilot request received. Expect a call within 2 business hours.");
    } catch {
      setPhase("error");
      setAnnouncement("Network hiccup. Try again or WhatsApp us.");
    }
  }

  const retry = () => {
    const s = submittedRef.current;
    if (!s) return;
    void submitPilot(s.s1, s.s2);
  };

  const submitted = submittedRef.current;
  const lane = submitted
    ? `${submitted.s2.origin} → ${submitted.s2.destination}`
    : "";
  const successWaMessage = `Hi, I just submitted a pilot request for ${lane}, ${submitted?.s2.monthlyVolume ?? ""} volume — reference ${reference ?? ""}`;
  const step1WaMessage =
    "Hi JOLT! I want to start a pilot — I'll share my lane details here.";
  const errorWaMessage =
    "Hi JOLT! My pilot request failed to submit — can you set it up for me?";

  /* ------------------------------- views ------------------------------- */

  const { ref: nameRegisterRef, ...nameRest } = step1.register("name");
  const { ref: originRegisterRef, ...originRest } = step2.register("origin");

  const step1View = (
    <form
      noValidate
      onSubmit={step1.handleSubmit(() => {
        setPhase("step2");
        setAnnouncement("Step 2 of 2 — your lanes and volume.");
      })}
      className="space-y-4"
    >
      <div>
        <label htmlFor="pf-name" className={labelClass}>
          Name
        </label>
        <input
          id="pf-name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={step1.formState.errors.name ? true : undefined}
          aria-describedby={step1.formState.errors.name ? "pf-name-error" : undefined}
          className={fieldClass(Boolean(step1.formState.errors.name))}
          ref={(node) => {
            nameRegisterRef(node);
            step1Ref.current = node;
          }}
          {...nameRest}
        />
        {step1.formState.errors.name ? (
          <p id="pf-name-error" className={errorClass}>
            {step1.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="pf-email" className={labelClass}>
          Work email
        </label>
        <input
          id="pf-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.in"
          aria-invalid={step1.formState.errors.email ? true : undefined}
          aria-describedby={step1.formState.errors.email ? "pf-email-error" : undefined}
          className={fieldClass(Boolean(step1.formState.errors.email))}
          {...step1.register("email")}
        />
        {step1.formState.errors.email ? (
          <p id="pf-email-error" className={errorClass}>
            {step1.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="pf-phone" className={labelClass}>
          Mobile number
        </label>
        <input
          id="pf-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="+91 …"
          aria-invalid={step1.formState.errors.phone ? true : undefined}
          aria-describedby={step1.formState.errors.phone ? "pf-phone-error" : undefined}
          className={fieldClass(Boolean(step1.formState.errors.phone))}
          {...step1.register("phone")}
        />
        {step1.formState.errors.phone ? (
          <p id="pf-phone-error" className={errorClass}>
            {step1.formState.errors.phone.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="pf-company" className={labelClass}>
          Company
        </label>
        <input
          id="pf-company"
          autoComplete="organization"
          placeholder="Company name"
          aria-invalid={step1.formState.errors.company ? true : undefined}
          aria-describedby={step1.formState.errors.company ? "pf-company-error" : undefined}
          className={fieldClass(Boolean(step1.formState.errors.company))}
          {...step1.register("company")}
        />
        {step1.formState.errors.company ? (
          <p id="pf-company-error" className={errorClass}>
            {step1.formState.errors.company.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className={cn(PRIMARY_BTN, "mt-1")}>
        Get my pilot quote <ArrowIcon />
      </button>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8B8B90]">
        Takes 40 seconds. No spam — we call once.
      </p>
      <a
        href={waUrl(step1WaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(SECONDARY_BTN, "mt-1")}
      >
        <WhatsAppIcon /> Prefer WhatsApp? Send it there
      </a>
    </form>
  );

  const segmented = (
    options: readonly string[],
    value: string | undefined,
    onChange: (v: string) => void,
    name: string,
  ) => (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "cursor-pointer rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200",
            value === o
              ? "border-[#E85A2C] bg-[rgba(232,90,44,0.14)] text-[#E8E8EA]"
              : "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] text-[#B9B9BF] hover:border-white/50",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );

  const step2View = (
    <form
      noValidate
      onSubmit={step2.handleSubmit((v) => {
        void submitPilot(step1.getValues(), v);
      })}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pf-origin" className={labelClass}>
            Pickup city / pincode
          </label>
          <input
            id="pf-origin"
            placeholder="e.g. Hyderabad"
            aria-invalid={step2.formState.errors.origin ? true : undefined}
            aria-describedby={step2.formState.errors.origin ? "pf-origin-error" : undefined}
            className={fieldClass(Boolean(step2.formState.errors.origin))}
            ref={(node) => {
              originRegisterRef(node);
              step2Ref.current = node;
            }}
            {...originRest}
          />
          {step2.formState.errors.origin ? (
            <p id="pf-origin-error" className={errorClass}>
              {step2.formState.errors.origin.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="pf-destination" className={labelClass}>
            Delivery city / pincode
          </label>
          <input
            id="pf-destination"
            placeholder="e.g. Mumbai"
            aria-invalid={step2.formState.errors.destination ? true : undefined}
            aria-describedby={
              step2.formState.errors.destination ? "pf-destination-error" : undefined
            }
            className={fieldClass(Boolean(step2.formState.errors.destination))}
            {...step2.register("destination")}
          />
          {step2.formState.errors.destination ? (
            <p id="pf-destination-error" className={errorClass}>
              {step2.formState.errors.destination.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <span className={labelClass}>Shipments per month</span>
        {segmented(
          VOLUME_OPTIONS,
          step2.watch("monthlyVolume"),
          (v) => step2.setValue("monthlyVolume", v as Step2Values["monthlyVolume"], { shouldValidate: true }),
          "Shipments per month",
        )}
        {step2.formState.errors.monthlyVolume ? (
          <p className={errorClass}>{step2.formState.errors.monthlyVolume.message}</p>
        ) : null}
      </div>

      <div>
        <span className={labelClass}>Payload class</span>
        {segmented(
          PAYLOAD_OPTIONS,
          step2.watch("payloadClass"),
          (v) => step2.setValue("payloadClass", v as Step2Values["payloadClass"], { shouldValidate: true }),
          "Payload class",
        )}
        {step2.formState.errors.payloadClass ? (
          <p className={errorClass}>{step2.formState.errors.payloadClass.message}</p>
        ) : null}
      </div>

      <div>
        <span className={labelClass}>Preferred call time (optional)</span>
        {segmented(
          CALL_TIME_OPTIONS,
          step2.watch("callTime"),
          (v) => step2.setValue("callTime", v as Step2Values["callTime"], { shouldValidate: true }),
          "Preferred call time",
        )}
      </div>

      <button type="submit" className={cn(PRIMARY_BTN, "mt-1")}>
        Request pilot pricing <ArrowIcon />
      </button>
      <button
        type="button"
        onClick={() => setPhase("step1")}
        className={cn(MUTED_LINK, "w-full text-center underline")}
      >
        ← Back
      </button>
      <a
        href={waUrl(step1WaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(SECONDARY_BTN, "mt-1")}
      >
        <WhatsAppIcon /> Prefer WhatsApp? Send it there
      </a>
    </form>
  );

  const loadingView = (
    <div aria-busy="true">
      <p className="font-mono text-[14px] leading-[1.65] text-[#E85A2C]">
        Submitting your pilot request…
      </p>
      <div className="mt-5 space-y-3" aria-hidden="true">
        <div className="h-4 w-full rounded-[4px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-4 w-3/4 rounded-[4px] bg-[rgba(255,255,255,0.08)]" />
      </div>
    </div>
  );

  const successView = (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7FBF6A]">
        ● Pilot request received
      </p>
      <p className="mt-4 text-[18px] font-semibold leading-[1.35] text-white">
        You&apos;re in. Expect a call within 2 business hours.
      </p>
      {submitted ? (
        <p className="mt-3 font-mono text-[13px] leading-[1.65] text-[#E85A2C]">
          &gt; {lane} · {submitted.s2.monthlyVolume}/mo ·{" "}
          {submitted.s2.payloadClass}
        </p>
      ) : null}
      <div className="mt-5 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="text-[13px] text-[#E8E8EA]">
          Your reference:{" "}
          <span className="font-mono font-semibold text-[#E85A2C]">
            {reference}
          </span>
        </p>
        <p className="mt-2 text-[11px] leading-[1.6] text-[#8B8B90]">
          No spam · Unsubscribe anytime · Your number is only used for this
          callback.
        </p>
      </div>
      <a
        href={waUrl(successWaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(PRIMARY_BTN, "mt-5")}
      >
        <WhatsAppIcon /> Confirm on WhatsApp <ArrowIcon />
      </a>
      <button
        type="button"
        onClick={resetFlow}
        className={cn(MUTED_LINK, "mt-5 inline-block underline")}
      >
        ← Submit another request
      </button>
    </div>
  );

  const errorView = (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E85A2C]">
        ● Network hiccup
      </p>
      <p className="mt-4 text-[14px] leading-[1.65] text-[#E8E8EA]">
        Network hiccup. Try again or{" "}
        <a
          href={waUrl(errorWaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E85A2C] underline-offset-4 transition-colors duration-200 hover:text-white"
        >
          WhatsApp us
        </a>{" "}
        →
      </p>
      <div className="mt-5 space-y-3">
        <button type="button" onClick={retry} className={PRIMARY_BTN}>
          Try again
        </button>
        <a
          href={waUrl(errorWaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_BTN}
        >
          <WhatsAppIcon /> WhatsApp fallback
        </a>
      </div>
    </div>
  );

  const view = () => {
    switch (phase) {
      case "step1":
        return step1View;
      case "step2":
        return step2View;
      case "loading":
        return loadingView;
      case "success":
        return successView;
      case "error":
        return errorView;
    }
  };

  /* ------------------------------- render ------------------------------- */

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "cursor-pointer",
              triggerClassName ??
                "rounded-full bg-[#E85A2C] px-[18px] py-[10px] text-[13.5px] font-semibold text-[#0B0D02]",
            )}
          >
            Start pilot <ArrowIcon className="ml-1" />
          </button>
        </DialogTrigger>

        <DialogContent
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            if (phase === "step2") step2Ref.current?.focus();
            else step1Ref.current?.focus();
          }}
        >
          <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-4 py-3 font-mono">
            <span className="flex gap-[6px]" aria-hidden="true">
              <i className="size-[9px] rounded-full bg-[#E8805F]" />
              <i className="size-[9px] rounded-full bg-[#E0B65A]" />
              <i className="size-[9px] rounded-full bg-[#7FBF6A]" />
            </span>
            <span className="mx-auto text-[10px] tracking-[0.04em] text-[#8B8B90]">
              jolt.ondl.in/pilot
            </span>
            <span className="flex items-center gap-[6px] text-[10px] tracking-[0.12em] text-[#E85A2C]">
              ● LIVE
            </span>
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close pilot request"
                className="ml-1 flex size-6 cursor-pointer items-center justify-center rounded-[4px] text-[#8B8B90] transition-colors duration-200 hover:text-white"
              >
                <CloseIcon />
              </button>
            </DialogClose>
          </div>

          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-[18px] shrink-0 text-[#E85A2C] drop-shadow-[0_0_8px_rgba(232,90,44,0.6)]"
              >
                <path d="M13 2 L4.5 13.5 H11 L10 22 L19.5 10 H12.5 Z" />
              </svg>
              <DialogTitle>
                {phase === "success" ? "Pilot requested" : "Start a pilot"}
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Request a JOLT pilot on your worst lane — we call back within 2
              business hours.
            </DialogDescription>

            {reduceMotion ? (
              <div key={phase}>{view()}</div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {view()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
