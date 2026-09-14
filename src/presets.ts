import type { Paint, PaintRef, Recipe, RecipeStep, Scheme } from './types'

type PaintMix = [code: string, parts?: number]
type StepTemplate = { techniqueId: string; paints: PaintMix[]; notes?: string; optional?: boolean }
type RecipeTemplate = { name: string; part: string; notes?: string; steps: StepTemplate[] }

export interface SchemePreset {
  id: string
  name: string
  modelId?: string
  category: 'Material library' | 'Chaos Space Marines'
  description: string
  source: 'Squidmar video' | 'Derived from Squidmar method'
  recipes: RecipeTemplate[]
}

const recipe = (name: string, part: string, steps: StepTemplate[], notes?: string): RecipeTemplate => ({ name, part, steps, notes })
const step = (techniqueId: string, paints: PaintMix[], notes?: string, optional = false): StepTemplate => ({ techniqueId, paints, notes, optional })

export const SCHEME_PRESETS: SchemePreset[] = [
  {
    id: 'squidmar-materials', name: 'Squidmar material recipes', category: 'Material library', source: 'Squidmar video',
    description: 'Reusable recipes transcribed from Squidmar’s guide to the Essential, Dark Future and Fantasy sets.',
    recipes: [
      recipe('Warm light skin', 'Skin', [step('basecoat', [['70.814', 1], ['70.845', 1]], 'Shadow mix'), step('layer', [['70.845', 2], ['70.814', 1]], 'Increase Sunny Skin Tone over successive layers'), step('layer', [['70.845']], 'Leave the darker mix visible in the recesses'), step('edge-highlight', [['70.928']], 'Small final highlights')]),
      recipe('Dark skin', 'Skin', [step('basecoat', [['70.771']], 'Keep this over the largest area'), step('layer', [['72.044']], 'Warm midtone'), step('layer', [['70.845']], 'Restrained highlight; keep the highlight area small')]),
      recipe('NMM gold', 'Gold', [step('basecoat', [['70.771']]), step('layer', [['72.042']], 'Apply clean; do not mix into the shadow'), step('layer', [['72.042', 2], ['70.858', 1]], 'Build through roughly three progressively brighter mixes'), step('edge-highlight', [['70.858']]), step('glaze', [['72.006']], 'Very thin final glaze for a richer warm gold')]),
      recipe('Vibrant NMM steel', 'Steel', [step('basecoat', [['70.898']]), step('layer', [['70.898', 1], ['70.986', 1]], 'Midtone'), step('layer', [['70.986', 2], ['70.858', 1]], 'Add more Ice Yellow as the reflections tighten'), step('edge-highlight', [['70.858']], 'Smallest, brightest reflections')]),
      recipe('True metallic steel', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]], 'Grimdark highlight'), step('edge-highlight', [['72.052']], 'Optional brighter finish', true)]),
      recipe('True metallic gold', 'Gold', [step('basecoat', [['72.060']]), step('layer', [['72.060', 1], ['72.056', 1]], 'Blend between shadow and highlight'), step('edge-highlight', [['72.056']], 'Keep the final highlight gold rather than silver')]),
      recipe('Horns, bone and teeth', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.771', 1], ['70.923', 1]], 'Grey-brown transition'), step('layer', [['70.923', 2], ['70.845', 1]]), step('edge-highlight', [['70.918']], 'Final tip and sharpest edges')]),
      recipe('Warm leather', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']]), step('airbrush', [['72.093']], 'Optional warm filter from below', true)]),
      recipe('Vibrant red', 'Red', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('layer', [['72.106', 2], ['72.009', 1]], 'Warm highlight'), step('edge-highlight', [['72.106', 2], ['70.928', 1]], 'Final punch; reduce orange for a colder red')]),
      recipe('Turquoise blue', 'Blue', [step('basecoat', [['70.898']]), step('layer', [['72.024']]), step('layer', [['70.808']]), step('edge-highlight', [['70.858']], 'Tiny final accents')]),
    ],
  },
  {
    id: 'csm-word-bearers', name: 'Word Bearers warband', modelId: 'chaos-legionary', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Deep crimson armour, cold steel trim, parchment and ritual details using only the three owned sets.',
    recipes: [
      recipe('Crimson power armour', 'Armour', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('edge-highlight', [['72.106', 2], ['70.928', 1]], 'Fine upper edges'), step('glaze', [['70.812']], 'Thin into selected shadows for a colder, richer crimson', true)]),
      recipe('Cold steel trim', 'Trim', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('edge-highlight', [['72.052']])]),
      recipe('Parchment and scripture', 'Parchment', [step('basecoat', [['70.771', 1], ['70.986', 1]]), step('layer', [['70.986']]), step('edge-highlight', [['70.918']]), step('detail', [['70.950']], 'Thin lines for script')]),
      recipe('Horns and trophies', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.771', 1], ['70.923', 1]]), step('layer', [['70.923', 2], ['70.845', 1]]), step('edge-highlight', [['70.918']])]),
      recipe('Daemon glow', 'Eyes & runes', [step('basecoat', [['70.898']]), step('layer', [['72.024']]), step('edge-highlight', [['70.808']]), step('detail', [['70.858']], 'Small point of light')]),
    ],
  },
  {
    id: 'csm-night-lords', name: 'Nemesis Claw · Night Lords', modelId: 'terror-warrior', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Cold midnight armour, bright steel and warm trophies tailored to the Nemesis Claw aesthetic.',
    recipes: [
      recipe('Midnight blue armour', 'Armour', [step('basecoat', [['70.898']]), step('layer', [['70.898', 3], ['72.024', 1]], 'Broad upper volumes'), step('layer', [['72.024']]), step('edge-highlight', [['70.808']]), step('detail', [['70.858']], 'Sparse brightest corners')]),
      recipe('Steel trim and weapons', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('edge-highlight', [['72.052']])]),
      recipe('Flayed trophies', 'Skin', [step('basecoat', [['70.814', 1], ['72.099', 1]], 'Pale shadow mix'), step('layer', [['72.099']]), step('edge-highlight', [['70.928']]), step('glaze', [['72.083']], 'Extremely thin around cuts and stretched edges', true)]),
      recipe('Leather and straps', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']])]),
      recipe('Red lenses', 'Eyes', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('detail', [['72.009']]), step('detail', [['70.928']], 'Tiny reflection point')]),
    ],
  },
  {
    id: 'csm-black-legion', name: 'Black Legion strike force', modelId: 'chaos-terminator', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Controlled black armour, warm gold trim and vivid red details with a compact shared palette.',
    recipes: [
      recipe('Black power armour', 'Armour', [step('basecoat', [['70.950']]), step('layer', [['70.950', 4], ['70.986', 1]], 'Selective upper volumes'), step('edge-highlight', [['70.950', 1], ['70.986', 1]], 'Keep lines thin'), step('detail', [['70.986']], 'Only the sharpest corners', true)]),
      recipe('Warm gold trim', 'Trim', [step('basecoat', [['72.060']]), step('layer', [['72.060', 1], ['72.056', 1]]), step('edge-highlight', [['72.056']])]),
      recipe('Steel weapons', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('edge-highlight', [['72.052']])]),
      recipe('Red cloth and details', 'Cloth', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('edge-highlight', [['72.106', 2], ['70.928', 1]])]),
      recipe('Horns and bone', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.771', 1], ['70.923', 1]]), step('layer', [['70.923', 2], ['70.845', 1]]), step('edge-highlight', [['70.918']])]),
    ],
  },
  {
    id: 'csm-dark-apostle', name: 'Dark Apostle', modelId: 'dark-apostle', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Black and crimson ritual armour with aged parchment, warm leather and vivid arcane details.',
    recipes: [
      recipe('Black ritual armour', 'Armour', [step('basecoat', [['70.950']]), step('layer', [['70.950', 4], ['70.986', 1]]), step('edge-highlight', [['70.986']], 'Only the sharpest upper edges')]),
      recipe('Crimson robes', 'Cloth', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('edge-highlight', [['72.106', 2], ['70.928', 1]])]),
      recipe('Ancient gold trim', 'Trim', [step('basecoat', [['72.060']]), step('layer', [['72.060', 1], ['72.056', 1]]), step('edge-highlight', [['72.056']])]),
      recipe('Parchment and pages', 'Parchment', [step('basecoat', [['70.771', 1], ['70.986', 1]]), step('layer', [['70.986']]), step('edge-highlight', [['70.918']]), step('detail', [['70.950']], 'Thin scripture lines')]),
      recipe('Relics and horns', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.923']]), step('edge-highlight', [['70.918']])]),
      recipe('Leather book and straps', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']])]),
      recipe('Warp-lit eyes', 'Eyes & runes', [step('basecoat', [['70.898']]), step('layer', [['72.024']]), step('detail', [['70.858']])]),
    ],
  },
  {
    id: 'csm-chaos-cultist', name: 'Chaos Cultist', modelId: 'chaos-cultist', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Worn industrial cloth, pale skin and battered metal for a fast but expressive rank-and-file scheme.',
    recipes: [
      recipe('Pale weathered skin', 'Skin', [step('basecoat', [['70.814', 1], ['70.845', 1]]), step('layer', [['70.845']]), step('edge-highlight', [['70.928']])]),
      recipe('Dusty work clothes', 'Cloth', [step('basecoat', [['70.771']]), step('layer', [['70.923']]), step('edge-highlight', [['70.986']])]),
      recipe('Battered armour plates', 'Armour', [step('basecoat', [['70.950']]), step('stipple', [['70.986']], 'Irregular chips and worn edges'), step('detail', [['72.054']], 'Small metallic chips', true)]),
      recipe('Rust-dark weapons', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('glaze', [['72.042']], 'Thin warm rust staining', true)]),
      recipe('Old leather', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']])]),
      recipe('Mask and trophies', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.923']]), step('edge-highlight', [['70.918']])]),
    ],
  },
  {
    id: 'csm-terror-warrior', name: 'Terror Warrior', modelId: 'terror-warrior', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Predatory midnight armour, cold claws and unsettling pale trophies built for the original terror-warrior artwork.',
    recipes: [
      recipe('Midnight armour', 'Armour', [step('basecoat', [['70.898']]), step('layer', [['70.898', 3], ['72.024', 1]]), step('edge-highlight', [['70.808']])]),
      recipe('Cold steel claws', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('edge-highlight', [['72.052']])]),
      recipe('Flayed trophies', 'Skin', [step('basecoat', [['70.814', 1], ['72.099', 1]]), step('layer', [['72.099']]), step('edge-highlight', [['70.928']]), step('glaze', [['72.083']], 'Very thin around torn edges', true)]),
      recipe('Leather webbing', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']])]),
      recipe('Bone trophies', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.923']]), step('edge-highlight', [['70.918']])]),
      recipe('Red visor', 'Eyes', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('detail', [['70.928']])]),
    ],
  },
  {
    id: 'csm-possessed', name: 'Possessed Warrior', modelId: 'possessed', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Dark armour split by raw daemonic flesh, ivory growths and a restrained crimson accent.',
    recipes: [
      recipe('Blackened armour', 'Armour', [step('basecoat', [['70.950']]), step('layer', [['70.950', 4], ['70.986', 1]]), step('edge-highlight', [['70.986']])]),
      recipe('Daemonic flesh', 'Skin', [step('basecoat', [['72.011', 1], ['70.814', 1]]), step('layer', [['72.099']]), step('edge-highlight', [['70.928']]), step('glaze', [['72.083']], 'Deepen joins between flesh and armour')]),
      recipe('Horn and bone growths', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.923', 2], ['70.845', 1]]), step('edge-highlight', [['70.918']])]),
      recipe('Dark crimson cloth', 'Cloth', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('edge-highlight', [['72.106', 2], ['70.928', 1]])]),
      recipe('Corrupted trim', 'Trim', [step('basecoat', [['72.060']]), step('layer', [['72.060', 1], ['72.056', 1]]), step('edge-highlight', [['72.056']])]),
      recipe('Sickly eyes', 'Eyes', [step('basecoat', [['72.024']]), step('layer', [['70.808']]), step('detail', [['70.858']])]),
    ],
  },
  {
    id: 'csm-chaos-terminator', name: 'Chaos Terminator', modelId: 'chaos-terminator', category: 'Chaos Space Marines', source: 'Derived from Squidmar method',
    description: 'Heavy black plate, rich gold trim and brutal steel weapons for an imposing veteran.',
    recipes: [
      recipe('Obsidian heavy armour', 'Armour', [step('basecoat', [['70.950']]), step('layer', [['70.950', 4], ['70.986', 1]]), step('edge-highlight', [['70.986']], 'Keep most plates near black')]),
      recipe('Warm gold trim', 'Trim', [step('basecoat', [['72.060']]), step('layer', [['72.060', 1], ['72.056', 1]]), step('edge-highlight', [['72.056']])]),
      recipe('Heavy weapons', 'Metal', [step('basecoat', [['72.054']]), step('layer', [['72.054', 4], ['72.052', 1]]), step('edge-highlight', [['72.052']])]),
      recipe('Tattered crimson cloth', 'Cloth', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('edge-highlight', [['72.106', 2], ['70.928', 1]])]),
      recipe('Leather grips and pouches', 'Leather', [step('basecoat', [['72.044']]), step('layer', [['72.042']]), step('edge-highlight', [['70.845']])]),
      recipe('Bone trophies', 'Bone', [step('basecoat', [['70.771']]), step('layer', [['70.923']]), step('edge-highlight', [['70.918']])]),
      recipe('Red eye lenses', 'Eyes', [step('basecoat', [['72.011']]), step('layer', [['72.106']]), step('detail', [['70.928']])]),
    ],
  },
]

