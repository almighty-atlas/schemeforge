import type { Paint } from './types'

let cache: Promise<Paint[]> | undefined

export function loadPaints(): Promise<Paint[]> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/paints.json`).then(async (response) => {
      if (!response.ok) throw new Error(`Paint catalogue unavailable (HTTP ${response.status}).`)
      return response.json() as Promise<Paint[]>
    })
    cache.catch(() => { cache = undefined })
  }
  return cache
}

export function paintLabel(paint: Pick<Paint, 'name' | 'brand' | 'range' | 'code'>) {
  return [paint.brand, paint.range, paint.code].filter(Boolean).join(' · ')
}

export function normaliseSearch(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()
}
