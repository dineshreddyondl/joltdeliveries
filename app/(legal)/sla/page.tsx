import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "SLA Policy — JOLT",
  description:
    "JOLT's service-level commitment: definition, methodology, and the money-back remedy for guaranteed-TAT lanes.",
};

/* DRAFT legal copy — founder to finalize (Brief 08). */
export default function SlaPage() {
  return (
    <LegalShell title="SLA Policy" updated="2026-10-18">
      <p>
        JOLT commits to an arrival window on every active, serviceable lane.
        This page defines exactly what we guarantee, how we measure it, and
        what happens if we miss.
      </p>

      <h2 id="definition">Definition</h2>
      <p>
        <strong>SLA adherence</strong> is the percentage of shipments that
        arrive at the committed delivery window on an active, serviceable
        JOLT lane.
      </p>

      <h2 id="methodology">Methodology</h2>
      <p>Adherence is measured as:</p>
      <ul>
        <li>
          <strong>Window:</strong> rolling 90-day period, across all live,
          serviceable routes.
        </li>
        <li>
          <strong>Numerator:</strong> shipments delivered within their
          committed arrival window.
        </li>
        <li>
          <strong>Denominator:</strong> all shipments dispatched on active,
          serviceable routes in the same window.
        </li>
      </ul>
      <p>
        The committed window is printed on every booking. Pilot SLA
        guarantees apply strictly to active, serviceable routes and are
        subject to payload specifications.
      </p>

      <h2 id="remedy">Money-back remedy</h2>
      <p>
        <strong>
          If we miss the guaranteed TAT on a shipment covered by a valid
          pilot agreement, that shipment is free.
        </strong>{" "}
        The remedy is applied as a full credit or refund of the freight
        charges for the missed shipment, issued within 14 business days of a
        verified miss.
      </p>

      <h2 id="exclusions">Exclusions</h2>
      <ul>
        <li>
          Loading and unloading time, and delays caused by the shipper,
          consignee, or third parties outside JOLT&rsquo;s control.
        </li>
        <li>Weather events and force majeure.</li>
        <li>
          Shipments outside active, serviceable routes or outside the
          payload specifications of the pilot agreement.
        </li>
      </ul>

      <h2 id="refunds">Refund policy</h2>
      <p>
        Refunds follow the money-back remedy above. Disputed TAT misses are
        reviewed against tracking milestones within 7 business days. Contact{" "}
        <a href="mailto:support@ondl.in">support@ondl.in</a> to raise a claim.
      </p>
    </LegalShell>
  );
}
