/**
 * Dispatch schedule — the git-committed source of truth for "next dispatch"
 * until the ops API provides live data.
 *
 * FOUNDER TABLE — fill real values below. Every row currently carries
 * PLACEHOLDER times (⚠️); `nextDispatch()` marks its output `verified: false`
 * until the founder confirms a row, so the UI can show an honest tag.
 *
 * Rules implemented:
 * - All times IST, 24h "HH:MM".
 * - Before cutoff → dispatch today.
 * - After cutoff → next serviceable day (frequency + exceptions honoured).
 */

export interface LaneSchedule {
  /** Display route, e.g. "HYD → BLR". */
  route: string;
  /** Last booking time (IST, HH:MM). */
  cutoff: string;
  /** Linehaul departure (IST, HH:MM). */
  dispatch: string;
  /** Service days. */
  frequency: "daily" | "weekdays" | "mon-sat";
  /** No-service dates, ISO YYYY-MM-DD. */
  exceptions?: string[];
  /** True once the founder confirms the row's times. */
  verified: boolean;
}

export const DISPATCH_SCHEDULE: LaneSchedule[] = [
  {
    route: "HYD → BLR",
    cutoff: "21:00",
    dispatch: "21:30",
    frequency: "daily",
    exceptions: [],
    verified: false, // ⚠️ PLACEHOLDER — founder to confirm
  },
  {
    route: "DEL → BOM",
    cutoff: "21:00",
    dispatch: "21:30",
    frequency: "daily",
    exceptions: [],
    verified: false, // ⚠️ PLACEHOLDER — founder to confirm
  },
  {
    route: "BLR → HYD",
    cutoff: "21:00",
    dispatch: "21:30",
    frequency: "daily",
    exceptions: [],
    verified: false, // ⚠️ PLACEHOLDER — founder to confirm
  },
];

/* ------------------------------ computation ------------------------------ */

const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function istParts(date: Date): { ymd: string; dow: string; mins: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0; // en-CA can emit 24
  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    dow: get("weekday"),
    mins: hour * 60 + Number(get("minute")),
  };
}

function isServiceDay(schedule: LaneSchedule, dow: string, ymd: string): boolean {
  if (schedule.exceptions?.includes(ymd)) return false;
  if (schedule.frequency === "daily") return true;
  if (schedule.frequency === "weekdays") return dow !== "Sun" && dow !== "Sat";
  if (schedule.frequency === "mon-sat") return dow !== "Sun";
  return true;
}

function addDays(ymd: string, days: number): { ymd: string; dow: string } {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return {
    ymd: `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`,
    dow: WEEKDAYS[dt.getUTCDay()],
  };
}

export interface DispatchAnswer {
  route: string;
  /** "today" | "tomorrow" | weekday name for later days. */
  when: string;
  cutoff: string;
  dispatch: string;
  label: string;
  verified: boolean;
}

export function nextDispatch(route: string, now: Date = new Date()): DispatchAnswer {
  const schedule = DISPATCH_SCHEDULE.find(
    (s) => s.route.toLowerCase() === route.toLowerCase(),
  );
  const nowP = istParts(now);
  if (!schedule) {
    return {
      route,
      when: "—",
      cutoff: "—",
      dispatch: "—",
      label: "Schedule not published for this lane yet",
      verified: false,
    };
  }

  const cutoffMin = toMin(schedule.cutoff);

  // After today's cutoff, the next opportunity starts tomorrow.
  let hop = nowP.mins >= cutoffMin ? 1 : 0;
  let { ymd, dow } = addDays(nowP.ymd, hop);

  // Skip no-service days.
  while (!isServiceDay(schedule, dow, ymd)) {
    hop += 1;
    const next = addDays(nowP.ymd, hop);
    ymd = next.ymd;
    dow = next.dow;
  }

  const dayLabel = hop === 0 ? "today" : hop === 1 ? "tomorrow" : dow;
  const short = dayLabel === "today" ? "TODAY" : dayLabel.toUpperCase();
  return {
    route: schedule.route,
    when: dayLabel,
    cutoff: schedule.cutoff,
    dispatch: schedule.dispatch,
    label:
      hop === 0
        ? `CUTOFF ${schedule.cutoff} IST · NEXT DISPATCH TODAY ${schedule.dispatch}`
        : `CUTOFF PASSED · NEXT DISPATCH ${short} ${schedule.dispatch} IST`,
    verified: schedule.verified,
  };
}
