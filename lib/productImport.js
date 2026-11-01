// Turns the JSON inside an import ZIP into the shape the admin importer expects, and works out
// which image file in the ZIP belongs to which product. Pure functions: no network, no DOM.

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export const baseName = (path) => String(path).split('?')[0].split('/').pop().trim();
export const isImageFile = (name) => IMAGE_EXT.test(name);
export const isRemoteUrl = (ref) => /^https?:\/\//i.test(ref);

export function mimeFor(name) {
  const ext = name.split('.').pop().toLowerCase();
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' }[ext] || 'application/octet-stream';
}

/** Choose the products file: products.json first, else the shallowest .json in the ZIP. */
export function pickProductsFile(entries) {
  const jsons = entries.filter((e) => /\.json$/i.test(e.name));
  if (jsons.length === 0) return null;
  const byName = jsons.find((e) => baseName(e.name).toLowerCase() === 'products.json');
  if (byName) return byName;
  return [...jsons].sort((a, b) => a.name.split('/').length - b.name.split('/').length)[0];
}

/** Accepts [..], { products: [..] } and the store-export shape ({ category, products }). */
export function productsFromJson(data) {
  const list = Array.isArray(data) ? data : data?.products;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('The JSON must be a list of products, or an object with a "products" list.');
  }
  return list;
}

const refOf = (img) => (typeof img === 'string' ? img : img?.url || img?.key || img?.src || img?.path || '');

/** Map the importer's field names and the store-export names onto one shape. */
export function normalizeProduct(p) {
  const specs = p.specifications || p.specs || [];
  return {
    ...p,
    id: p.id || p.slug,
    name: p.name || p.title,
    category: p.category || p.categorySlug,
    price: Number(p.price ?? (p.pricePaise != null ? p.pricePaise / 100 : 0)),
    shortDescription: p.shortDescription || p.short_description || '',
    longDescription: p.longDescription || p.long_description || p.description || '',
    specifications: specs.map((s) => ({ key: s.key ?? s.label, value: s.value })).filter((s) => s.key && s.value),
    imageRefs: (p.images || []).map(refOf).filter(Boolean),
  };
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Which ZIP files are this product's images?
 * 1. Explicit references in the JSON, matched by file name (folders are ignored).
 * 2. If none of those exist, files named <slug>.jpg, <slug>-1.jpg, <slug>_2.png ... in numeric order.
 * Returns { urls, files, missing }: URLs already online stay as they are.
 */
export function matchImages(product, zipImages) {
  const byName = new Map();
  for (const f of zipImages) byName.set(baseName(f.name).toLowerCase(), f);

  const urls = [];
  const files = [];
  const missing = [];

  for (const ref of product.imageRefs) {
    if (isRemoteUrl(ref)) {
      urls.push(ref);
      continue;
    }
    const hit = byName.get(baseName(ref).toLowerCase());
    if (hit) files.push(hit);
    else missing.push(ref);
  }

  // Nothing referenced was found (or nothing was referenced): fall back to slug-named files
  if (files.length === 0 && urls.length === 0 && product.slug) {
    const rx = new RegExp(`^${escapeRegex(product.slug.toLowerCase())}(?:[-_ ]?(\\d+))?\\.(?:jpe?g|png|webp|gif|avif)$`);
    const found = [];
    for (const [name, f] of byName) {
      const m = name.match(rx);
      if (m) found.push({ f, n: m[1] === undefined ? -1 : Number(m[1]) });
    }
    found.sort((a, b) => a.n - b.n);
    files.push(...found.map((x) => x.f));
  }

  return { urls, files, missing };
}
