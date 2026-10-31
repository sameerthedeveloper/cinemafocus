import { ValidationError } from "./aws/validators.js";

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// Admin records are a few KB; 256 KB leaves room for long press/product content.
const MAX_BODY_BYTES = 256 * 1024;

export function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    throw Object.assign(new ValidationError("Request body is too large"), { statusCode: 413 });
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}
