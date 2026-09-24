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
      // Deterministic mock — clearly flagged, replaced by the real backend.
      const { originPin, destPin, weightKg } = parsed.data;
      const zoneDelta = Math.abs(Number(originPin[0]) - Number(destPin[0]));
      const serviceable = zoneDelta <= 3 && weightKg <= 500;
      return Response.json({
        ok: true,
        mock: true,
        serviceable,
        lane: `${originPin} → ${destPin}`,
        eta: serviceable ? "Next-day" : null,
        tatHours: serviceable ? 26 : null,
      });
    }

    const data = await proxyToJolt("/serviceability", parsed.data);
    return Response.json({ ok: true, ...(data as object) });
  } catch (error) {
    return apiError(error);
  }
}
