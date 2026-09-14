import { useEffect, useState } from 'react'
import type { Paint, Recipe } from './types'

type Region = 'armour' | 'trim' | 'weapon' | 'cloth' | 'leather' | 'bone' | 'flesh' | 'details'

const PART_REGIONS: Record<string, Region> = {
  armour: 'armour', trim: 'trim', metal: 'weapon', steel: 'weapon', gold: 'trim', cloth: 'cloth',
  leather: 'leather', bone: 'bone', parchment: 'cloth', eyes: 'details', 'eyes & runes': 'details',
  skin: 'flesh',
}

const regionFor = (recipe: Recipe) => PART_REGIONS[(recipe.part ?? '').toLowerCase()]

function LegionaryFigure({ active, colour }: { active?: Region; colour: string }) {
  const state = (region: Region) => `model-region ${active === region ? 'active' : ''}`
  return <svg viewBox="0 0 360 520" role="img" aria-labelledby="legionary-title legionary-description" style={{ '--active-colour': colour } as React.CSSProperties}>
    <title id="legionary-title">Abstracted Chaos Legionary</title>
    <desc id="legionary-description">An original armoured science-fiction warrior divided into selectable painting regions.</desc>
    <ellipse className="model-shadow" cx="180" cy="493" rx="115" ry="15" />
    <g className={state('armour')}>
      <path d="M123 91 L134 51 L150 70 L166 42 L180 66 L202 45 L213 88 L201 123 Q180 139 153 121 Z" />
      <path d="M113 142 Q180 111 244 145 L251 261 Q222 285 180 287 Q138 284 106 258 Z" />
      <path d="M78 146 Q112 113 146 142 L132 211 L69 199 Z" />
      <path d="M216 143 Q251 111 284 150 L289 202 L230 213 Z" />
      <path d="M105 270 L166 281 L158 390 L94 386 Z" />
      <path d="M194 281 L253 268 L267 386 L201 391 Z" />
      <path d="M93 379 L157 384 L147 484 L66 484 L78 427 Z" />
      <path d="M202 384 L268 378 L290 484 L209 484 Z" />
      <path d="M114 129 L93 85 L110 62 L132 118 Z" />
      <path d="M228 125 L249 76 L270 92 L249 143 Z" />
    </g>
    <g className={state('trim')}>
      <path d="M132 91 Q180 116 211 88 L207 107 Q178 130 129 108 Z" />
      <path d="M108 247 Q179 277 250 246 L252 270 Q181 300 104 271 Z" />
      <path d="M69 191 L132 202 L129 218 L67 207 Z" />
      <path d="M231 203 L289 191 L291 208 L232 220 Z" />
      <path d="M93 378 L158 383 L157 402 L91 398 Z" />
      <path d="M202 383 L268 377 L271 397 L203 403 Z" />
      <path d="M149 143 Q180 126 215 144 L209 164 Q180 150 152 165 Z" />
    </g>
    <g className={state('cloth')}>
      <path d="M146 271 L211 270 L226 405 L177 438 L127 402 Z" />
      <path d="M142 278 Q179 292 215 276 L212 298 Q179 314 143 298 Z" />
    </g>
    <g className={state('leather')}>
      <path d="M109 227 Q179 246 247 224 L250 244 Q180 266 106 247 Z" />
      <path d="M91 217 L117 222 L112 306 L86 299 Z" />
      <path d="M250 220 L274 215 L284 294 L257 300 Z" />
    </g>
    <g className={state('weapon')}>
      <path d="M275 188 L306 179 L320 217 L286 230 Z" />
      <path d="M297 187 L326 115 L341 121 L317 198 Z" />
      <path d="M312 127 L334 74 L345 84 L331 134 Z" />
      <path d="M69 184 L37 171 L22 201 L63 218 Z" />
      <path d="M37 176 L14 151 L20 137 L55 174 Z" />
    </g>
    <g className={state('bone')}>
      <path d="M267 76 Q273 50 293 49 Q309 52 311 70 Q309 87 292 94 Q273 91 267 76 Z" />
      <path d="M278 89 L272 119 L284 111 L294 124 L301 95 Z" />
      <circle cx="283" cy="69" r="4" /><circle cx="299" cy="70" r="4" />
      <path d="M287 79 L295 79 L291 85 Z" />
    </g>
    <g className={state('flesh')}>
      <path d="M248 294 Q273 287 286 305 L278 369 Q260 379 244 364 L250 340 L239 322 Z" />
    </g>
    <g className={state('details')}>
      <path d="M144 89 L160 83 L168 92 L153 99 Z" />
      <path d="M190 92 L199 82 L215 88 L205 99 Z" />
      <path d="M165 182 L179 168 L194 182 L180 202 Z" />
    </g>
    <g className="model-linework">
      <path d="M77 427 L116 442 M210 441 L272 426 M126 325 L157 335 M203 336 L255 321" />
      <path d="M153 120 L148 91 M202 121 L211 91 M166 42 L171 68 M202 45 L193 70" />
    </g>
  </svg>
}

export function ModelMap({ recipes, paintsById }: { recipes: Recipe[]; paintsById: Map<string, Paint> }) {
  const mapped = recipes.filter(regionFor)
  const [selectedId, setSelectedId] = useState(mapped[0]?.id)
  useEffect(() => { if (!mapped.some((recipe) => recipe.id === selectedId)) setSelectedId(mapped[0]?.id) }, [mapped, selectedId])
  if (!mapped.length) return null
  const selected = mapped.find((recipe) => recipe.id === selectedId) ?? mapped[0]
  const firstRef = selected.steps.flatMap((step) => step.paints)[0]
  const colour = firstRef?.paintId ? paintsById.get(firstRef.paintId)?.hex ?? '#e97832' : '#e97832'
  return <section className="model-map" aria-labelledby="model-map-title">
    <div className="model-map-stage"><LegionaryFigure active={regionFor(selected)} colour={colour} /></div>
    <div className="model-map-content">
      <span className="eyebrow">Model map · Original archetype</span>
      <h2 id="model-map-title">Chaos Legionary</h2>
      <p>Select a recipe to see where it belongs on the model. The illustration is an original, reusable archetype rather than a traced miniature.</p>
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
