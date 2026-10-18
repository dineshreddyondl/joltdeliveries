import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./legal-shell.module.css";

/**
 * Shared chrome for legal pages (Brief 08). Server component.
 * COPY STATUS: all legal copy is a DRAFT for founder review — final
 * ToS/Privacy/SLA wording must be confirmed by Dinesh before go-live.
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.main}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.back}>
          ← Back to JOLT
        </Link>
        <h1 className={styles.h1}>{title}</h1>
        <p className={styles.updated}>Last updated: {updated}</p>
        <div className={styles.body}>{children}</div>
      </div>
    </main>
  );
}
