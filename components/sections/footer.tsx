import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { WHATSAPP_NUMBER } from "@/components/serviceability/serviceability-checker";
import { cn } from "@/lib/utils";
import styles from "./footer.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

/**
 * Footer — Brief 08 · frozen v5 port with zero dead anchors.
 * - Product links point at real on-page sections.
 * - Legal links point at real routes (/tos, /privacy, /sla).
 * - Company: Contact → WhatsApp deep link (the real channel).
 *   About / Careers / Case Studies dropped — no pages exist and we
 *   don't invent routes (AGENTS.md conventions).
 * - Tagline claim-corrected per uplift §0 #1.
 */
export function Footer() {
  const contactWa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi JOLT! I'd like to talk to the team.",
  )}`;
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <Image
              src="/assets/jolt-logo-dark.svg"
              alt=""
              aria-hidden="true"
              width={34}
              height={34}
              className={styles.mark}
            />
            <div className={cn(sg.className, styles.logo)}>
              JOLT<i>Deliveries</i>
            </div>
          </div>
          <div className={styles.by}>An ONDL Network Platform</div>
          <div className={styles.tagline}>
            India&rsquo;s rail-first express network for 200kg+ B2B.
          </div>
          <div className={styles.support}>
            <a href="mailto:support@ondl.in">support@ondl.in</a> · +91 80194
            61199
          </div>
        </div>

        <div className={styles.cols}>
          <nav aria-label="Product" className={styles.col}>
            <h4>Product</h4>
            <a href="#how">How It Works</a>
            <a href="#eco">Solutions</a>
            <a href="#live-lanes">Route Network</a>
            <a href="#cta">Pilot</a>
          </nav>
          <nav aria-label="Company" className={styles.col}>
            <h4>Company</h4>
            <a href={contactWa} target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </nav>
          <nav aria-label="Legal" className={styles.col}>
            <h4>Legal</h4>
            <a href="/tos">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/sla">SLA Policy</a>
            <a href="/sla#refunds">Refund Policy</a>
          </nav>
        </div>
      </div>
      <div className={styles.bar}>
        &copy; 2026 ONDL Network Private Limited. All rights reserved.
      </div>
    </footer>
  );
}
