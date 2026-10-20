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

function OndlMark() {
  return (
    <svg className={styles.ondlMark} viewBox="0 0 800 800" fill="none" aria-hidden="true">
      <path d="M675.837 297.235C666.191 292.021 656.085 287.708 645.649 284.35C623.802 277.271 600.691 274.975 577.881 277.617C556.237 280.134 535.217 286.506 515.813 296.432C513.987 297.324 512.251 298.216 510.559 299.152C511.494 297.458 512.429 295.808 513.275 294.114C524.267 273.762 530.951 251.36 532.911 228.305C533.764 217.397 533.481 206.429 532.065 195.58C530.491 182.818 527.504 170.272 523.16 158.172C519.949 149.391 516.14 140.84 511.761 132.58C510.559 130.306 509.312 128.122 508.065 125.981C510.425 127.23 512.741 128.434 515.1 129.593C528.025 135.986 541.613 140.935 555.619 144.351L558.78 145.064C560.65 145.465 562.565 145.867 564.479 146.179C569.199 147.115 574.008 147.784 578.861 148.274C584.498 148.844 590.16 149.127 595.825 149.121C601.565 149.118 607.302 148.82 613.012 148.23C618.578 147.65 623.965 146.848 629.041 145.822C645.581 142.592 661.607 137.132 676.683 129.593C677.339 129.317 677.978 129.004 678.598 128.657C678.598 128.657 680.913 127.453 681.804 126.918L680.245 129.86L679.266 131.733C671.189 147.231 665.528 163.876 662.48 181.089C661.678 185.548 661.055 190.452 660.61 195.045C659.553 207.042 659.762 219.117 661.233 231.07C661.723 235.528 662.48 239.987 663.326 244.445C663.86 247.433 664.528 250.42 665.24 253.363C665.953 256.305 666.532 258.356 667.244 260.808C670.383 271.844 674.403 282.609 679.266 292.999C680.735 296.209 682.249 299.241 683.718 301.916C681.136 300.222 678.375 298.662 675.837 297.235Z" fill="#0C0E09" />
      <path d="M78.5168 589.669C79.0874 596.95 81.4966 603.965 85.5178 610.056C88.6976 614.882 92.792 619.035 97.5687 622.281C90.8865 611.908 84.5359 601.038 78.5168 589.669ZM798.818 181.014C798.202 174.786 797.257 168.595 795.987 162.467C789.727 130.734 775.863 101 755.588 75.823C750.966 70.0314 746.036 64.4924 740.821 59.23C735.437 53.8058 729.753 48.6883 723.797 43.9016C698.518 23.7455 668.751 10.0071 637.03 3.85616C631.177 2.66821 625.247 1.78682 619.317 1.13537C604.998 -0.378455 590.559 -0.378455 576.24 1.13537C570.31 1.78682 564.456 2.66821 558.565 3.81784C542.09 7.09617 526.089 12.4258 510.935 19.6827C507.109 21.5988 502.978 23.5148 499.075 25.8907C489.528 31.2281 480.442 37.3553 471.913 44.2082C468.087 47.2355 464.529 50.3779 460.971 53.6735C459.365 55.1297 457.758 56.7391 456.189 58.272C455.73 58.7318 455.309 59.0767 454.889 59.5366C449.647 64.8249 439.586 75.4398 439.586 75.4398L433.082 83.104L410.434 109.929L405.078 116.29L323.82 213.855L237.245 317.322L208.437 352.577L150.708 421.555L147.991 424.851C147.182 425.772 146.587 426.862 146.249 428.041C145.912 429.221 145.84 430.461 146.04 431.672C146.238 433.037 146.757 434.336 147.555 435.461C148.353 436.585 149.407 437.504 150.629 438.14C151.851 438.777 153.207 439.113 154.584 439.121C155.961 439.129 157.321 438.809 158.55 438.186L220.756 406.993C222.545 406.087 224.618 405.921 226.528 406.531C228.438 407.14 230.033 408.475 230.971 410.25C231.658 411.515 231.976 412.947 231.888 414.384C231.8 415.821 231.31 417.204 230.473 418.374L222.325 429.871L116.544 578.441L114.402 581.469C113.348 582.845 112.755 584.52 112.707 586.254C112.659 587.988 113.158 589.693 114.134 591.126C114.725 592.094 115.502 592.935 116.42 593.601C117.338 594.266 118.378 594.743 119.481 595.003C120.584 595.263 121.727 595.302 122.845 595.117C123.963 594.931 125.033 594.525 125.994 593.923L129.819 591.624L203.387 546.712C204.556 545.948 205.897 545.492 207.288 545.384C208.679 545.277 210.074 545.523 211.345 546.098C213.335 547.012 214.926 548.653 216.009 550.795C217.092 552.937 217.615 555.457 217.505 557.983C217.396 560.509 216.659 562.963 215.383 565.092C214.107 567.221 212.349 568.922 210.326 570.05C208.303 571.178 206.117 571.671 204.02 571.456L199.491 570.724L128.11 561.455C125.99 561.171 123.82 561.472 121.831 562.328C119.842 563.184 118.119 564.558 116.855 566.297L109.91 577.955L79.4168 627.881L78.5168 589.669Z" fill="url(#paint0_linear_4345_4)" />
      <path d="M433.656 32.3287L432.164 33.7466L430.557 35.3944C425.048 40.9126 415.254 51.4125 414.681 51.8724L414.107 52.4855L406.914 60.8395L406.302 61.6059C399.034 61.1461 391.765 60.9162 384.381 60.9162C290.761 61.0176 201.005 98.3152 134.805 164.625C68.6061 230.936 31.3709 320.842 31.2696 414.619C31.2696 473.059 50.3981 536.058 78.5169 589.593C84.536 600.936 90.9122 611.806 97.6454 622.204C99.9026 625.653 102.16 629.063 104.493 632.397L87.01 652.209L84.4468 655.122C36.518 595.21 7.55949 522.316 1.28906 445.799C-4.98137 369.282 11.7224 292.634 49.256 225.695C86.7896 158.757 143.44 104.582 211.934 70.1273C280.428 35.6724 357.64 22.5096 433.656 32.3287Z" fill="url(#paint1_linear_4345_4)" />
      <path d="M769.208 414.619C769.296 485.3 749.953 554.641 713.299 615.038C676.645 675.435 624.096 724.556 561.414 757.015C498.731 789.473 428.336 804.016 357.947 799.048C287.559 794.08 219.895 769.793 162.376 728.851L189.844 710.151C214.053 725.982 240.076 738.836 267.353 748.433C320.598 767.136 377.541 772.788 433.415 764.917C489.289 757.046 542.468 735.88 588.497 703.193C634.527 670.505 672.068 627.246 697.978 577.039C723.887 526.832 737.411 471.137 737.416 414.619C737.416 410.787 737.416 406.955 737.416 403.123L755.626 387.794C757.271 386.376 758.993 384.844 760.829 383.157L761.327 382.698L765.879 378.099C767.815 390.183 768.927 402.384 769.208 414.619Z" fill="url(#paint2_linear_4345_4)" />
      <defs>
        <linearGradient id="paint0_linear_4345_4" x1="75.3797" y1="366.12" x2="796.531" y2="366.12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3684D" />
          <stop offset="1" stopColor="#F0855E" />
        </linearGradient>
        <linearGradient id="paint1_linear_4345_4" x1="0.560019" y1="338.265" x2="431.855" y2="338.265" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3684D" />
          <stop offset="1" stopColor="#F0855E" />
        </linearGradient>
        <linearGradient id="paint2_linear_4345_4" x1="159.593" y1="588.442" x2="769.267" y2="588.442" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3684D" />
          <stop offset="1" stopColor="#F0855E" />
        </linearGradient>
      </defs>
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
          <OndlMark />
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
            <OndlMark />
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
