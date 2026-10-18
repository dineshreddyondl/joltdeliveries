import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service — JOLT",
  description:
    "Terms governing use of the JOLT website and logistics services.",
};

/* DRAFT legal copy — founder to finalize (Brief 08). */
export default function TosPage() {
  return (
    <LegalShell title="Terms of Service" updated="2026-10-18">
      <p>
        These terms govern your use of the JOLT website and the logistics
        services offered by ONDL Network Private Limited (&ldquo;JOLT&rdquo;,
        &ldquo;we&rdquo;). By using this site or engaging our services, you
        agree to these terms.
      </p>

      <h2>1. The service</h2>
      <p>
        JOLT provides rail-first express logistics for heavy shipments (200kg+
        B2B and D2C heavy delivery): first-mile pickup, linehaul on scheduled
        express trains, and last-mile delivery with an SLA commitment on
        active, serviceable lanes.
      </p>

      <h2>2. Quotes and pilots</h2>
      <p>
        Quotes and estimates shown on this site are indicative. Final pricing
        is confirmed in a written agreement. Pilot engagements are governed by
        the pilot agreement and the{" "}
        <a href="/sla">SLA policy</a>, including the money-back remedy.
      </p>

      <h2>3. User conduct</h2>
      <p>
        You agree to provide accurate information when using our forms and
        checkers, and not to misuse, reverse-engineer, or disrupt the site.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        All site content, branding, and design belong to JOLT / ONDL Network
        Private Limited and may not be reproduced without permission.
      </p>

      <h2>5. Liability</h2>
      <p>
        To the extent permitted by law, JOLT is not liable for indirect or
        consequential losses arising from use of this site. Our freight
        liability is defined in the applicable shipping agreement.
      </p>

      <h2>6. Governing law</h2>
      <p>
        These terms are governed by the laws of India, with jurisdiction in
        Hyderabad, Telangana.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions: <a href="mailto:support@ondl.in">support@ondl.in</a> · +91
        80194 61199.
      </p>
    </LegalShell>
  );
}
