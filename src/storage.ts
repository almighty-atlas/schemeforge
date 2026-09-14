import type { PaintRef, Recipe, RecipeStep, Scheme, Workspace } from './types'

const STORAGE_KEY = 'schemeforge.workspace.v1'
const now = () => new Date().toISOString()
export const uid = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
export const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid()

export const EMPTY_WORKSPACE: Workspace = {
  version: 1,
  schemes: [],
  recipes: [],
  ownedPaintIds: [],
}

function product(value: any): PaintRef | null {
  if (!value || typeof value.name !== 'string' || typeof value.brand !== 'string') return null
  return {
    paintId: typeof value.paintId === 'string' ? value.paintId : undefined,
    brand: value.brand,
    range: typeof value.range === 'string' ? value.range : undefined,
    name: value.name,
    code: typeof value.code === 'string' ? value.code : undefined,
    ratioParts: Number(value.ratioParts) > 0 ? Number(value.ratioParts) : 1,
  }
}

function step(value: any): RecipeStep {
  return {
    id: typeof value?.id === 'string' ? value.id : uid(),
    techniqueId: typeof value?.techniqueId === 'string' ? value.techniqueId : 'basecoat',
    thinning: typeof value?.thinning === 'string' ? value.thinning : undefined,
    notes: typeof value?.notes === 'string' ? value.notes : undefined,
    optional: Boolean(value?.optional),
    paints: Array.isArray(value?.paints)
      ? value.paints.map(product).filter((item: PaintRef | null): item is PaintRef => item !== null)
      : [],
  }
}

function scheme(value: any): Scheme | null {
  if (!value || typeof value.name !== 'string') return null
  const stamp = now()
  return {
    id: typeof value.id === 'string' ? value.id : uid(),
    slug: typeof value.slug === 'string' ? value.slug : slugify(value.name),
    name: value.name.trim() || 'Untitled scheme',
    modelId: typeof value.modelId === 'string' ? value.modelId : undefined,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : stamp,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : stamp,
  }
}

function recipe(value: any): Recipe | null {
  if (!value || typeof value.name !== 'string') return null
  const stamp = now()
  return {
    id: typeof value.id === 'string' ? value.id : uid(),
    slug: typeof value.slug === 'string' ? value.slug : slugify(value.name),
    name: value.name.trim() || 'Untitled recipe',
    schemeId: typeof value.schemeId === 'string' ? value.schemeId : undefined,
    part: typeof value.part === 'string' ? value.part : undefined,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
    primer: product(value.primer) ?? undefined,
    steps: Array.isArray(value.steps) ? value.steps.map(step) : [],
    position: Number.isFinite(value.position) ? value.position : 0,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : stamp,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : stamp,
  }
}

export function normalizeWorkspace(value: any): Workspace {
  if (!value || typeof value !== 'object') throw new Error('This file does not contain a workspace.')
  const schemes = (Array.isArray(value.schemes) ? value.schemes : [])
    .map(scheme).filter((item: Scheme | null): item is Scheme => item !== null)
  const recipes = (Array.isArray(value.recipes) ? value.recipes : [])
    .map(recipe).filter((item: Recipe | null): item is Recipe => item !== null)
  const paintIds: unknown[] = Array.isArray(value.ownedPaintIds)
    ? value.ownedPaintIds
    : Array.isArray(value.paintIds)
      ? value.paintIds
      : Array.isArray(value.paints)
        ? value.paints.map((item: any) => item?.id)
        : []
  return {
    version: 1,
    schemes,
    recipes,
    ownedPaintIds: [...new Set<string>(paintIds.filter((id): id is string => typeof id === 'string'))],
  }
}

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeWorkspace(JSON.parse(raw)) : EMPTY_WORKSPACE
  } catch {
    return EMPTY_WORKSPACE
  }
}

export function saveWorkspace(workspace: Workspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
}

export function createScheme(name: string, notes = ''): Scheme {
  const stamp = now()
  return { id: uid(), slug: slugify(name), name: name.trim(), notes: notes.trim() || undefined, createdAt: stamp, updatedAt: stamp }
}

export function createRecipe(name: string, schemeId?: string): Recipe {
  const stamp = now()
  return {
    id: uid(),
    slug: slugify(name),
    name: name.trim(),
    schemeId,
    steps: [{ id: uid(), techniqueId: 'basecoat', paints: [] }],
    position: 0,
    createdAt: stamp,
    updatedAt: stamp,
  }
}
