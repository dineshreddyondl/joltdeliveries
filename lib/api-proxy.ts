/**
 * API configuration + proxy helper.
 *
 * Route Handlers proxy to the JOLT backend. When JOLT_API_MOCK is true
 * (or unset), handlers serve deterministic mock responses and make no
 * external network calls — safe for design/dev.
 */

export type ApiConfig = {
  baseUrl: string;
  apiKey: string;
  mock: boolean;
};

export function getApiConfig(): ApiConfig {
  return {
    baseUrl: process.env.JOLT_API_BASE_URL ?? "",
    apiKey: process.env.JOLT_API_KEY ?? "",
    // Mock by default until a real backend URL is configured.
    mock: process.env.JOLT_API_MOCK !== "false",
  };
}

export class JoltApiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

/** Thin proxy: POST payload to `${baseUrl}${path}` */
export async function proxyToJolt(path: string, payload: unknown): Promise<unknown> {
  const cfg = getApiConfig();
  if (!cfg.baseUrl) {
    throw new JoltApiError("JOLT_API_BASE_URL is not configured");
  }
  const res = await fetch(`${cfg.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new JoltApiError(`JOLT backend responded ${res.status}`, res.status);
  }
  return res.json();
}

/** Uniform error response shape for all API routes */
export function apiError(error: unknown) {
  if (error instanceof JoltApiError) {
    return Response.json(
      { ok: false, error: error.message },
      { status: error.status },
    );
  }
  return Response.json(
    { ok: false, error: "Something went wrong. Try again." },
    { status: 500 },
  );
}
