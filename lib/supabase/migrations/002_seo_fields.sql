-- SEO fields (additive, nullable / defaulted). Only needed if the legacy Supabase
-- schema is still in use. The live AWS/DynamoDB backend is schemaless: these are plain
-- optional attributes written by the admin forms, no migration required there.

alter table products
  add column if not exists canonical_slug text,
  add column if not exists seo_noindex boolean default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists price_verified boolean default false;

alter table categories
  add column if not exists seo_noindex boolean default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

alter table press_releases
  add column if not exists seo_title text,
  add column if not exists seo_description text;
