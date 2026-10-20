import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { WHATSAPP_NUMBER } from "@/components/serviceability/serviceability-checker";
import { cn } from "@/lib/utils";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

/**
 * Footer — Aceternity "simple footer with four grids" (founder reference
 * 2026-10-20), themed to JOLT: dark #08080A with hairline borders, brand
 * column + four link columns, bottom copyright bar. Real links only —
 * no dead anchors, no invented social profiles or routes (AGENTS.md).
 */

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const contactWa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi JOLT! I'd like to talk to the team.",
)}`;

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how" },
      { label: "Solutions", href: "#eco" },
      { label: "Route Network", href: "#live-lanes" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Pilot", href: "/pilot" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "Contact", href: contactWa, external: true }],
  },
  {
    title: "Support",
    links: [
      { label: "support@ondl.in", href: "mailto:support@ondl.in" },
      { label: "+91 80194 61199", href: "tel:+918019461199" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/tos" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "SLA Policy", href: "/sla" },
      { label: "Refund Policy", href: "/sla#refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#08080A]">
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* ---------- brand column ---------- */}
          <div className="flex w-full max-w-sm flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/jolt-logo-dark.svg"
                alt=""
                aria-hidden="true"
                width={34}
                height={34}
                className="shrink-0"
              />
              <div className={cn(sg.className, "text-[20px] text-white")}>
                JOLT<i className="not-italic text-[#E85A2C]">Deliveries</i>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#878B80]">
              An ONDL Network Platform
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-[#8B8B90]">
              India&rsquo;s rail-first express network for 200kg+ B2B.
            </p>
          </div>

          {/* ---------- four link grids ---------- */}
          <div className="grid w-full max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className="flex flex-col items-start gap-3"
              >
                <h3
                  className={cn(
                    "text-[13px] font-semibold",
                    col.title === "Product"
                      ? "text-white"
                      : "text-[#E8E8EA]/70",
                  )}
                >
                  {col.title}
                </h3>
                <div className="flex flex-col items-start gap-2">
                  {col.links.map((link) =>
                    link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-[#8B8B90] transition-colors duration-200 hover:text-[#E8E8EA]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className={cn(
                          "text-[13px] transition-colors duration-200",
                          col.title === "Support"
                            ? "text-[#F0A070] hover:text-[#FFC4A3]"
                            : "text-[#8B8B90] hover:text-[#E8E8EA]",
                        )}
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              </nav>
            ))}
          </div>
        </div>

        {/* ---------- bottom bar ---------- */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] py-8 sm:flex-row">
          <span className="text-[12px] text-[#878B80]">
            &copy; 2026 ONDL Network Private Limited. All rights reserved.
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#878B80]">
            Next Train Out · 24–48 hr arrivals
          </span>
        </div>
      </div>
    </footer>
  );
}
