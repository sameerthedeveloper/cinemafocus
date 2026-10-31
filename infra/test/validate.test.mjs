import test from "node:test";
import assert from "node:assert/strict";
import { validateUpload, MAX_BYTES } from "../handlers/upload.js";
import { pick, str, email, oneOf, assertItemSize } from "../lib/validate.js";
import { parseBody } from "../lib/http.js";
import { errorResponse } from "../lib/aws/authz.js";
import { RateLimitError } from "../lib/aws/ratelimit.js";
import * as schemas from "../lib/schemas.js";

const ok = { folder: "products/brand-x", fileName: "My Photo.webp", contentType: "image/webp", size: 1000 };
const rejects = (fn, re = /./) => assert.throws(fn, (e) => e.statusCode >= 400 && re.test(e.message));

test("upload: valid request builds a safe key", () => {
  const r = validateUpload(ok);
  assert.match(r.key, /^products\/brand-x\/\d+_My_Photo\.webp$/);
});
test("upload: rejects path traversal and bad folders", () => {
  for (const folder of ["../etc", "products/../../x", "/", "secret", "products/a b", "products//..", "uploads/%2e%2e"]) {
    rejects(() => validateUpload({ ...ok, folder }));
  }
});
test("upload: rejects html, svg and non-image types", () => {
  for (const [fileName, contentType] of [["a.html", "text/html"], ["a.svg", "image/svg+xml"], ["a.js", "application/javascript"], ["a.png", "application/octet-stream"]]) {
    rejects(() => validateUpload({ ...ok, fileName, contentType }));
  }
});
test("upload: extension must match the content type", () => {
  rejects(() => validateUpload({ ...ok, fileName: "a.html", contentType: "image/png" }), /extension/);
  rejects(() => validateUpload({ ...ok, fileName: "noext", contentType: "image/png" }), /extension/);
});
test("upload: size limits enforced", () => {
  for (const size of [0, -1, 1.5, "10", MAX_BYTES + 1, undefined]) rejects(() => validateUpload({ ...ok, size }), /size/);
  assert.doesNotThrow(() => validateUpload({ ...ok, size: MAX_BYTES }));
});
test("upload: hostile file names are neutralised", () => {
  const r = validateUpload({ ...ok, fileName: "..//..\\evil<script>.png", contentType: "image/png" });
  assert.match(r.key, /^products\/brand-x\/\d+_[A-Za-z0-9_.-]+\.png$/);
  assert.ok(!r.key.includes(".."));
});

test("pick: drops unknown and prototype keys, rejects non-objects", () => {
  const body = JSON.parse('{"name":"x","role":"admin","__proto__":{"polluted":1},"constructor":1}');
  assert.deepEqual(pick(body, ["name", "__proto__"]), { name: "x" });
  rejects(() => pick([], ["a"]));
  rejects(() => pick(null, ["a"]));
});
test("users: role is not an editable field", () => {
  assert.deepEqual(schemas.USER_FIELDS, ["name"]);
  assert.deepEqual(pick({ name: "n", role: "admin", email: "x@y.z", userId: "other" }, schemas.USER_FIELDS), { name: "n" });
});
test("str / email / oneOf", () => {
  assert.equal(str("  hi ", "f", { required: true }), "hi");
  rejects(() => str("x".repeat(11), "f", { max: 10 }));
  rejects(() => str(5, "f"));
  rejects(() => str("", "f", { required: true }));
  assert.equal(email("a@b.co"), "a@b.co");
  rejects(() => email("not-an-email"));
  rejects(() => oneOf("deleted", schemas.MESSAGE_STATUSES, "status"));
  assert.equal(oneOf("read", schemas.MESSAGE_STATUSES, "status"), "read");
});
test("item size cap", () => {
  rejects(() => assertItemSize({ a: "x".repeat(300 * 1024) }), /large/);
});
test("parseBody: invalid JSON is a 400, oversized is a 413", () => {
  rejects(() => parseBody({ body: "{nope" }), /JSON/);
  assert.throws(() => parseBody({ body: JSON.stringify({ a: "x".repeat(300 * 1024) }) }), (e) => e.statusCode === 413);
  assert.deepEqual(parseBody({}), {});
});
test("errorResponse: 429 carries Retry-After and 4xx keeps its message", () => {
  const r = errorResponse(new RateLimitError(42));
  assert.equal(r.statusCode, 429);
  assert.equal(r.headers["Retry-After"], "42");
  assert.equal(errorResponse(Object.assign(new Error("bad"), { statusCode: 400 })).statusCode, 400);
});
