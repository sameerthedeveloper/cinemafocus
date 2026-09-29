/**
 * Supabase-query-builder-compatible shim, backed by the /api/aws/[...path]
 * Next.js proxy (which attaches the httpOnly Cognito ID token server-side and
 * forwards to API Gateway). Lets admin pages keep their existing
 * `supabase.from(table)...` call sites — only the import line changes.
 *
 * Covers exactly the subset of the supabase-js API this codebase uses:
 * select/insert/update/upsert/delete, eq/neq/single/order/range/limit,
 * plus storage.from(bucket).upload()/getPublicUrl() (via /api/upload).
 */

const TABLE_CONFIG = {
  products: { resource: "products", pk: "productId" },
  categories: { resource: "categories", pk: "categoryId" },
  new_launches: { resource: "new-launches", pk: "launchId" },
  press_releases: { resource: "press-releases", pk: "pressId" },
  projects: { resource: "projects", pk: "projectId" },
  messages: { resource: "messages", pk: "messageId" },
  users: { resource: "users", pk: "userId" },
  site_settings: { resource: "site-settings", pk: "settingId" },
  site_content: { resource: "site-settings", pk: "settingId" },
};

const PROXY_BASE = "/api/aws";

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.cfg = TABLE_CONFIG[table];
    this._filters = [];
    this._single = false;
    this._order = null;
    this._range = null;
    this._limit = null;
    this._op = "select";
    this._payload = null;
  }

  select(_cols, opts) { this._selectOpts = opts; return this; }
  eq(field, value) { this._filters.push(["eq", field, value]); return this; }
  neq(field, value) { this._filters.push(["neq", field, value]); return this; }
  in(field, values) { this._filters.push(["in", field, values]); return this; }
  single() { this._single = true; return this; }
  order(field, opts = {}) { this._order = { field, ascending: opts.ascending !== false }; return this; }
  range(from, to) { this._range = [from, to]; return this; }
  limit(n) { this._limit = n; return this; }
  insert(obj) { this._op = "insert"; this._payload = obj; return this; }
  update(obj) { this._op = "update"; this._payload = obj; return this; }
  upsert(obj) { this._op = "upsert"; this._payload = obj; return this; }
  delete() { this._op = "delete"; return this; }

  _idFilter() {
    const f = this._filters.find(([type, field]) => type === "eq" && field === "id");
    return f ? f[2] : undefined;
  }

  _applyFilters(data) {
    let result = data;
    this._filters.forEach(([type, field, value]) => {
      if (field === "id" && (type === "eq" || type === "in")) return; // already resolved via path param(s)
      if (type === "eq") result = result.filter((item) => item[field] === value);
      else if (type === "neq") result = result.filter((item) => item[field] !== value);
      else if (type === "in") result = result.filter((item) => value.includes(item[field]));
    });
    return result;
  }

  _toWire(obj) {
    if (!obj || !this.cfg) return obj;
    const { id, ...rest } = obj;
    return id !== undefined ? { ...rest, [this.cfg.pk]: id } : rest;
  }

  _fromWire(item) {
    if (!item || typeof item !== "object" || !this.cfg) return item;
    const { [this.cfg.pk]: pkVal, ...rest } = item;
    return pkVal !== undefined ? { id: pkVal, ...rest } : item;
  }

  async _safeJson(res) {
    try { return await res.json(); } catch { return null; }
  }

  _wrap(res, data, forceError = false) {
    if (!res.ok || forceError) {
      return { data: null, error: { message: (data && data.error) || res.statusText, status: res.status } };
    }
    return { data, error: null };
  }

  async _oneWrite(method, targetId, payload) {
    const url = targetId !== undefined
      ? `${PROXY_BASE}/${this.cfg.resource}/${targetId}`
      : `${PROXY_BASE}/${this.cfg.resource}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this._toWire(payload)),
    });
    const data = await this._safeJson(res);
    return { res, data: this._fromWire(data) };
  }

  async _exec() {
    const cfg = this.cfg;
    if (!cfg) throw new Error(`queryClient: unknown table "${this.table}"`);
    const id = this._idFilter();

    if (this._op === "delete") {
      if (id !== undefined) {
        const res = await fetch(`${PROXY_BASE}/${cfg.resource}/${id}`, { method: "DELETE" });
        return this._wrap(res, null);
      }

      // No direct id target (e.g. `.delete().neq('id', sentinel)` — "delete
      // everything" pattern). Fetch the full list, apply the same filters a
      // select would, then delete each matching row individually.
      const listRes = await fetch(`${PROXY_BASE}/${cfg.resource}`);
      let toDelete = await this._safeJson(listRes) || [];
      toDelete = this._applyFilters(toDelete);

      let lastRes = listRes;
      for (const item of toDelete) {
        const rowId = item[cfg.pk] ?? item.id;
        lastRes = await fetch(`${PROXY_BASE}/${cfg.resource}/${rowId}`, { method: "DELETE" });
      }
      return this._wrap(lastRes, null);
    }

    if (this._op === "insert" || this._op === "upsert") {
      const items = Array.isArray(this._payload) ? this._payload : [this._payload];
      const results = await Promise.all(items.map((item) => {
        const targetId = this._op === "upsert" ? item.id : undefined;
        return this._oneWrite(targetId !== undefined ? "PUT" : "POST", targetId, item);
      }));
      const failed = results.find(({ res }) => !res.ok);
      if (failed) return this._wrap(failed.res, failed.data, true);
      const data = Array.isArray(this._payload) ? results.map((r) => r.data) : results[0].data;
      return this._wrap(results[0].res, data);
    }

    if (this._op === "update") {
      const { res, data } = await this._oneWrite("PUT", id, this._payload);
      return this._wrap(res, data);
    }

    // select
    const inIdFilter = this._filters.find(([type, field]) => type === "in" && field === "id");

    let res, data;
    if (inIdFilter) {
      // No bulk-list endpoint for some resources (e.g. site-settings is
      // per-id only) — fetch each id individually instead of listing+filtering.
      const results = await Promise.all(inIdFilter[2].map((rowId) =>
        fetch(`${PROXY_BASE}/${cfg.resource}/${rowId}`).then(async (r) => ({ res: r, data: await this._safeJson(r) }))
      ));
      res = results[0]?.res;
      data = results.filter((r) => r.res.ok && r.data).map((r) => r.data);
    } else {
      const url = id !== undefined
        ? `${PROXY_BASE}/${cfg.resource}/${id}`
        : `${PROXY_BASE}/${cfg.resource}`;
      res = await fetch(url);
      data = await this._safeJson(res);
    }

    if (Array.isArray(data)) {
      data = this._applyFilters(data);
      if (this._order) {
        const { field, ascending } = this._order;
        data = [...data].sort((a, b) => {
          if (a[field] === b[field]) return 0;
          return (a[field] > b[field] ? 1 : -1) * (ascending ? 1 : -1);
        });
      }
      if (this._range) data = data.slice(this._range[0], this._range[1] + 1);
      if (this._limit) data = data.slice(0, this._limit);
      data = data.map((item) => this._fromWire(item));
    } else {
      data = this._fromWire(data);
    }

    if (this._selectOpts?.head) {
      // count-only query (e.g. .select('*', { count: 'exact', head: true }))
      return { data: null, error: null, count: Array.isArray(data) ? data.length : 0 };
    }

    if (this._single) {
      const item = Array.isArray(data) ? data[0] : data;
      return this._wrap(res, item || null, !item);
    }
    return this._wrap(res, data);
  }

  then(onResolve, onReject) {
    return this._exec().then(onResolve, onReject);
  }
}

// Uploads go through the server-side /api/upload route (Sharp -> WebP -> S3 via a
// presigned URL). That avoids needing CORS on the bucket, and the stored object
// is renamed (<timestamp>_<name>.webp), so remember the real URL for each
// requested path: callers do `upload(path)` then `getPublicUrl(path)`.
const uploadedUrls = new Map();

function uploadType(path) {
  if (/(^|\/)hero/i.test(path)) return "hero";
  if (/thumb/i.test(path)) return "thumbnail";
  return "product";
}

function storageClient() {
  return {
    from() {
      return {
        async upload(path, file) {
          const form = new FormData();
          form.append("file", file);
          form.append("type", uploadType(path));
          form.append("folder", path.split("/").slice(0, -1).join("/") || "uploads");

          const res = await fetch("/api/upload", { method: "POST", body: form });
          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.publicUrl) {
            return { data: null, error: { message: data?.error || "Upload failed" } };
          }

          uploadedUrls.set(path, data.publicUrl);
          return { data: { path, publicUrl: data.publicUrl }, error: null };
        },
        getPublicUrl(path) {
          return { data: { publicUrl: uploadedUrls.get(path) || `https://${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${path}` } };
        },
      };
    },
  };
}

function authClient() {
  return {
    async getSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json().catch(() => ({ user: null }));
      return { data: { session: data.user ? { user: data.user } : null }, error: null };
    },
    // No live push channel exists for httpOnly-cookie sessions (unlike the
    // Supabase browser SDK's local session store) — proxy.js middleware
    // still enforces route access on every navigation regardless, so this
    // is a one-time no-op subscription rather than a live listener.
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signOut() {
      await fetch("/api/auth/logout", { method: "POST" });
      return { error: null };
    },
  };
}

async function rpcClient(fnName, params) {
  if (fnName === "increment_stat") {
    const res = await fetch(`${PROXY_BASE}/stats/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: params?.d }),
    });
    const data = await res.json().catch(() => null);
    return { data, error: res.ok ? null : { message: data?.error } };
  }
  throw new Error(`queryClient: unsupported rpc "${fnName}"`);
}

export function createClient() {
  return {
    from: (table) => new QueryBuilder(table),
    storage: storageClient(),
    auth: authClient(),
    rpc: rpcClient,
  };
}

export function createPublicClient() {
  return createClient();
}
