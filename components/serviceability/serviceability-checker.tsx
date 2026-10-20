"use client";

/**
 * ServiceabilityChecker — Modal dialog · Brief 02
 *
 * Ungated 2-pincode + weight serviceability checker. One client island
 * containing the nav trigger button, the dialog, the form, and the full
 * state machine: IDLE → LOADING (≥400 ms) → SERVED / PARTIAL / NOT-SERVED /
 * INVALID / ERROR, backed by POST /api/serviceability (mock-gated server
 * side; the client never sees provider config).
 *
 * Dialog chrome inherits the frozen quirk-modal language (traffic-light
 * dots, mono URL bar, hairline border, orange accent) but none of its
 * typewriter behavior — the quirk terminal is reserved for the notify-me
 * waitlist (AGENTS.md).
 *
 * - Client renders only what the response contains; no fabricated
 *   statuses, rates, or coverage numbers.
 * - A11y: Radix dialog semantics (focus trap/return, Escape + backdrop
 *   close, scroll lock), labelled inputs with aria-describedby errors,
 *   aria-live="polite" state announcer, first input autofocus.
 * - Reduced motion: no skeleton pulse; AnimatePresence state transitions
 *   are gated on prefers-reduced-motion.
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
import { serviceabilitySchema, type ServiceabilityInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

/**
 * Base number for all WhatsApp deep links in this file. Single source of
 * truth — replace the placeholder with the production JOLT WhatsApp number
 * before deploy.
 */
export const WHATSAPP_NUMBER = "91XXXXXXXXXX";

const INDIA_POST_PINCODES =
  "https://www.indiapost.gov.in/VAS/Pages/findpincode.aspx";

/** LOADING state must stay visible long enough to read. */
const MIN_LOADING_MS = 400;

const waUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Client-side schema: strips the "110 001" display formatting added on blur
 * before validating against the shared serviceabilitySchema (reused
 * unchanged, per the brief). Zod messages and constraints are untouched.
 * The cast normalizes the preprocess input type for zodResolver (the actual
 * runtime input is the form values RHF passes in).
 */
const checkerSchema = z.preprocess(
  (values) => {
    if (values && typeof values === "object") {
      const v = values as Record<string, unknown>;
      return {
        ...v,
        originPin:
          typeof v.originPin === "string" ? v.originPin.replace(/\s+/g, "") : v.originPin,
        destPin:
          typeof v.destPin === "string" ? v.destPin.replace(/\s+/g, "") : v.destPin,
      };
    }
    return values;
  },
  serviceabilitySchema,
) as unknown as z.ZodType<ServiceabilityInput, z.ZodTypeDef, ServiceabilityInput>;

type CheckResponse = {
  ok: boolean;
  mock?: boolean;
  status?: "served" | "partial" | "not-served";
  /** Legacy real-backend shape (no `status` field). */
  serviceable?: boolean;
  originPin?: string;
  destPin?: string;
  originServed?: boolean;
  destServed?: boolean;
  eta?: string | null;
  tatHours?: number | null;
  ratePerKgInr?: number | null;
  rateBandInr?: [number, number] | null;
};

type ResultState = "served" | "partial" | "not-served" | "error";
type ViewState = "idle" | "invalid" | "loading" | ResultState;

const PIN_DISPLAY = (pin: string) => pin.replace(/\s+/g, "");

/* ============================== tiny bits ============================== */

function Chip({
  tone,
  children,
}: {
  tone: "green" | "amber" | "muted" | "orange";
  children: React.ReactNode;
}) {
  const tones: Record<typeof tone, string> = {
    green:
      "border-[rgba(127,191,106,0.4)] bg-[rgba(127,191,106,0.08)] text-[#7FBF6A]",
    amber:
      "border-[rgba(224,182,90,0.4)] bg-[rgba(224,182,90,0.08)] text-[#E0B65A]",
    muted:
      "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] text-[#B9B9BF]",
    orange:
      "border-[rgba(232,90,44,0.45)] bg-[rgba(232,90,44,0.08)] text-[#E85A2C]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-[5px] font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function EchoLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 break-words font-mono text-[13px] leading-[1.65] text-[#E85A2C]">
      {children}
    </p>
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

const PRIMARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#E85A2C] px-4 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[#08080A] transition-colors duration-200 hover:bg-white";
const SECONDARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.22)] px-4 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#E8E8EA] transition-colors duration-200 hover:border-white hover:bg-[rgba(255,255,255,0.04)]";
const MUTED_LINK =
  "font-mono text-[12px] text-[#8B8B90] underline-offset-4 transition-colors duration-200 hover:text-[#E8E8EA]";

/* ============================ the component ============================ */

