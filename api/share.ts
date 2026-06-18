import { createHash } from "node:crypto";
import { BlobNotFoundError, get, head, put } from "@vercel/blob";

// Content-addressed share storage.
//
// A shared test/plan is stored at `shares/<sha256>.json`. The pathname IS the
// content hash, so identical content always maps to the same blob — uploading
// the same test twice is a no-op, and opening the same link twice never
// re-uploads. There is deliberately no listing endpoint: a share is only
// reachable by whoever knows its hash.

const HASH_RE = /^[a-f0-9]{64}$/;
// Vercel Functions cap request bodies at 4.5 MB; tests are tiny JSON anyway.
const MAX_CONTENT_BYTES = 4_000_000;

function pathFor(hash: string): string {
  return `shares/${hash}.json`;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Create (or dedup to) a share for the posted content.
async function createShare(request: Request): Promise<Response> {
  let body: { content?: unknown };
  try {
    body = (await request.json()) as { content?: unknown };
  } catch {
    return json({ error: "invalid-json" }, 400);
  }

  const content = typeof body.content === "string" ? body.content : null;
  if (!content || content.length === 0 || content.length > MAX_CONTENT_BYTES) {
    return json({ error: "invalid-content" }, 400);
  }

  const hash = createHash("sha256").update(content).digest("hex");
  const pathname = pathFor(hash);

  // Dedup: if this exact content was already shared, reuse it without re-upload.
  try {
    await head(pathname);
    return json({ hash, existed: true });
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) {
      return json({ error: "head-failed" }, 500);
    }
  }

  await put(pathname, content, {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 31536000,
  });

  return json({ hash, existed: false });
}

// Return the shared content for a given hash, or 404.
async function readShare(request: Request): Promise<Response> {
  const hash = new URL(request.url).searchParams.get("hash") ?? "";
  if (!HASH_RE.test(hash)) {
    return json({ error: "invalid-hash" }, 400);
  }

  let blob: Awaited<ReturnType<typeof get>>;
  try {
    blob = await get(pathFor(hash), { access: "private" });
  } catch (error) {
    if (error instanceof BlobNotFoundError) return json({ error: "not-found" }, 404);
    return json({ error: "head-failed" }, 500);
  }

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return json({ error: "not-found" }, 404);
  }

  return new Response(blob.stream, {
    status: 200,
    headers: {
      "content-type": blob.blob.contentType ?? "application/json; charset=utf-8",
      // Content-addressed, so the response never changes for a given hash.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "POST") return createShare(request);
    if (request.method === "GET") return readShare(request);
    return json({ error: "method-not-allowed" }, 405);
  },
};
