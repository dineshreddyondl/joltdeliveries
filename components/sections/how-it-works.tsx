"use client";

/**
 * How It Works — The Orchestration Layer · V0.1 restructure (founder 2026-10-19)
 *
 * The solution + USP section. Restructured from three dense paragraphs to a
 * low-density, journey-first layout:
 *   H2 → one-line lede → horizontal journey pipeline (FIRST MILE → RAIL
 *   LINEHAUL → LAST MILE with the travelling dot) → three compact USP cards
 *   (NTO / HUBLESS / VISIBILITY, one line each + mono spec) → CO₂ footnote.
 *
 * V0.2 wow pass (designer 2026-10-20 — founder: "missing the wow moment"):
 *   - Reveal: Aceternity tracing-beam (horizontalized) comet sweep on
 *     section reveal + static ambient corridor bloom behind the pipeline.
 *   - Linehaul moment: rail leg paced 1.5×, comet-dot with stretching
 *     tail, corridor flare + speed streaks + hub ignition ring + linehaul
 *     label glow — all synchronized to the same 5.2s CSS loop.
 *   - Copy frozen. Reduced-motion / no-JS land on the static journey.
 *
 * Copy changes in this pass (flagged to founder):
 * - H2: founder's new sentence "We built the purpose-built layer for express
 *   heavy commerce — the fastest, from first mile to last mile."
 * - Lede: black-box/cleanest-weight duplication vs Why Now removed.
 * - 89% CO₂ now carries its required footnote (NITI Aayog, SFC India 2025).
 * - "absolute visibility" → "every milestone tracked".
 */

import { Space_Grotesk } from "next/font/google";
import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

import { useReveal } from "@/components/ui/use-reveal";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/lib/utils";
import styles from "./how-it-works.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const rv: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

/* Symbolic props — minimal thin-stroke glyphs, deliberately NOT emoji,
   NOT illustrations. The truck is a cab + container + two wheels; the
   train is a long body with windows, wheels, and one orange headlight. */
function TruckGlyph() {
  return (
    <svg viewBox="0 0 32 18" className={styles.glyph} aria-hidden="true">
      <path
        d="M3 4.5h11v9H3zM14 8h5.2l5.8 5.5H3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="14" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="23" cy="14" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function TrainGlyph() {
  return (
    <svg viewBox="0 0 72 16" className={styles.glyph} aria-hidden="true">
      {/* body: straight shell with rounded tail, short angled nose */}
      <path
        d="M2 12.5 L2 3.5 Q2 2.5 3 2.5 H48 L56 5 Q60 8 56 11 L48 13.5 H3 Q2 13.5 2 12.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* windscreen pane near the nose */}
      <path
        d="M44 3.5 L48.5 8 L44 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="22" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="32" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="9" cy="13.6" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="26" cy="13.6" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="43" cy="13.6" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="57.5" cy="6.5" r="1.4" fill="#E85A2C" />
    </svg>
  );
}

const H2_WORDS = [
  { text: "A" },
  { text: "purpose-built", className: "text-[#E85A2C]", effect: true },
  { text: "express", className: "text-[#E85A2C]", effect: true },
  { text: "layer", className: "text-[#E85A2C]", effect: true },
  { text: "for" },
  { text: "heavy" },
  { text: "commerce" },
  { text: "—" },
  { text: "not" },
  { text: "another" },
  { text: "bidding" },
  { text: "board" },
  { text: "or" },
  { text: "marketplace." },
];

const STAGES = [
  {
    idx: "01",
    name: "First Mile",
    sub: "Scheduled road pickup",
    hot: false,
  },
  {
    idx: "02",
    name: "Just-in-Time Linehaul",
    sub: "Next Train Out · no stops",
    hot: true,
  },
  {
    idx: "03",
    name: "Direct Delivery",
    sub: "Right to your distributor",
    hot: false,
  },
];

const USPS = [
  {
    step: "01 / NTO",
    word: "Faster",
    line: "Just-in-time linehaul on scheduled express trains.",
    spec: "Up to 89% less CO₂ per tonne-km vs road",
  },
  {
    step: "02 / HUBLESS",
    word: "Seamless",
    line: "One motion from first mile to last. Almost zero stops.",
    spec: "No mid-journey sorting",
  },
  {
    step: "03 / VISIBILITY",
    word: "Live",
    line: "Live tracking at every milestone — not intermittent like traditional models.",
    spec: "Guaranteed SLA",
  },
];

export function HowItWorks() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  /* Gate the heading flip-in on the heading's own visibility so the
     letters cascade when the user actually arrives at the section. */
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h2InView = useInView(h2Ref as never, { once: true, amount: 0.6 });
  const flipOn = animateIn && h2InView;

  return (
    <section
      id="how"
      ref={ref}
      aria-labelledby="how-heading"
      className={styles.sec}
    >
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.wrap}>
        <motion.span
          variants={rv}
          custom={0}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.tag}
        >
          The Orchestration Layer
        </motion.span>

        <motion.h2
          id="how-heading"
          ref={h2Ref}
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          {H2_WORDS.map((w, i) =>
            w.effect && flipOn ? (
              <FlipWords
                key={w.text}
                words={[w.text]}
                once
                delay={i * 0.12}
                className={w.className}
              />
            ) : (
              <span key={w.text} className={w.className}>
                {w.text}{" "}
              </span>
            ),
          )}
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          We don&rsquo;t match loads and hope. Every shipment moves
          just-in-time — first mile, linehaul, last mile — with almost zero
          stops in between.
        </motion.p>

        {/* Journey graphic — the story with symbolic props: a subtle truck
            drives the first mile and halts at the railhead; the train takes
            over with an accelerate-cruise-decelerate linehaul; a truck
            takes the last mile and delivers. Handoffs pulse at the two
            interchange nodes. 8s loop; reduced-motion = delivered static. */}
        <motion.div
          variants={rv}
          custom={3}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.pipeline}
          aria-hidden="true"
        >
          <div className={styles.route}>
            <div className={styles.roadL} />
            <div className={styles.rail} />
            <div className={styles.roadR} />
            <div className={styles.nodeA} />
            <div className={styles.nodeB} />
            <div className={styles.truckA}>
              <span className={styles.trail} />
              <TruckGlyph />
            </div>
            <div className={styles.train}>
              <span className={styles.trail} />
              <TrainGlyph />
            </div>
            <div className={styles.truckB}>
              <span className={styles.trail} />
              <TruckGlyph />
            </div>
            <div className={styles.ringA} />
            <div className={styles.ringB} />
            <div className={styles.delivered} />
          </div>
          <div className={styles.stageRow}>
            {STAGES.map((s) => (
              <div
                key={s.idx}
                className={cn(styles.stage, s.hot && styles.stageHot)}
              >
                <span className={styles.stageIdx}>{s.idx}</span>
                <span className={cn(sg.className, styles.stageName)}>
                  {s.name}
                </span>
                <span className={styles.stageSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className={styles.usps}>
          {USPS.map((u, i) => (
            <motion.div
              key={u.step}
              variants={rv}
              custom={i + 3}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={styles.usp}
            >
              <span className={styles.step}>{u.step}</span>
              <h3 className={sg.className}>{u.word}</h3>
              <p>{u.line}</p>
              <span className={styles.spec}>{u.spec}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={rv}
          custom={6}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.footnote}
        >
          <sup aria-hidden="true">‡</sup>
          vs road freight per tonne-km · NITI Aayog, SFC India 2025
        </motion.p>
      </div>
    </section>
  );
}
