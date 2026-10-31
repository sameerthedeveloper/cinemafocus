import { ValidationError } from "./aws/validators.js";

const bad = (message) => new ValidationError(message);

// Keys that must never be copied from a client-supplied object.
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Copies only allowlisted keys from a client body. Unknown keys are dropped
 * silently so extra fields sent by the admin UI (e.g. `id`) don't break saves,
 * but they can never reach DynamoDB.
 */
export function pick(body, allowed) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw bad("Request body must be a JSON object");
  const out = {};
  for (const key of allowed) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

export function str(value, field, { min = 0, max, required = false } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) throw bad(`${field} is required`);
    return undefined;
  }
  if (typeof value !== "string") throw bad(`${field} must be a string`);
  const v = value.trim();
  if (v.length < Math.max(min, required ? 1 : 0)) throw bad(`${field} is too short`);
  if (max && v.length > max) throw bad(`${field} must be at most ${max} characters`);
  return v;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export function email(value, field = "email", { required = true } = {}) {
  const v = str(value, field, { max: 254, required });
  if (v !== undefined && !EMAIL_RE.test(v)) throw bad(`${field} must be a valid email`);
  return v;
}

export function oneOf(value, allowed, field) {
  if (!allowed.includes(value)) throw bad(`${field} must be one of: ${allowed.join(", ")}`);
  return value;
}

// DynamoDB items cap at 400 KB; stay well under it for any admin-written record.
const MAX_ITEM_BYTES = 200 * 1024;
export function assertItemSize(item) {
  if (Buffer.byteLength(JSON.stringify(item), "utf8") > MAX_ITEM_BYTES) throw bad("Record is too large");
  return item;
}

// Path ids must be plain identifiers/slugs, never a rate-limit key or arbitrary string.
export function pathId(value, field) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw bad(`${field} is invalid`);
  return value;
}
