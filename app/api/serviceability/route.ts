import { apiError, getApiConfig, proxyToJolt } from "@/lib/api-proxy";
import { serviceabilitySchema } from "@/lib/validation";

/**
 * POST /api/serviceability
 * Check if a heavy shipment lane is serviceable.
 * Body: { originPin, destPin, weightKg }
 */
export async function POST(req: Request) {
  try {
    const parsed = serviceabilitySchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { mock } = getApiConfig();
    if (mock) {
      // Deterministic mock — replace with a git-committed pincode list when
      // real coverage data lands. Zone rule: first digit 1–6 = network zone.
      const { originPin, destPin, weightKg } = parsed.data;
      const originServed = Number(originPin[0]) <= 6;
      const destServed = Number(destPin[0]) <= 6;
      const status =
        originServed && destServed
          ? "served"
          : originServed || destServed
            ? "partial"
            : "not-served";
      const zoneDelta = Math.abs(Number(originPin[0]) - Number(destPin[0]));
      const served = status === "served";
      const perKgInr = served ? 6 + zoneDelta : null;
      const rateBandInr =
        served && perKgInr !== null
          ? [Math.round(perKgInr * 0.9 * weightKg), Math.round(perKgInr * 1.15 * weightKg)]
          : null;
      return Response.json({
        ok: true,
        mock: true,
        status,
        originPin,
        destPin,
        originServed,
        destServed,
        eta: served ? "24–48h" : null,
        tatHours: served ? 26 : null,
        ratePerKgInr: perKgInr,
        rateBandInr,
      });
    }

    const data = await proxyToJolt("/serviceability", parsed.data);
    return Response.json({ ok: true, ...(data as object) });
  } catch (error) {
    return apiError(error);
  }
}
