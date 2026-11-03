# Duplicate product candidates (for you to confirm in the CMS)

Nothing here was auto-resolved. Generated from the live product list (180 rows, 169 active) on 2026-10-10, comparing name, brand, category, price, specs, descriptions, and an md5 of each image file.

## How to resolve a duplicate

In Admin > Products > Edit, under **Search & Indexing**:

- **Canonical Product Slug** = slug of the page that should survive. The duplicate then 308-redirects there, drops out of the sitemap and `llms-full.txt`, and nothing links to it in schema.
- or tick **Hide from search engines** to keep the page reachable but un-indexed (no redirect).

Before pointing a duplicate at its canonical, copy over any better images / specs / description from the duplicate, because the duplicate stops being visible.

Policy used for the recommendations: prefer the `atc-` prefixed rows (brand in the title, cleaner naming, mostly newer) unless the other row is clearly the richer listing.

## Pairs

| # | Candidate duplicate | Compared with | Verdict | Recommended canonical |
|---|---|---|---|---|
| 1 | `audio-vector-qr-5-copy` ("Audio Vector QR Sub") | `audio-vector-qr-5` ("Audio Vector QR 5") | **Not a duplicate by name.** 3 of its 3 images are byte-identical to QR 5's, so it looks like a copied row that was renamed. Different name, different specs. | None. Fix the slug/images instead (e.g. slug `audio-vector-qr-sub`, own photos). Until then consider `seo_noindex`. |
| 2 | `cda2-mk2-cd-dac-pre-amplifier-2` | `cda2-mk2-cd-dac-pre-amplifier` | **Duplicate.** Same name, brand, category, identical specs; its single image is also in the other row (which has 2). | `cda2-mk2-cd-dac-pre-amplifier` |
| 3 | `p4-2` ("P4", brand "ACT PRO", category `act-pro`) | `p4` ("P4", ATC, `atc`) | **Duplicate.** Same name; "ACT PRO" looks like a typo for ATC; 1 image shared. `act-pro` has no brand page (see data issues). | `p4` |
| 4 | `scm25a-pro-mk2` ("SCM25A Pro Mk2", "ACT PRO", 5 images) | `atc-scm-25a-pro-mk2` (featured, 1 image, short description 36 chars) | **Same product.** No image overlap (different photos). | `atc-scm-25a-pro-mk2`, after moving the 4 extra images + fuller description across |
| 5 | `scm12-pro` ("SCM12 Pro", 6 images) | `atc-scm-12i-pro` ("ATC SCM 12i Pro") | **Probable duplicate, low confidence.** Model names differ ("12" vs "12i"). Confirm against the manufacturer's range before merging. | `atc-scm-12i-pro` if they are the same model, otherwise keep both |
| 6 | `scm200asl-pro` | `atc-scm-200a-sl-pro` | **`scm200asl-pro` does not exist in the DB.** The matching row is `atc-scm200asl-pro` ("ATC SCM200ASL PRO", 3 images, 1 shared with the other). `scm200aslt` ("SCM200ASLT") is a different model, keep it. | `atc-scm200asl-pro` (richer) or `atc-scm-200a-sl-pro` (cleaner slug). Pick one and redirect the other. Your call. |
| 7 | `scm100asl-pro` ("SCM100ASL Pro", 6 images, "ACT PRO") | `atc-scm-100a-sl-pro` (featured, 4 images) | **Same product.** No image overlap. | `atc-scm-100a-sl-pro` |
| 8 | `atc-hts40` | `hts40-on-wall-speaker` | **Name mismatch, not a clean duplicate.** `atc-hts40` is titled **"SCM7"** but has HTS40 images and slug. Either the title or the slug is wrong. | Fix the title first. If it really is the HTS40, canonical = `hts40-on-wall-speaker` |
| 9 | `c4-sub-mk2-12-subwoofer` ("C4 Sub Mk2 \| 12\" SUBWOOFER") | `atc-c4-sub-mk2` | **Same product.** No image overlap. | `atc-c4-sub-mk2` (copy the 12" subwoofer wording into its description first) |

## Keep as variants (as instructed)

`lumin-l2-4tb` and `lumin-l2-8tb`: different capacities (different prices, 11 images each). Not flagged.

## Extra findings while comparing

- **`wandla` / `wandla-2`**: same brand and name, likely duplicate. Not in your list.
- **Brand label typos**: 4 products in category `atc` and 4 in `act-pro` carry brand text **"ACT PRO"**. Other near-duplicates in brand text: "Hifi Rose" / "Hifirose", "ORBID AUDIO" / "ORBID SOUND" / "Stereo Line" (all category `stereo-line`).
- **Products whose category has no brand row** (their `/brand/<slug>` page now returns 404, the product pages still work):
  - `beyond-line`: khidur-, nandur-, terius-, maridur-, palum-high-end-speakers
  - `act-pro`: scs70-pro, p2-pro-dual-mono-power-amplifier, p4-2, p1-pro-dual-mono-power-amplifier
- **`aune-audio`** brand exists with 0 active products: page now `noindex`, excluded from sitemap.
- 117 of 180 products have `short_description` identical to `long_description` (thin/duplicated copy).
- 112 of 180 products have no price (fine, "Call for price"). The 68 priced ones look inconsistent (e.g. SCM12i Pro 2,400, SCM25A Pro Mk2 8,200, SCM200A SL Pro 32,000 vs LUMIN 382,000): likely mixed currencies. This is why schema emits **no `offers`** unless you tick "Price is verified INR" per product.
