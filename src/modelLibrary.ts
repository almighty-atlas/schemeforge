export type ModelRegion = 'armour' | 'trim' | 'weapon' | 'cloth' | 'leather' | 'bone' | 'flesh' | 'details'
export type MarkerPoint = { x: number; y: number }

export interface ModelDefinition {
  id: string
  name: string
  image: string
  alt: string
  points: Record<ModelRegion, MarkerPoint[]>
}

const points = (value: Partial<Record<ModelRegion, MarkerPoint[]>>): Record<ModelRegion, MarkerPoint[]> => ({
  armour: [], trim: [], weapon: [], cloth: [], leather: [], bone: [], flesh: [], details: [], ...value,
})

export const MODEL_LIBRARY: Record<string, ModelDefinition> = {
  'chaos-legionary': {
    id: 'chaos-legionary', name: 'Chaos Legionary', image: 'models/chaos-legionary.webp',
    alt: 'Original monochrome grimdark legionary archetype illustration',
    points: points({
      armour: [{ x: 50, y: 35 }, { x: 31, y: 69 }, { x: 68, y: 69 }],
      trim: [{ x: 50, y: 29 }, { x: 33, y: 52 }, { x: 69, y: 53 }], weapon: [{ x: 84, y: 61 }],
      cloth: [{ x: 50, y: 66 }], leather: [{ x: 31, y: 55 }],
      bone: [{ x: 23, y: 27 }, { x: 52, y: 46 }, { x: 30, y: 76 }], flesh: [{ x: 24, y: 30 }], details: [{ x: 50, y: 21 }],
    }),
  },
  'dark-apostle': {
    id: 'dark-apostle', name: 'Dark Apostle', image: 'models/dark-apostle.webp',
    alt: 'Original monochrome grimdark armoured preacher archetype illustration',
    points: points({
      armour: [{ x: 49, y: 35 }, { x: 37, y: 74 }, { x: 63, y: 74 }], trim: [{ x: 48, y: 30 }, { x: 67, y: 47 }],
      weapon: [{ x: 82, y: 48 }], cloth: [{ x: 51, y: 63 }, { x: 34, y: 47 }], leather: [{ x: 22, y: 43 }],
      bone: [{ x: 27, y: 26 }, { x: 68, y: 32 }], details: [{ x: 50, y: 20 }, { x: 21, y: 38 }],
    }),
  },
  'chaos-cultist': {
    id: 'chaos-cultist', name: 'Chaos Cultist', image: 'models/chaos-cultist.webp',
    alt: 'Original monochrome grimdark cultist archetype illustration',
    points: points({
      armour: [{ x: 36, y: 27 }, { x: 64, y: 72 }], weapon: [{ x: 79, y: 56 }], cloth: [{ x: 49, y: 45 }, { x: 45, y: 68 }],
      leather: [{ x: 51, y: 40 }, { x: 32, y: 60 }], bone: [{ x: 31, y: 28 }], flesh: [{ x: 49, y: 12 }, { x: 25, y: 51 }],
      details: [{ x: 50, y: 18 }],
    }),
  },
  'terror-warrior': {
    id: 'terror-warrior', name: 'Terror Warrior', image: 'models/terror-warrior.webp',
    alt: 'Original monochrome grimdark terror warrior archetype illustration',
    points: points({
      armour: [{ x: 50, y: 23 }, { x: 30, y: 69 }, { x: 69, y: 68 }], trim: [{ x: 38, y: 24 }, { x: 73, y: 36 }],
      weapon: [{ x: 12, y: 49 }, { x: 88, y: 49 }], cloth: [{ x: 49, y: 61 }, { x: 27, y: 23 }], leather: [{ x: 42, y: 43 }],
      bone: [{ x: 37, y: 20 }, { x: 49, y: 29 }, { x: 36, y: 69 }], flesh: [{ x: 27, y: 27 }, { x: 51, y: 51 }], details: [{ x: 52, y: 21 }],
    }),
  },
  possessed: {
    id: 'possessed', name: 'Possessed Warrior', image: 'models/possessed.webp',
    alt: 'Original monochrome grimdark possessed warrior archetype illustration',
    points: points({
      armour: [{ x: 34, y: 23 }, { x: 31, y: 74 }, { x: 72, y: 74 }], trim: [{ x: 28, y: 39 }, { x: 70, y: 79 }],
      weapon: [{ x: 11, y: 66 }, { x: 89, y: 62 }], cloth: [{ x: 49, y: 63 }], leather: [{ x: 42, y: 48 }],
      bone: [{ x: 47, y: 14 }, { x: 75, y: 20 }, { x: 78, y: 52 }], flesh: [{ x: 69, y: 33 }, { x: 66, y: 64 }], details: [{ x: 48, y: 18 }],
    }),
  },
  'chaos-terminator': {
    id: 'chaos-terminator', name: 'Chaos Terminator', image: 'models/chaos-terminator.webp',
    alt: 'Original monochrome grimdark heavy veteran archetype illustration',
    points: points({
      armour: [{ x: 50, y: 28 }, { x: 31, y: 75 }, { x: 68, y: 75 }], trim: [{ x: 42, y: 28 }, { x: 73, y: 43 }],
      weapon: [{ x: 14, y: 43 }, { x: 89, y: 47 }], cloth: [{ x: 50, y: 66 }, { x: 35, y: 28 }], leather: [{ x: 46, y: 46 }],
      bone: [{ x: 35, y: 15 }, { x: 57, y: 31 }, { x: 81, y: 29 }], details: [{ x: 52, y: 18 }],
    }),
  },
}

export const regionForPart = (part = ''): ModelRegion | undefined => ({
  armour: 'armour', armor: 'armour', trim: 'trim', metal: 'weapon', steel: 'weapon', gold: 'trim', cloth: 'cloth',
  robes: 'cloth', leather: 'leather', bone: 'bone', parchment: 'cloth', skin: 'flesh', flesh: 'flesh',
  eyes: 'details', 'eyes & runes': 'details', details: 'details', weapon: 'weapon', weapons: 'weapon',
}[part.toLowerCase()] as ModelRegion | undefined)