export function instantiatePreset(preset: SchemePreset, paints: Paint[]): { scheme: Scheme; recipes: Recipe[]; paintIds: string[] } {
  const byCode = new Map(paints.filter((paint) => paint.code).map((paint) => [paint.code!, paint]))
  const createdAt = new Date().toISOString()
  const schemeId = crypto.randomUUID()
  const refs = new Set<string>()
  const makePaintRef = ([code, ratioParts = 1]: PaintMix): PaintRef => {
    const paint = byCode.get(code)
    if (!paint) return { brand: 'Vallejo', name: `Vallejo ${code}`, code, ratioParts }
    refs.add(paint.id)
    return { paintId: paint.id, brand: paint.brand, range: paint.range, name: paint.name, code: paint.code, ratioParts }
  }
  const recipes = preset.recipes.map((item, index): Recipe => ({
    id: crypto.randomUUID(), slug: `${preset.id}-${index + 1}`, name: item.name, schemeId, part: item.part, notes: item.notes,
    steps: item.steps.map((value): RecipeStep => ({ id: crypto.randomUUID(), techniqueId: value.techniqueId, paints: value.paints.map(makePaintRef), notes: value.notes, optional: value.optional })),
    position: index + 1, createdAt, updatedAt: createdAt,
  }))
  return { scheme: { id: schemeId, slug: preset.id, name: preset.name, modelId: preset.modelId, notes: `${preset.description} · ${preset.source}.`, createdAt, updatedAt: createdAt }, recipes, paintIds: [...refs] }
}
