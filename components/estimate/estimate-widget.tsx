"use client";

/**
 * EstimateWidget — instant freight estimate · Brief 12 (Goal 2)
 *
 * Ungated 3-field estimator (origin pin / dest pin / weight) → POST
 * /api/estimate → indicative ₹ estimate + eta + disclaimers, with the
 * WhatsApp contract-rate path. ClickPost-style disclaimers verbatim
 * from research 04. Renders response fields only — no fabricated
 * numbers. Same a11y + reduced-motion discipline as the checker.
 */

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

import { estimateSchema, type EstimateInput } from "@/lib/validation";
import { WHATSAPP_NUMBER } from "@/components/serviceability/serviceability-checker";
import { cn } from "@/lib/utils";
import styles from "./estimate-widget.module.css";

const waUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const MIN_LOADING_MS = 400;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

type EstimateResponse = {
  ok: boolean;
  estimateInr?: number;
  eta?: string;
  validForHours?: number;
};

type Phase = "idle" | "loading" | "result" | "error";

const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#4A4E44]";
const errorClass = "mt-[5px] font-mono text-[10.5px] text-[#C2410C]";
const fieldClass = (invalid: boolean) =>
  cn(
    "w-full rounded-[10px] border bg-white px-3.5 py-[11px] text-[14px] text-[#0C0E09] outline-none transition-colors duration-200 placeholder:text-[#6E7366]",
    invalid
      ? "border-[#C2410C]/70 focus:border-[#C2410C]"
      : "border-[rgba(12,14,9,0.14)] focus:border-[#C2410C]",
  );

export function EstimateWidget() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [data, setData] = React.useState<EstimateResponse | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const reduceMotion = useReducedMotion();
  const submittedRef = React.useRef<EstimateInput | null>(null);

  /* Hydration-safe animation gate (house pattern). */
  const [ready, setReady] = React.useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
    defaultValues: { originPin: "", destPin: "", weightKg: undefined },
  });

  async function runEstimate(values: EstimateInput) {
    submittedRef.current = values;
    setPhase("loading");
    setAnnouncement("Estimating your lane…");
    try {
      const [res] = await Promise.all([
        fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
        new Promise((r) => setTimeout(r, MIN_LOADING_MS)),
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: unknown = await res.json();
      if (!body || typeof body !== "object") throw new Error("Invalid payload");
      const payload = body as EstimateResponse;
      if (payload.ok !== true || payload.estimateInr === undefined) {
        throw new Error("Missing estimate");
      }
      setData(payload);
      setPhase("result");
      setAnnouncement(
        `Indicative estimate: ₹${payload.estimateInr.toLocaleString("en-IN")}.`,
      );
    } catch {
      setPhase("error");
      setAnnouncement("Network hiccup. Try again or WhatsApp us.");
    }
  }

  const retry = () => {
    const v = submittedRef.current;
    if (v) void runEstimate(v);
  };

  const resetWidget = () => {
    setPhase("idle");
    setData(null);
    setAnnouncement("");
  };

  const submitted = submittedRef.current;
  const waMessage = data
    ? `Hi JOLT! I estimated ${submitted?.originPin ?? ""} → ${submitted?.destPin ?? ""} (${submitted?.weightKg ?? ""} kg) at ₹${data.estimateInr?.toLocaleString("en-IN") ?? ""} — please share the contract rate.`
    : "Hi JOLT! I'd like an exact rate for my lane.";

  const formView = (
    <form
      noValidate
      onSubmit={handleSubmit((v) => void runEstimate(v))}
      className={styles.formRow}
    >
      <div className={styles.field}>
        <label htmlFor="ew-origin" className={labelClass}>
          Pickup pincode
        </label>
        <input
          id="ew-origin"
          inputMode="numeric"
          maxLength={6}
          placeholder="500001"
          aria-invalid={errors.originPin ? true : undefined}
          aria-describedby={errors.originPin ? "ew-origin-error" : undefined}
          className={fieldClass(Boolean(errors.originPin))}
          {...register("originPin")}
        />
        {errors.originPin ? (
          <p id="ew-origin-error" className={errorClass}>
            {errors.originPin.message}
          </p>
        ) : null}
      </div>
      <div className={styles.field}>
        <label htmlFor="ew-dest" className={labelClass}>
          Delivery pincode
        </label>
        <input
          id="ew-dest"
          inputMode="numeric"
          maxLength={6}
          placeholder="110001"
          aria-invalid={errors.destPin ? true : undefined}
          aria-describedby={errors.destPin ? "ew-dest-error" : undefined}
          className={fieldClass(Boolean(errors.destPin))}
          {...register("destPin")}
        />
        {errors.destPin ? (
          <p id="ew-dest-error" className={errorClass}>
            {errors.destPin.message}
          </p>
        ) : null}
      </div>
      <div className={styles.field}>
        <label htmlFor="ew-weight" className={labelClass}>
          Weight (kg)
        </label>
        <input
          id="ew-weight"
          type="number"
          min={20}
          max={1000}
          placeholder="200"
          aria-invalid={errors.weightKg ? true : undefined}
          aria-describedby={errors.weightKg ? "ew-weight-error" : undefined}
          className={fieldClass(Boolean(errors.weightKg))}
          {...register("weightKg", { setValueAs: (v) => Number(v) })}
        />
        {errors.weightKg ? (
          <p id="ew-weight-error" className={errorClass}>
            {errors.weightKg.message}
          </p>
        ) : null}
      </div>
      <div className={styles.field}>
        <span className={labelClass}>&nbsp;</span>
        <button type="submit" className={styles.submit}>
          Estimate <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );

  const loadingView = (
    <p className={styles.statusLine} aria-busy="true">
      Estimating your lane…
    </p>
  );

  const resultView = data ? (
    <div>
      <p className={styles.estimate}>
        Indicative estimate:{" "}
        <span className={styles.price}>
          ₹{data.estimateInr?.toLocaleString("en-IN")}
        </span>
        <span className={styles.eta}>
          {" "}
          · {data.eta ?? "Next-day"}
        </span>
      </p>
      <p className={styles.disclaimer}>
        Estimates based on published rail-freight rate slabs for heavy cargo.
        Actual rates vary by contract terms, fuel surcharges and seasonal
        adjustments.
      </p>
      <div className={styles.resultActions}>
        <a
          href={waUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.waBtn}
        >
          Get a contract rate on WhatsApp →
        </a>
        <button
          type="button"
          onClick={resetWidget}
          className={styles.resetBtn}
        >
          ← Estimate another lane
        </button>
      </div>
    </div>
  ) : null;

  const errorView = (
    <div>
      <p className={styles.statusLine}>
        Network hiccup. Try again or{" "}
        <a
          href={waUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.errorLink}
        >
          WhatsApp us →
        </a>
      </p>
      <button type="button" onClick={retry} className={styles.submit}>
        Try again
      </button>
    </div>
  );

  const view = () => {
    switch (phase) {
      case "loading":
        return loadingView;
      case "result":
        return resultView;
      case "error":
        return errorView;
      default:
        return formView;
    }
  };

  return (
    <div className={styles.widget}>
      <div className={styles.head}>
        <span className={styles.title}>Instant freight estimate</span>
        <span className={styles.badge}>Free · No signup</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phase}
          variants={fadeVariants}
          initial={animateIn ? "hidden" : false}
          animate={animateIn ? "show" : false}
        >
          {view()}
        </motion.div>
      </AnimatePresence>
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
