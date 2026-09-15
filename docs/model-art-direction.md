# SchemeForge model art direction

This document is the source of truth for all model-map illustrations.

## Target style

- Premium monochrome grimdark miniature concept art.
- Full-body, three-quarter frontal pose with believable anatomy and weight.
- Heavy, layered science-fiction armour with an original silhouette.
- Confident ink linework, varied line weight and restrained internal hatching.
- High material readability: armour, trim, cloth, leather, weapons, bone and lenses remain visually distinct.
- An isolated catalogue-style presentation without scenery, typography, logos or watermarks.
- Enough negative space between weapons and the body for unambiguous placement markers.

The first approved visual reference is `public/models/chaos-legionary.webp`.

## Approved model library

- `chaos-legionary.webp` — baseline legionary
- `dark-apostle.webp` — armoured preacher
- `chaos-cultist.webp` — human-scale cultist
- `terror-warrior.webp` — clawed terror specialist
- `possessed.webp` — armour fused with controlled mutation
- `chaos-terminator.webp` — massive heavy veteran
- `space-marine.webp` — loyalist power-armoured line warrior
- `astra-militarum.webp` — human trench infantry
- `ork-raider.webp` — hulking alien scrap-raider
- `necron-warrior.webp` — ancient skeletal machine
- `tyranid-warrior.webp` — chitinous swarm creature

New artwork should feel like another plate from this same illustrated field guide. Reuse the baseline image as the generation style reference; vary silhouette, pose, equipment and material balance to fit the archetype.

## Originality boundary

Reference photos may be used to understand the broad visual language of a miniature category, but output must not trace or reproduce a commercial miniature. Change the pose, proportions, armour construction, helmet, weapons and arrangement of details. Do not use faction insignia, named symbols or exact proprietary patterns.

## Production prompt template

> Create an original, professional full-body line-art illustration of a grimdark [MODEL ARCHETYPE]. Use believable anatomy, a strong readable silhouette, heavy layered science-fiction or fantasy construction, crisp varied line weight and restrained hatching. Keep armour, trim, cloth, leather, weapons, bone, skin and lenses visually separable. Use an isolated three-quarter frontal catalogue pose. No text, logo, watermark, scenery, named faction iconography, exact commercial miniature design or copied pose.

Add model-specific characteristics after `[MODEL ARCHETYPE]`, while preserving the originality boundary.

## Avoid

- Geometric placeholder shapes or clip-art anatomy.
- Chibi, cartoon or toy-like proportions.
- Exact outlines of reference miniatures.
- Excessive background detail.
- Painterly edges that make placement ambiguous.
- A weapon crossing the torso when it obscures major recipe areas.
- So much ornament that armour and trim cannot be distinguished.

## App treatment

- Source artwork is stored as an optimized WebP asset.
- Recipe placement is represented by responsive percentage-based markers over the artwork.
- Multiple markers may point to repeated areas such as armour panels or bone trophies.
- Artwork remains neutral monochrome; markers and recipe swatches carry interactive colour.
