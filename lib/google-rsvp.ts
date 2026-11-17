type AppsScriptResponse = {
  success?: boolean;
  name?: string;
  saved?: boolean;
  error?: string;
};

function getConfig() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim();

  if (!url || !secret) {
    throw new Error("Google RSVP integration is not configured.");
  }

  if (!url.startsWith("https://script.google.com/") || !url.endsWith("/exec")) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL must be the deployed /exec URL.");
  }

  return { url, secret };
}

export async function callWeddingSheet(
  input: Record<string, string>,
): Promise<AppsScriptResponse> {
  const { url, secret } = getConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...input, secret }),
    redirect: "follow",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google RSVP service returned ${response.status}.`);
  }

  const result = (await response.json()) as AppsScriptResponse;
  return result;
}
