export type PaintFinish = 'opaque' | 'metallic' | 'wash' | 'contrast' | 'effect'

export interface Paint {
  id: string
  brandId: string
  brand: string
  name: string
  range: string
  code?: string
  hex: string
  finish: PaintFinish
  lab: [number, number, number]
  discontinued?: boolean
}

export interface PaintRef {
  paintId?: string
  brand: string
  range?: string
  name: string
  code?: string
  ratioParts: number
}

export interface RecipeStep {
  id: string
  techniqueId: string
  thinning?: string
  notes?: string
  optional?: boolean
  paints: PaintRef[]
}

export interface Recipe {
  id: string
  slug: string
  name: string
  schemeId?: string
  part?: string
  notes?: string
  primer?: Omit<PaintRef, 'ratioParts'>
  steps: RecipeStep[]
  position: number
  createdAt: string
  updatedAt: string
}

export interface Scheme {
  id: string
  slug: string
  name: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  version: 1
  schemes: Scheme[]
  recipes: Recipe[]
  ownedPaintIds: string[]
}

export interface Toast {
  message: string
  action?: { label: string; run: () => void }
}

export const TECHNIQUES = [
  ['basecoat', 'Basecoat'],
  ['wash', 'Wash'],
  ['layer', 'Layer'],
  ['edge-highlight', 'Edge highlight'],
  ['drybrush', 'Drybrush'],
  ['glaze', 'Glaze'],
  ['stipple', 'Stipple'],
  ['airbrush', 'Airbrush'],
  ['detail', 'Detail'],
] as const