export function ServiceabilityChecker() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<ViewState>("idle");
  const [data, setData] = React.useState<CheckResponse | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const reduceMotion = useReducedMotion();
  const originRef = React.useRef<HTMLInputElement>(null);
  const lastSubmittedRef = React.useRef<ServiceabilityInput | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ServiceabilityInput>({
    resolver: zodResolver(checkerSchema),
    defaultValues: { originPin: "", destPin: "", weightKg: undefined },
  });

  const formatPinOnBlur =
    (field: "originPin" | "destPin") => () => {
      const raw = getValues(field);
      const digits = raw.replace(/\D/g, "").slice(0, 6);
      if (digits.length === 6) {
        setValue(field, `${digits.slice(0, 3)} ${digits.slice(3)}`, {
          shouldValidate: true,
        });
      }
    };

  /* Origin input needs both RHF's ref (uncontrolled tracking) and our ref
     (first-input autofocus on dialog open) — combine them. */
  const { ref: originRegisterRef, ...originRegisterRest } = register(
    "originPin",
    { onBlur: formatPinOnBlur("originPin") },
  );

  async function runCheck(values: ServiceabilityInput) {
    lastSubmittedRef.current = values;
    setState("loading");
    setAnnouncement("Checking lane coverage on the JOLT network…");
    try {
      const [res] = await Promise.all([
        fetch("/api/serviceability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
        delay(MIN_LOADING_MS),
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: unknown = await res.json();
      if (!body || typeof body !== "object") throw new Error("Invalid payload");
      const payload = body as CheckResponse;
      if (payload.ok !== true) throw new Error("API error");

      // Legacy tolerance: real backend may send `serviceable` instead of `status`.
      let status = payload.status;
      if (!status && typeof payload.serviceable === "boolean") {
        status = payload.serviceable ? "served" : "not-served";
      }
      if (status !== "served" && status !== "partial" && status !== "not-served") {
        throw new Error("Missing status");
      }

      setData(payload);
      setState(status);
      setAnnouncement(
        status === "served"
          ? "Lane live."
          : status === "partial"
            ? "Partial coverage."
            : "Lane not on network yet.",
      );
    } catch {
      setState("error");
      setAnnouncement("Network hiccup. Try again or WhatsApp us.");
    }
  }

  const onSubmit = (values: ServiceabilityInput) => {
    void runCheck(values);
  };

  const onInvalid = () => {
    setState("invalid");
    setAnnouncement("That looks short for a pincode — it's 6 digits.");
  };

  const retry = () => {
    const values = lastSubmittedRef.current;
    if (!values) return;
    void runCheck(values);
  };

  const backToForm = () => {
    setState("idle");
    setData(null);
    setAnnouncement("");
  };

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        // Fresh check every time the dialog opens.
        setState("idle");
        setData(null);
        setAnnouncement("");
        reset();
      }
    },
    [reset],
  );

  /* External open hook: lets the nav utility bar open this dialog via the
     `jolt:open-checker` window event (same pattern as the pilot flow). */
  React.useEffect(() => {
    const onOpen = () => handleOpenChange(true);
    window.addEventListener("jolt:open-checker", onOpen);
    return () => window.removeEventListener("jolt:open-checker", onOpen);
  }, [handleOpenChange]);

  const submitted = lastSubmittedRef.current;
  const pin = (value: string | undefined, fallback: string) =>
    PIN_DISPLAY(value ?? fallback);

  const originPin = pin(data?.originPin, submitted?.originPin ?? "");
  const destPin = pin(data?.destPin, submitted?.destPin ?? "");
  const weightKg = submitted?.weightKg;

  /* ---------- copy builders (verbatim from Brief 02 "Final copy") ---------- */

  const laneEcho = (label: string) =>
    `> ${originPin} → ${destPin} — ${label}`;

  const servedRateLine = (): string | null => {
    if (weightKg === undefined || weightKg > 500) return null;
    const band = data?.rateBandInr;
    if (!band || band.length !== 2) return null;
    return `Indicative rate for ${weightKg} kg: ₹${band[0].toLocaleString("en-IN")}–₹${band[1].toLocaleString("en-IN")}`;
  };

  const partialBody = (): string => {
    const originServed = data?.originServed ?? true;
    const destServed = data?.destServed ?? false;
    return originServed && !destServed
      ? `Pickup pincode ${originPin} is on the JOLT network, but delivery pincode ${destPin} isn't live yet.`
      : `Delivery pincode ${destPin} is on the JOLT network, but pickup pincode ${originPin} isn't live yet.`;
  };

  const servedWaMessage = `Hi JOLT! I checked serviceability for ${originPin} → ${destPin} (${weightKg} kg) — lane is live. Please share a contract rate for this lane.`;
  const partialWaMessage = `Hi JOLT! Please notify me when ${originPin} → ${destPin} opens on the JOLT network.`;
  const errorWaMessage = `Hi JOLT! The serviceability check for ${originPin} → ${destPin} failed — can you check this lane for me?`;

  /* ------------------------------ views ------------------------------ */

  const fieldClass = (invalid: boolean) =>
    cn(
      "w-full rounded-[10px] border bg-[rgba(255,255,255,0.05)] px-4 py-[13px] text-[16px] text-white outline-none transition-colors duration-200 placeholder:text-[#8B8B90]",
      invalid
        ? "border-[rgba(232,90,44,0.6)] focus:border-[#E85A2C]"
        : "border-[rgba(255,255,255,0.16)] focus:border-[#E85A2C]",
    );

  const labelClass =
    "mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#8B8B90]";
  const errorClass = "mt-[6px] font-mono text-[11px] text-[#E85A2C]";

  const formView = (
    <div>
      {state === "invalid" ? (
        <div className="mb-5 rounded-[10px] border border-[rgba(232,90,44,0.4)] bg-[rgba(232,90,44,0.08)] px-4 py-3">
          <p className="text-[13px] leading-[1.55] text-[#E8E8EA]">
            That looks short for a pincode — it&apos;s 6 digits.
          </p>
        </div>
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="sc-origin" className={labelClass}>
            Pickup pincode
          </label>
          <input
            id="sc-origin"
            inputMode="numeric"
            maxLength={6}
            autoComplete="off"
            placeholder="110 001"
            aria-invalid={errors.originPin ? true : undefined}
            aria-describedby={errors.originPin ? "sc-origin-error" : undefined}
            className={fieldClass(Boolean(errors.originPin))}
            ref={(node) => {
              originRegisterRef(node);
              originRef.current = node;
            }}
            {...originRegisterRest}
          />
          {errors.originPin ? (
            <p id="sc-origin-error" className={errorClass}>
              {errors.originPin.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sc-dest" className={labelClass}>
            Delivery pincode
          </label>
          <input
            id="sc-dest"
            inputMode="numeric"
            maxLength={6}
            autoComplete="off"
            placeholder="110 001"
            aria-invalid={errors.destPin ? true : undefined}
            aria-describedby={errors.destPin ? "sc-dest-error" : undefined}
            className={fieldClass(Boolean(errors.destPin))}
            {...register("destPin", {
              onBlur: formatPinOnBlur("destPin"),
            })}
          />
          {errors.destPin ? (
            <p id="sc-dest-error" className={errorClass}>
              {errors.destPin.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sc-weight" className={labelClass}>
            Shipment weight (kg)
          </label>
          <input
            id="sc-weight"
            type="number"
            min={20}
            max={1000}
            step="1"
            placeholder="e.g. 200"
            aria-invalid={errors.weightKg ? true : undefined}
            aria-describedby={errors.weightKg ? "sc-weight-error" : undefined}
            className={fieldClass(Boolean(errors.weightKg))}
            {...register("weightKg", { setValueAs: (v) => Number(v) })}
          />
          {errors.weightKg ? (
            <p id="sc-weight-error" className={errorClass}>
              {errors.weightKg.message}
            </p>
          ) : null}
        </div>

        <p className="pt-1 text-[12px] leading-[1.6] text-[#B9B9BF]">
          Don&apos;t know the pincode?{" "}
          <a
            href={INDIA_POST_PINCODES}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E85A2C] underline-offset-4 transition-colors duration-200 hover:text-white"
          >
            Find it on India Post.
          </a>
        </p>

        <button type="submit" className={cn(PRIMARY_BTN, "mt-1")}>
          Check serviceability <ArrowIcon />
        </button>
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8B8B90]">
          Free check · No signup · No login
        </p>
      </form>
    </div>
  );

  const loadingView = (
    <div aria-busy="true">
      <p className="font-mono text-[14px] leading-[1.65] text-[#E85A2C]">
        Checking lane coverage on the JOLT network…
      </p>
      <div className="mt-5 space-y-3" aria-hidden="true">
        <div className="h-4 w-full rounded-[4px] bg-[rgba(255,255,255,0.08)]" />
        <div className="h-4 w-3/4 rounded-[4px] bg-[rgba(255,255,255,0.08)]" />
      </div>
    </div>
  );

  const backLink = (
    <button
      type="button"
      onClick={backToForm}
      className={cn(MUTED_LINK, "mt-6 inline-block underline")}
    >
      ← Check another lane
    </button>
  );

  const servedView = (
    <div>
      <Chip tone="green">LANE LIVE</Chip>
      <EchoLine>{laneEcho("LANE LIVE")}</EchoLine>

      <div className="mt-5 space-y-[6px] rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="text-[14px] leading-[1.6] text-[#E8E8EA]">
          Transit: 24–48 hours on scheduled express trains.
        </p>
        <p className="text-[14px] leading-[1.6] text-[#E8E8EA]">
          Estimated delivery: Next-day to Day 2.
        </p>
        {weightKg !== undefined && weightKg > 500 ? (
          <p className="text-[14px] leading-[1.6] text-[#E8E8EA]">
            Lane is live. Shipments over 500 kg are priced case-by-case — talk
            to our freight desk.
          </p>
        ) : servedRateLine() ? (
          <p className="text-[14px] leading-[1.6] text-[#E8E8EA]">
            {servedRateLine()}
          </p>
        ) : null}
      </div>

      <p className="mt-4 text-[11px] leading-[1.6] text-[#8B8B90]">
        Estimates based on published rail-freight rate slabs for heavy cargo.
        Actual rates vary by contract terms, fuel surcharges and seasonal
        adjustments.
      </p>
      <p className="mt-2 text-[11px] leading-[1.6] text-[#8B8B90]">
        The 48-hour promise excludes loading/unloading time, weather and force
        majeure.
      </p>

      <a
        href={waUrl(servedWaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(PRIMARY_BTN, "mt-5")}
      >
        <WhatsAppIcon /> Get a contract rate on WhatsApp <ArrowIcon />
      </a>
      {backLink}
    </div>
  );

  const notServedCtas = (
    <div className="mt-5 space-y-3">
      <a
        href={waUrl(partialWaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={PRIMARY_BTN}
      >
        <WhatsAppIcon /> Notify me when live <ArrowIcon />
      </a>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          window.dispatchEvent(new Event("jolt:open-pilot"));
        }}
        className={SECONDARY_BTN}
      >
        Or request pilot pricing <ArrowIcon />
      </button>
    </div>
  );

  const partialView = (
    <div>
      <Chip tone="amber">PARTIAL COVERAGE</Chip>
      <EchoLine>{laneEcho("PARTIAL COVERAGE")}</EchoLine>
      <p className="mt-4 text-[14px] leading-[1.65] text-[#E8E8EA]">
        {partialBody()}
      </p>
      <p className="mt-3 text-[14px] leading-[1.65] text-[#B9B9BF]">
        We&apos;re opening new terminals every quarter. Tell us where you ship
        and we&apos;ll ping you the day this lane goes live.
      </p>
      {notServedCtas}
      {backLink}
    </div>
  );

  const notServedView = (
    <div>
      <Chip tone="muted">NOT ON NETWORK YET</Chip>
      <EchoLine>{laneEcho("NOT ON NETWORK YET")}</EchoLine>
      <p className="mt-4 text-[14px] leading-[1.65] text-[#E8E8EA]">
        This lane isn&apos;t serviceable on the JOLT express network yet.
      </p>
      <p className="mt-3 text-[14px] leading-[1.65] text-[#B9B9BF]">
        We&apos;re expanding lane by lane — ping us and we&apos;ll notify you
        the day it opens.
      </p>
      {notServedCtas}
      {backLink}
    </div>
  );

  const errorView = (
    <div>
      <Chip tone="orange">NETWORK HICCUP</Chip>
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
      {backLink}
    </div>
  );

  const view = (): React.ReactNode => {
    switch (state) {
      case "loading":
        return loadingView;
      case "served":
        return servedView;
      case "partial":
        return partialView;
      case "not-served":
        return notServedView;
      case "error":
        return errorView;
      default:
        return formView;
    }
  };

  /* ------------------------------ render ------------------------------ */

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="cursor-pointer rounded-[6px] border border-[rgba(255,255,255,0.25)] bg-transparent px-[18px] py-[10px] text-[14px] font-medium text-white transition-colors duration-200 ease-out hover:border-white/60 hover:bg-white/5"
          >
            Check serviceability
          </button>
        </DialogTrigger>

        <DialogContent
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            originRef.current?.focus();
          }}
        >
          {/* Chrome bar — quirk-modal language minus the quirk */}
          <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-4 py-3 font-mono">
            <span className="flex gap-[6px]" aria-hidden="true">
              <i className="size-[9px] rounded-full bg-[#E8805F]" />
              <i className="size-[9px] rounded-full bg-[#E0B65A]" />
              <i className="size-[9px] rounded-full bg-[#7FBF6A]" />
            </span>
            <span className="mx-auto text-[10px] tracking-[0.04em] text-[#8B8B90]">
              jolt.ondl.in/serviceability
            </span>
            <span className="flex items-center gap-[6px] text-[10px] tracking-[0.12em] text-[#E85A2C]">
              ● LIVE
            </span>
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close serviceability check"
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
              <DialogTitle>Check serviceability</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Check whether a heavy-shipment lane between two pincodes is live
              on the JOLT network.
            </DialogDescription>

            {reduceMotion ? (
              <div key={state}>{view()}</div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={state}
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

      {/* State announcer for screen readers */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
