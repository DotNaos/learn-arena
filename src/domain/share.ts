import { serializePayload } from "./export";
import type { Payload } from "./payload";

/** Content that can be shared via a link: a single test or a whole plan. */
export type Shareable =
  | { kind: "test"; payload: Payload }
  | { kind: "plan"; title: string; tests: Payload[] };

/**
 * Canonical JSON for a shareable. A plan is serialized as `{ title, tests }`
 * so the receiver's importer recognizes it as a plan; a test uses the same
 * serialization as the downloadable question set. The server hashes this exact
 * string, so the same content always yields the same share link.
 */
export function serializeShareable(shareable: Shareable): string {
  if (shareable.kind === "plan") {
    return JSON.stringify(
      {
        title: shareable.title,
        tests: shareable.tests.map(
          (payload) => JSON.parse(serializePayload(payload)) as unknown,
        ),
      },
      null,
      2,
    );
  }
  return serializePayload(shareable.payload);
}

export function shareUrl(hash: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/share/${hash}`;
}

export async function createShare(
  content: string,
): Promise<{ hash: string; existed: boolean }> {
  const response = await fetch("/api/share", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("share-create-failed");
  }
  return (await response.json()) as { hash: string; existed: boolean };
}

export async function fetchShare(hash: string): Promise<string> {
  const response = await fetch(`/api/share?hash=${encodeURIComponent(hash)}`);
  if (!response.ok) {
    throw new Error(
      response.status === 404 ? "share-not-found" : "share-fetch-failed",
    );
  }
  return response.text();
}

const SHARE_PATH_RE = /^\/share\/([a-f0-9]{64})\/?$/;

/** Extract the content hash from a `/share/<hash>` pathname, or null. */
export function parseShareHash(pathname: string): string | null {
  const match = SHARE_PATH_RE.exec(pathname);
  return match ? match[1] : null;
}
