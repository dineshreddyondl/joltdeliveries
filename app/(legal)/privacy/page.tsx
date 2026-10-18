import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy — JOLT",
  description:
    "How JOLT collects, uses, and protects the information you share with us.",
};

/* DRAFT legal copy — founder to finalize (Brief 08). */
export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="2026-10-18">
      <p>
        This policy explains what information JOLT (ONDL Network Private
        Limited) collects on this website and how it is used. This is a
        lead-generation website: we do not process orders or payments here.
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li>
          <strong>Serviceability checks:</strong> pickup/delivery pincodes and
          shipment weight you submit.
        </li>
        <li>
          <strong>Pilot requests:</strong> name, work email, phone, company,
          lanes, volume, and payload class you submit.
        </li>
        <li>
          <strong>Technical data:</strong> standard server logs (IP address,
          browser type) used for security and site reliability.
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To answer your serviceability and pilot requests.</li>
        <li>
          To call you back — your number is used only for that callback. No
          spam, no marketing lists without your consent.
        </li>
        <li>To improve the site and protect it from abuse.</li>
      </ul>

      <h2>3. WhatsApp</h2>
      <p>
        When you use a WhatsApp link on this site, the conversation happens
        in WhatsApp. WhatsApp&rsquo;s own privacy policy applies to those
        messages.
      </p>

      <h2>4. Sharing</h2>
      <p>
        We do not sell your data. Data is shared only with service providers
        that help us run the site (e.g. hosting, form processing), under
        confidentiality obligations.
      </p>

      <h2>5. Retention & rights</h2>
      <p>
        Lead data is retained only as long as needed to serve the request and
        our business records. You may request access, correction, or deletion
        by writing to{" "}
        <a href="mailto:support@ondl.in">support@ondl.in</a>.
      </p>

      <h2>6. Contact</h2>
      <p>
        Privacy queries: <a href="mailto:support@ondl.in">support@ondl.in</a>.
      </p>
    </LegalShell>
  );
}
