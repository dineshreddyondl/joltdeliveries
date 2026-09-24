import { apiError, getApiConfig, proxyToJolt } from "@/lib/api-proxy";
import { pilotSchema } from "@/lib/validation";

/**
 * POST /api/pilot
 * Submit a pilot request ("Give us your worst lane").
 * Body: { name, company, email, phone, origin, destination, notes? }
 */
export async function POST(req: Request) {
  try {
    const parsed = pilotSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { mock } = getApiConfig();
    if (mock) {
      return Response.json({
        ok: true,
        mock: true,
        reference: `JLT-${Date.now().toString(36).toUpperCase()}`,
        message: "Pilot request received. Our team will reach out within 24 hours.",
      });
    }

    const data = await proxyToJolt("/pilot", parsed.data);
    return Response.json({ ok: true, ...(data as object) });
  } catch (error) {
    return apiError(error);
  }
}
