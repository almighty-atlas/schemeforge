export type ModelRegion = 'armour' | 'trim' | 'weapon' | 'cloth' | 'leather' | 'bone' | 'flesh' | 'hair' | 'machinery' | 'energy' | 'details'
export type MarkerPoint = { x: number; y: number }

export interface ModelDefinition {
  id: string
  name: string
  image: string
  alt: string
  points: Record<ModelRegion, MarkerPoint[]>
}

const points = (value: Partial<Record<ModelRegion, MarkerPoint[]>>): Record<ModelRegion, MarkerPoint[]> => ({
  armour: [], trim: [], weapon: [], cloth: [], leather: [], bone: [], flesh: [], hair: [], machinery: [], energy: [], details: [], ...value,
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
  'space-marine': {
    id: 'space-marine', name: 'Space Marine', image: 'models/space-marine.webp',
    alt: 'Original monochrome loyalist power-armoured warrior archetype illustration',
    points: points({
      armour: [{ x: 51, y: 29 }, { x: 37, y: 20 }, { x: 70, y: 22 }, { x: 32, y: 70 }, { x: 67, y: 70 }],
      trim: [{ x: 66, y: 31 }, { x: 33, y: 58 }, { x: 66, y: 59 }], weapon: [{ x: 18, y: 25 }],
      cloth: [{ x: 50, y: 61 }], leather: [{ x: 43, y: 42 }, { x: 62, y: 42 }], details: [{ x: 51, y: 15 }],
    }),
  },
  'astra-militarum': {
    id: 'astra-militarum', name: 'Astra Militarum Trooper', image: 'models/astra-militarum.webp',
    alt: 'Original monochrome imperial trench infantry archetype illustration',
    points: points({
      armour: [{ x: 50, y: 25 }, { x: 36, y: 22 }, { x: 65, y: 23 }, { x: 51, y: 10 }],
      weapon: [{ x: 70, y: 37 }], cloth: [{ x: 49, y: 63 }, { x: 56, y: 76 }],
      leather: [{ x: 48, y: 43 }, { x: 38, y: 83 }], flesh: [{ x: 51, y: 15 }, { x: 67, y: 39 }], details: [{ x: 49, y: 28 }],
    }),
  },
  'ork-raider': {
    id: 'ork-raider', name: 'Ork Raider', image: 'models/ork-raider.webp',
    alt: 'Original monochrome hulking alien scrap-raider archetype illustration',
    points: points({
      armour: [{ x: 30, y: 20 }, { x: 70, y: 68 }, { x: 28, y: 82 }], weapon: [{ x: 87, y: 26 }, { x: 23, y: 70 }],
      cloth: [{ x: 65, y: 57 }, { x: 41, y: 57 }], leather: [{ x: 50, y: 40 }, { x: 25, y: 46 }],
      bone: [{ x: 57, y: 22 }, { x: 52, y: 29 }], flesh: [{ x: 56, y: 18 }, { x: 24, y: 42 }, { x: 78, y: 32 }], details: [{ x: 59, y: 15 }],
    }),
  },
  'necron-warrior': {
    id: 'necron-warrior', name: 'Necron Warrior', image: 'models/necron-warrior.webp',
    alt: 'Original monochrome ancient skeletal machine warrior archetype illustration',
    points: points({
      armour: [{ x: 49, y: 20 }, { x: 36, y: 18 }, { x: 63, y: 22 }, { x: 31, y: 72 }, { x: 66, y: 73 }],
      trim: [{ x: 50, y: 14 }, { x: 56, y: 43 }], weapon: [{ x: 71, y: 49 }], cloth: [{ x: 48, y: 64 }],
      machinery: [{ x: 51, y: 33 }, { x: 33, y: 47 }, { x: 64, y: 70 }],
      energy: [{ x: 53, y: 24 }, { x: 88, y: 61 }, { x: 52, y: 13 }],
    }),
  },
  'tyranid-warrior': {
    id: 'tyranid-warrior', name: 'Tyranid Warrior', image: 'models/tyranid-warrior.webp',
    alt: 'Original monochrome predatory chitinous swarm warrior archetype illustration',
    points: points({
      armour: [{ x: 62, y: 22 }, { x: 42, y: 30 }, { x: 13, y: 49 }, { x: 27, y: 70 }],
      weapon: [{ x: 79, y: 58 }], bone: [{ x: 75, y: 29 }, { x: 26, y: 88 }, { x: 61, y: 88 }],
      flesh: [{ x: 49, y: 42 }, { x: 68, y: 55 }, { x: 37, y: 53 }], details: [{ x: 69, y: 36 }, { x: 84, y: 57 }],
    }),
  },
  'adepta-sororitas': {
    id: 'adepta-sororitas', name: 'Battle Sister', image: 'models/adepta-sororitas.webp',
    alt: 'Original monochrome gothic battle sister archetype illustration',
    points: points({
      armour: [{ x: 50, y: 28 }, { x: 36, y: 23 }, { x: 64, y: 25 }, { x: 36, y: 70 }, { x: 65, y: 72 }],
      trim: [{ x: 50, y: 24 }, { x: 35, y: 59 }, { x: 65, y: 59 }], weapon: [{ x: 79, y: 30 }, { x: 34, y: 45 }],
      cloth: [{ x: 50, y: 64 }, { x: 28, y: 34 }], leather: [{ x: 45, y: 39 }], bone: [{ x: 50, y: 35 }],
      flesh: [{ x: 50, y: 15 }], hair: [{ x: 48, y: 11 }], details: [{ x: 57, y: 25 }],
    }),
  },
  'adeptus-custodes': {
    id: 'adeptus-custodes', name: 'Custodian Guard', image: 'models/adeptus-custodes.webp',
    alt: 'Original monochrome towering ceremonial guardian archetype illustration',
    points: points({
      armour: [{ x: 52, y: 28 }, { x: 38, y: 24 }, { x: 68, y: 23 }, { x: 36, y: 73 }, { x: 66, y: 72 }],
      trim: [{ x: 51, y: 24 }, { x: 37, y: 62 }, { x: 66, y: 61 }], weapon: [{ x: 24, y: 20 }, { x: 24, y: 58 }],
      cloth: [{ x: 50, y: 63 }, { x: 76, y: 55 }, { x: 47, y: 8 }], leather: [{ x: 48, y: 40 }, { x: 24, y: 48 }], details: [{ x: 51, y: 16 }],
    }),
  },
  'adeptus-mechanicus': {
    id: 'adeptus-mechanicus', name: 'Skitarii Ranger', image: 'models/adeptus-mechanicus.webp',
    alt: 'Original monochrome hooded cybernetic ranger archetype illustration',
    points: points({
      armour: [{ x: 35, y: 24 }, { x: 58, y: 29 }, { x: 30, y: 76 }], weapon: [{ x: 68, y: 47 }],
      cloth: [{ x: 50, y: 64 }, { x: 50, y: 15 }], leather: [{ x: 44, y: 43 }, { x: 55, y: 54 }],
      machinery: [{ x: 30, y: 49 }, { x: 38, y: 81 }, { x: 67, y: 83 }], energy: [{ x: 49, y: 17 }, { x: 34, y: 10 }],
      trim: [{ x: 52, y: 36 }, { x: 76, y: 51 }], details: [{ x: 49, y: 16 }],
    }),
  },
  'grey-knight': {
    id: 'grey-knight', name: 'Grey Knight', image: 'models/grey-knight.webp',
    alt: 'Original monochrome psychic silver knight archetype illustration',
    points: points({
      armour: [{ x: 51, y: 28 }, { x: 36, y: 23 }, { x: 67, y: 22 }, { x: 35, y: 72 }, { x: 66, y: 72 }],
      trim: [{ x: 50, y: 25 }, { x: 36, y: 60 }, { x: 67, y: 59 }], weapon: [{ x: 23, y: 20 }, { x: 23, y: 52 }],
      cloth: [{ x: 50, y: 63 }, { x: 67, y: 31 }], leather: [{ x: 50, y: 42 }, { x: 23, y: 45 }],
      machinery: [{ x: 71, y: 44 }], energy: [{ x: 23, y: 15 }], details: [{ x: 51, y: 16 }],
    }),
  },
  'imperial-agent': {
    id: 'imperial-agent', name: 'Imperial Field Agent', image: 'models/imperial-agent.webp',
    alt: 'Original monochrome armoured imperial field investigator archetype illustration',
    points: points({
      armour: [{ x: 50, y: 28 }, { x: 36, y: 24 }, { x: 39, y: 69 }, { x: 61, y: 69 }],
      weapon: [{ x: 14, y: 22 }, { x: 82, y: 64 }], cloth: [{ x: 49, y: 61 }, { x: 31, y: 59 }],
      leather: [{ x: 49, y: 39 }, { x: 35, y: 44 }, { x: 64, y: 85 }], flesh: [{ x: 50, y: 12 }, { x: 20, y: 24 }],
      machinery: [{ x: 51, y: 12 }], details: [{ x: 47, y: 23 }, { x: 39, y: 29 }],
    }),
  },
}

export const regionForPart = (part = ''): ModelRegion | undefined => ({
  armour: 'armour', armor: 'armour', trim: 'trim', metal: 'weapon', steel: 'weapon', gold: 'trim', cloth: 'cloth',
  robes: 'cloth', leather: 'leather', bone: 'bone', parchment: 'cloth', skin: 'flesh', flesh: 'flesh',
  eyes: 'details', 'eyes & runes': 'details', details: 'details', weapon: 'weapon', weapons: 'weapon',
  carapace: 'armour', chitin: 'armour', fatigues: 'cloth', coat: 'cloth', teeth: 'bone', talons: 'bone',
  'bio-weapon': 'weapon', energy: 'energy', glow: 'energy', machinery: 'machinery', skeleton: 'machinery',
  hair: 'hair', plume: 'cloth', seals: 'cloth',
}[part.toLowerCase()] as ModelRegion | undefined)
