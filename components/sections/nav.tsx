"use client";

/**
 * Nav — resizable-navbar shell (Aceternity, founder 2026-10-19) carrying
 * the frozen JOLT branding and wired CTAs.
 *
 * Top state: full-width transparent bar (logo left, CTAs right).
 * Scrolled past 100px: shrinks into a floating glass pill (40% width,
 * blurred, dropped 20px). Mobile (<lg): logo + hamburger toggle; the
 * menu holds the same wired CTAs (no dead links).
 *
 * Wiring kept:
 * - "Case Studies" = text link to /case-studies (founder 2026-10-20).
 * - "Start pilot" = /pilot link with a soft-route onClick: the 3-step flow
 *   opens as a modal over this page and /pilot is pushed into history
 *   (no page load); a direct visit serves the real /pilot page.
 * - "Check serviceability" = ServiceabilityChecker trigger restyled to
 *   the frozen ghost capsule.
 * - Logo = ONDL mark SVG + "JOLT Deliveries" wordmark.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archivo } from "next/font/google";

import { ServiceabilityChecker } from "@/components/serviceability/serviceability-checker";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import styles from "./nav.module.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * Frozen ghost-capsule treatment for the checker's trigger button
 * (`.nav-ctas .btn-ghost`, frozen lines 55–56). Applied from the
 * wrapper because the trigger's own className must not be edited.
 */
const CHECKER_GHOST =
  "[&_button]:rounded-full [&_button]:border-[rgba(12,14,9,0.12)] [&_button]:bg-[rgba(255,255,255,0.55)] [&_button]:text-[13px] [&_button]:font-semibold [&_button]:text-[#0C0E09] [&_button]:backdrop-blur-[12px] [&_button]:transition-colors [&_button]:duration-200 [&_button]:hover:border-[rgba(12,14,9,0.28)] [&_button]:hover:bg-[rgba(255,255,255,0.85)] [&_button]:hover:text-[#0C0E09] [&_button]:focus-visible:outline-[#E85A2C]";

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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      scrolled={scrolled}
      className={archivo.variable}
    >
      {/* ---------- desktop ---------- */}
      <NavBody>
        <NavbarLogo>
          <span className={styles.brandWord}>
            JOLT<em>Deliveries</em>
          </span>
        </NavbarLogo>
        <div className={styles.navCtas}>
          <Link
            href="/case-studies"
            className="hidden items-center px-3 text-[13.5px] font-medium text-[#0C0E09] transition-colors duration-200 hover:text-[#C2410C] sm:inline-flex"
          >
            Case Studies
          </Link>
          <Link
            href="/pilot"
            onClick={(event) => {
              // Soft route: open the flow as a modal over this page and
              // push /pilot into history instead of a full page load.
              event.preventDefault();
              window.dispatchEvent(new Event("jolt:open-pilot"));
            }}
            className={cn(
              styles.btnInk,
              styles.btnInkAcid,
              "inline-flex items-center gap-2 rounded-full focus-visible:outline-[#E85A2C]",
            )}
          >
            Start pilot <ArrowIcon />
          </Link>
          <div className={CHECKER_GHOST}>
            <ServiceabilityChecker />
          </div>
        </div>
      </NavBody>

      {/* ---------- mobile ---------- */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo>
            <span className={styles.brandWord}>
              JOLT<em>Deliveries</em>
            </span>
          </NavbarLogo>
          <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <div className="flex w-full flex-col gap-4">
            <Link
              href="/case-studies"
              onClick={() => setMobileOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(12,14,9,0.14)] bg-white/60 px-4 py-[10px] text-[13.5px] font-medium text-[#0C0E09] transition-colors duration-200 focus-visible:outline-[#E85A2C]"
            >
              Case Studies
            </Link>
            <Link
              href="/pilot"
              onClick={(event) => {
                // Soft route — modal over this page, /pilot in history.
                event.preventDefault();
                setMobileOpen(false);
                window.dispatchEvent(new Event("jolt:open-pilot"));
              }}
              className={cn(
                styles.btnInk,
                styles.btnInkAcid,
                "inline-flex w-full items-center justify-center gap-2 rounded-full focus-visible:outline-[#E85A2C]",
              )}
            >
              Start pilot <ArrowIcon />
            </Link>
            <div className={cn(CHECKER_GHOST, "[&_button]:w-full")}>
              <ServiceabilityChecker />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
