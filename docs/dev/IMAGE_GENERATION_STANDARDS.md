# Image Generation Standards

Last updated: 2026-06-25

This document defines the current accepted standard for OpenAI-generated lesson images in the Astro rebuild.

Future Codex sessions must use these standards whenever generating bitmap images for lesson visuals, adverts, posters, concept illustrations or rich learner-facing graphics.

## Current Style Benchmark

The accepted style benchmark is set by these CPU performance starter images:

1. `astro-site/public/images/lessons/cpu-performance/upgrade-advert-ghz-openai.png`
2. `astro-site/public/images/lessons/cpu-performance/upgrade-advert-cores-openai.png`

These are the reference quality for advert-style lesson graphics.

The benchmark qualities are:

1. Modern soft educational advert-card style.
2. Clear rounded card boundary on a pale background.
3. A strong title pill at the top of the image.
4. Large readable headline values or keywords.
5. One short benefit sentence only.
6. Clean illustrative subject matter with enough empty space.
7. A restrained colour theme that supports the concept.
8. No realistic room, desk, living-room, office or stock-photo background.
9. No messy SVG-like geometry or hand-coded-looking shapes.
10. No old-fashioned clipart, fake realism, glossy sci-fi or corporate dashboard feel.

## When To Use OpenAI Images

Use OpenAI image generation by default for rich learner-facing visuals where visual quality and engagement matter.

Good uses include:

1. Advert-style comparison cards.
2. Posters or visual hooks.
3. Concept illustrations.
4. Scenario visuals.
5. Metaphor images.
6. Polished visual summaries.
7. Device, product, interface or object visuals that do not need deterministic geometry.

Use SVG, HTML/CSS or code-native drawing instead when precision matters more than visual richness.

Good code-native uses include:

1. Logic gates.
2. Flow connectors.
3. Exact arrows or vector relationships.
4. Charts with exact data.
5. UI schematics.
6. Diagrams where labels, geometry or alignment must be deterministic.

## Advert-Style Image Rules

Advert-style lesson images must follow this structure unless the user approves a different direction:

1. Use a landscape card composition.
2. Put the advert title in a large top-centred pill.
3. Use a pale white, blue, green or topic-themed card surface.
4. Use one dominant icon or illustrative object.
5. Use one large value or keyword as the main visual anchor.
6. Use only one short supporting sentence inside the image.
7. Keep detail explanations outside the image in the card caption or lesson text.
8. Make A/B comparison images feel like a matched pair with different colour themes.
9. Keep text readable at the actual rendered `ImageCard` width, usually about 300-420 px.
10. Avoid tiny paragraphs, decorative microcopy or fake unreadable UI text.

For CPU-style adverts, the accepted pattern is:

1. Upgrade A: blue/purple theme, speed boost, large GHz value, CPU plus speed/timing visual.
2. Upgrade B: green/teal theme, multitask mode, large core count, CPU plus app-window visual.

## Prompt Requirements

Every OpenAI image prompt for lesson assets should include:

1. The exact asset purpose and lesson context.
2. The target audience: GCSE learners, usually aged 14 to 16.
3. The style target: modern raster digital illustration for an educational website.
4. The required composition and hierarchy.
5. Exact text, if text is needed.
6. A strict avoid list.
7. A readability requirement at rendered card size.

Use language like:

```text
Modern raster digital illustration for a GCSE computer science lesson website.
Soft polished educational advert-card style.
No realistic room, desk, classroom photo, home office or stock-photo background.
No messy SVG look, old-fashioned clipart, pseudo-real vector realism, glossy sci-fi, fake brand logos or watermark.
Text must be spelled exactly and remain readable at about 400 px wide.
Use only the requested text. Do not add fake small writing.
```

## Text Inside Generated Images

Text inside generated images is allowed only when it is short, large and essential to the visual.

Allowed:

1. Advert title.
2. Main value, such as `3.8 GHz`.
3. Short label, such as `SPEED BOOST`.
4. One short benefit sentence.

Avoid:

1. Long explanations.
2. Multiple paragraphs.
3. Tiny labels.
4. Fake UI text.
5. Dense annotations.
6. Duplicating the slide title or card caption.

If generated text is misspelled, distorted, clipped, too small or cluttered, reject the image and regenerate. Do not manually accept it because the surrounding page text is correct.

## File And Asset Rules

1. Generated images must be copied into `astro-site/public/images/lessons/[lesson-slug]/` before being referenced.
2. Do not reference files directly from `C:\Users\Max\.codex\generated_images\`.
3. Use stable descriptive filenames, such as `upgrade-advert-ghz-openai.png`.
4. Keep originals in the Codex generated-images cache unless the user explicitly asks to delete them.
5. Do not overwrite existing assets unless the user explicitly asks for replacement.
6. Use `ImageCard` for generated lesson graphics unless a better accepted visual card exists.
7. Keep teaching explanations as real HTML text in captions or surrounding cards where practical.
8. Provide useful alt text that describes the educational meaning of the image.

## QA Acceptance Checklist

Before presenting or committing an OpenAI-generated lesson image:

1. Inspect the raw generated image visually.
2. Check all text spelling and readability.
3. Check for extra fake text, watermarks, logos or visual artefacts.
4. Copy the accepted image into the project.
5. Render the lesson page using the project route.
6. Capture and review desktop, tablet and mobile screenshots.
7. Confirm the image works at actual card size.
8. Confirm it does not overpower the slide or fight the surrounding captions.
9. Confirm the style matches the accepted benchmark images.
10. Fix artefacts or regenerate before calling the image complete.

If screenshot review fails, try another approach rather than marking the task complete.

## Common Failure Modes

Reject or revise images that show:

1. Living-room, home-office or adult lifestyle settings when a clean lesson graphic is needed.
2. Glossy sci-fi CPU artwork.
3. Pseudo-realistic vectors pretending to be 3D.
4. Old-fashioned clipart.
5. Messy hand-authored SVG feel.
6. Too much tiny text.
7. Misspelled labels.
8. Black or dark edge artefacts.
9. Cropped title pills or cut-off borders.
10. Overcrowded compositions.
11. Low-contrast text.
12. Designs that look like adult business dashboards rather than GCSE learning resources.

## Prompt Template

```text
Use case: scientific-educational
Asset type: GCSE computer science lesson [advert card / concept image / visual hook]
Primary request: Create [specific image purpose].
Audience: GCSE learners aged 14 to 16.
Style/medium: Modern raster digital illustration for an educational website; soft polished educational card style.
Scene/backdrop: Clean pale card background only; no realistic room, desk, classroom photo, home office or stock-photo background.
Subject: [main subject and visual metaphor].
Composition/framing: Landscape card composition, strong hierarchy, generous spacing, readable at about 400 px wide.
Color palette: [topic colour theme].
Text (verbatim): "[exact text]"
Constraints: Use only the requested text; all text must be spelled exactly; no tiny fake writing; no logos; no watermark.
Avoid: messy SVG look, old-fashioned clipart, pseudo-real vector realism, glossy sci-fi, corporate dashboard feel, clutter, cropped borders.
```
