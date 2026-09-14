import { useEffect, useState } from 'react'
import type { Paint, Recipe } from './types'

type Region = 'armour' | 'trim' | 'weapon' | 'cloth' | 'leather' | 'bone' | 'flesh' | 'details'
type Point = { x: number; y: number }

const PART_REGIONS: Record<string, Region> = {
  armour: 'armour', trim: 'trim', metal: 'weapon', steel: 'weapon', gold: 'trim', cloth: 'cloth',
  leather: 'leather', bone: 'bone', parchment: 'cloth', eyes: 'details', 'eyes & runes': 'details', skin: 'flesh',
}

const REGION_POINTS: Record<Region, Point[]> = {
  armour: [{ x: 50, y: 35 }, { x: 31, y: 69 }, { x: 68, y: 69 }],
  trim: [{ x: 50, y: 29 }, { x: 33, y: 52 }, { x: 69, y: 53 }],
  weapon: [{ x: 84, y: 61 }],
  cloth: [{ x: 50, y: 66 }],
  leather: [{ x: 31, y: 55 }],
  bone: [{ x: 23, y: 27 }, { x: 52, y: 46 }, { x: 30, y: 76 }],
  flesh: [{ x: 24, y: 30 }],
  details: [{ x: 50, y: 21 }],
}

const regionFor = (recipe: Recipe) => PART_REGIONS[(recipe.part ?? '').toLowerCase()]

export function ModelMap({ recipes, paintsById }: { recipes: Recipe[]; paintsById: Map<string, Paint> }) {
  const mapped = recipes.filter(regionFor)
  const [selectedId, setSelectedId] = useState(mapped[0]?.id)
  useEffect(() => { if (!mapped.some((recipe) => recipe.id === selectedId)) setSelectedId(mapped[0]?.id) }, [mapped, selectedId])
  if (!mapped.length) return null
  const selected = mapped.find((recipe) => recipe.id === selectedId) ?? mapped[0]
  const activeRegion = regionFor(selected)
  return <section className="model-map" aria-labelledby="model-map-title">
    <div className="model-map-stage">
      <img src={`${import.meta.env.BASE_URL}models/chaos-legionary.webp`} alt="Original grimdark Chaos Legionary archetype illustration" />
      <div className="model-markers" aria-hidden="true">{REGION_POINTS[activeRegion].map((point, index) => <i key={index} style={{ left: `${point.x}%`, top: `${point.y}%` }} />)}</div>
    </div>
    <div className="model-map-content">
      <span className="eyebrow">Model map · Original archetype</span>
      <h2 id="model-map-title">Chaos Legionary</h2>
      <p>Select a recipe to see where it belongs on the model. This original illustration defines the visual style for future model maps.</p>
      <div className="model-map-recipes">{mapped.map((recipe) => {
        const refs = recipe.steps.flatMap((step) => step.paints)
        return <button key={recipe.id} className={recipe.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(recipe.id)} aria-pressed={recipe.id === selected.id}>
          <span className="model-map-swatches">{refs.slice(0, 4).map((ref, index) => <i key={`${ref.paintId}-${index}`} style={{ background: ref.paintId ? paintsById.get(ref.paintId)?.hex : undefined }} />)}</span>
          <span><strong>{recipe.name}</strong><small>{recipe.part}</small></span>
        </button>
      })}</div>
    </div>
  </section>
}
