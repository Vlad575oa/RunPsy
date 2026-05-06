export const ADMIN_COOKIE = "runpsy_admin_session";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

type Payload = { exp: number };

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "default-dev-secret-change-me";
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64urlEncode(buf: ArrayBuffer | Buffer): string {
  return Buffer.from(buf as ArrayBuffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecodeToBuffer(str: string): Buffer {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

export async function createAdminSession(): Promise<string> {
  const payload: Payload = { exp: Date.now() + TTL_MS };
  const payloadStr = b64urlEncode(Buffer.from(JSON.stringify(payload)));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadStr));
  const sigStr = b64urlEncode(sig);
  return `${payloadStr}.${sigStr}`;
}

export async function verifyAdminSession(token: string): Promise<Payload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, sigStr] = parts;
    const key = await getKey();
    const sigBuf = b64urlDecodeToBuffer(sigStr);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf.buffer.slice(sigBuf.byteOffset, sigBuf.byteOffset + sigBuf.byteLength) as ArrayBuffer,
      new TextEncoder().encode(payloadStr)
    );
    if (!valid) return null;
    const payload: Payload = JSON.parse(
      b64urlDecodeToBuffer(payloadStr).toString("utf-8")
    );
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
