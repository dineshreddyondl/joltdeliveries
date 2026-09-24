import { apiError, getApiConfig, proxyToJolt } from "@/lib/api-proxy";
import { estimateSchema } from "@/lib/validation";

/**
 * POST /api/estimate
 * Rough price estimate for a heavy-commerce lane.
 * Body: { originPin, destPin, weightKg, volumeCft? }
 */
export async function POST(req: Request) {
  try {
    const parsed = estimateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { mock } = getApiConfig();
    if (mock) {
      // Deterministic mock — clearly flagged, replaced by the real backend.
      const { originPin, destPin, weightKg, volumeCft } = parsed.data;
      const zoneDelta = Math.abs(Number(originPin[0]) - Number(destPin[0]));
      const base = 400 + zoneDelta * 150 + weightKg * 8 + (volumeCft ?? 0) * 20;
      return Response.json({
        ok: true,
        mock: true,
        estimateInr: Math.round(base),
        eta: "Next-day",
        validForHours: 24,
      });
    }

    const data = await proxyToJolt("/estimate", parsed.data);
    return Response.json({ ok: true, ...(data as object) });
  } catch (error) {
    return apiError(error);
  }
}
