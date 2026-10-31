// Writable attributes per table, taken from the attributes present in production
// (plus the camelCase aliases the adapter maps). Key attributes are set from the
// URL path by each handler and are never read from the body.
export const PRODUCT_FIELDS = [
  "brand", "canonical_slug", "category", "created_at", "featured", "images", "is_active",
  "long_description", "name", "price", "short_description", "slug", "specifications", "updated_at",
  "longDescription", "shortDescription",
];
export const CATEGORY_FIELDS = [
  "created_at", "description", "featured", "image_url", "name", "product_count", "slug", "updated_at",
  "imageUrl", "productCount",
];
export const LAUNCH_FIELDS = [
  "brand", "category", "created_at", "featured", "images", "name", "original_product_id", "price",
  "short_description", "slug", "originalProductId", "shortDescription",
];
export const PRESS_FIELDS = [
  "content_blocks", "cover_images", "created_at", "date", "excerpt", "image_url", "pdf_url", "slug",
  "title", "updated_at", "contentBlocks", "coverImages", "imageUrl", "pdfUrl",
];
export const PROJECT_FIELDS = ["category", "created_at", "featured", "image_position", "image_url", "title", "imageUrl"];
// Users: role changes are deliberately NOT writable here (roles live in Cognito, set only at creation).
export const USER_FIELDS = ["name"];

export const MESSAGE_STATUSES = ["unread", "read"];
