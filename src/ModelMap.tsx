import { useEffect, useState } from 'react'
import type { Paint, Recipe } from './types'
import { MODEL_LIBRARY, regionForPart } from './modelLibrary'

export function ModelMap({ modelId, recipes, paintsById }: { modelId: string; recipes: Recipe[]; paintsById: Map<string, Paint> }) {
  const model = MODEL_LIBRARY[modelId] ?? MODEL_LIBRARY['chaos-legionary']
  const mapped = recipes.filter((recipe) => regionForPart(recipe.part))
  const [selectedId, setSelectedId] = useState(mapped[0]?.id)
  useEffect(() => { if (!mapped.some((recipe) => recipe.id === selectedId)) setSelectedId(mapped[0]?.id) }, [mapped, selectedId])
  if (!mapped.length) return null
  const selected = mapped.find((recipe) => recipe.id === selectedId) ?? mapped[0]
  const activeRegion = regionForPart(selected.part)!
  return <section className="model-map" aria-labelledby="model-map-title">
    <div className="model-map-stage">
      <img src={`${import.meta.env.BASE_URL}${model.image}`} alt={model.alt} />
      <div className="model-markers" aria-hidden="true">{model.points[activeRegion].map((point, index) => <i key={index} style={{ left: `${point.x}%`, top: `${point.y}%` }} />)}</div>
    </div>
    <div className="model-map-content">
      <span className="eyebrow">Model map · Original archetype</span>
      <h2 id="model-map-title">{model.name}</h2>
      <p>Select a recipe to see where it belongs on this original model archetype.</p>
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
