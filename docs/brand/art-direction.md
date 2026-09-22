# Lustique Co. — Art Direction

Guidance for photography, crops and grading so new images drop into the site
without a redesign. Everything here is enforced or supported by tokens and
utilities in `src/styles/tokens.css` and `src/styles/components.css`.

## Ratios

| Context | Ratio | Utility / selector |
| --- | --- | --- |
| Portraits, cards, gallery | `4:5` | `.card__media`, `.gallery-item` |
| Wide bands / feature strips | `16:9` | `.band` |
| Hero | fills the band, `object-fit: cover` | `.hero__media img` |
| Square details / collage | `1:1` (with one tall `1:2`) | `.collage` |

Never letterbox a portrait into a band or vice-versa — recrop, do not squash.

## Grading

- Warm, low-contrast, filmic. Lift the shadows slightly; do not crush to black.
- Skin tones stay true — no heavy orange/teal split.
- Keep a consistent white balance across a gallery set so tiles read as one
  collection.
- Prefer natural window light and soft falloff over hard studio flash.

## Subject & sequencing

- Detail over only finished faces: hands, flowers, veils, the dress, a mirror,
  candid in-between moments. Not every frame needs a face.
- Lead with the most restrained, most "looked-after" frame as the hero.
- Show the morning as it happens — calm, unhurried, one bride at a time.

## Placeholders

- While photography is pending, keep the `Monogram` placeholder. It is honest
  and consistent. Never substitute stock photography, and never fabricate a
  bride, review or venue.
- When real photos land, they wire in automatically via `src/content/gallery.ts`
  and `src/content/artists.ts` — no markup changes.

## Brand mark on photography

- Two assets are installed in `public/assets/`:
  - `logo.svg` — the crisp vector monogram, used for the small header mark
    (`Logo variant="emblem"`). It stays sharp at any size/DPI.
  - `lustique-logo.jpeg` — the photographic emblem + wordmark lockup, used for
    the larger `variant="full"` placements (footer, dashboard, sign-in). It is a
    compressed, white-ground, low-resolution raster, so it is never used small.
- On dark or burgundy surfaces the mark sits on an ivory plate
  (`.logo--on-dark`) — never white on dark.
- A transparent, high-resolution lockup export remains the ideal: dropping one
  in at `public/assets/lustique-logo.jpeg` (same filenames) needs no markup
  change, and would let the header use the real emblem again.

## Tone of imagery

- Quiet, warm, considered. The visual equivalent of the copy: no urgency, no
  exclamation, no "sale" energy.