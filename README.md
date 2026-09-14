# Schemeforge

A focused, local-first miniature paint planner. Schemeforge turns a colour idea into a repeatable process: group recipes into schemes, attach exact catalogue paints to ordered steps, and see what is missing from your shelf.

## Highlights

- One workspace for schemes, recipes, steps, paint selection and inventory
- 3,701 paints from nine popular miniature-paint brands
- Search by paint, range, brand or product code
- CIEDE2000 perceptual nearest-colour matching
- Mix ratios, thinning notes, optional steps and custom techniques
- Missing-paint indicators directly on recipe cards
- Duplicate and reorder recipes; reorder painting steps
- Undo after deleting a recipe
- Import Schemeforge exports and 40k Companion v1/v2 backups
- Export a portable JSON backup
- Responsive keyboard-accessible interface
- No account, backend, tracking or cookies; data stays in localStorage

## Development

```bash
npm install
npm run dev
npm run build
```

Set `VITE_BASE=/repository-name/` when building for a GitHub Pages project path. The included deployment workflow derives this automatically from the repository name.

## Data and attribution

The paint catalogue was generated from [Arcturus5404/miniature-paints](https://github.com/Arcturus5404/miniature-paints), an MIT-licensed community dataset. Paint colours are approximations for planning and matching; screen, lighting, paint batch and finish affect the real result.

Schemeforge is an unofficial hobby tool and is not affiliated with or endorsed by Games Workshop or any paint manufacturer. Product names and trademarks belong to their respective owners.

## Privacy

The complete workspace is stored in the browser's localStorage. Use **Export** to back it up before clearing browser data or changing devices.

## License

MIT
