import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { deltaE2000, hexToLab } from './color'
import { loadPaints, normaliseSearch, paintLabel } from './data'
import { createRecipe, createScheme, loadWorkspace, normalizeWorkspace, saveWorkspace, slugify, uid } from './storage'
import { TECHNIQUES, type Paint, type PaintRef, type Recipe, type RecipeStep, type Scheme, type Toast, type Workspace } from './types'

type View = 'schemes' | 'catalogue' | 'inventory'

const techniqueName = (id: string) => TECHNIQUES.find(([key]) => key === id)?.[1] ?? id.replaceAll('-', ' ')
const paintRef = (paint: Paint): PaintRef => ({
  paintId: paint.id, brand: paint.brand, range: paint.range, name: paint.name, code: paint.code, ratioParts: 1,
})
const download = (name: string, data: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
  link.download = name
  link.click()
  URL.revokeObjectURL(link.href)
}

function Icon({ children }: { children: ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>
}

function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </header>
        {children}
      </section>
    </div>
  )
}

function NewScheme({ onCreate, onClose }: { onCreate: (name: string, notes: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  return (
    <Modal title="New colour scheme" onClose={onClose}>
      <form className="form-stack" onSubmit={(event) => { event.preventDefault(); if (name.trim()) onCreate(name, notes) }}>
        <label>Name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Salamanders strike force" /></label>
        <label>Notes <span>optional</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Overall direction, basing, transfers…" rows={4} /></label>
        <div className="modal-actions"><button type="button" className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" disabled={!name.trim()}>Create scheme</button></div>
      </form>
    </Modal>
  )
}

function EditScheme({ scheme, onSave, onClose }: { scheme: Scheme; onSave: (scheme: Scheme) => void; onClose: () => void }) {
  const [name, setName] = useState(scheme.name)
  const [notes, setNotes] = useState(scheme.notes ?? '')
  return (
    <Modal title="Scheme details" onClose={onClose}>
      <form className="form-stack" onSubmit={(event) => {
        event.preventDefault()
        if (name.trim()) onSave({ ...scheme, name: name.trim(), slug: slugify(name), notes: notes.trim() || undefined, updatedAt: new Date().toISOString() })
      }}>
        <label>Name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>Notes <span>optional</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} /></label>
        <div className="modal-actions"><button type="button" className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" disabled={!name.trim()}>Save changes</button></div>
      </form>
    </Modal>
  )
}

function PaintPicker({ paints, owned, onPick, onClose }: { paints: Paint[]; owned: Set<string>; onPick: (paint: Paint) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const brands = useMemo(() => [...new Set(paints.map((paint) => paint.brand))].sort(), [paints])
  const matches = useMemo(() => {
    const q = normaliseSearch(query)
    return paints
      .filter((paint) => brand === 'all' || paint.brand === brand)
      .filter((paint) => !q || normaliseSearch(`${paint.name} ${paint.brand} ${paint.range} ${paint.code ?? ''}`).includes(q))
      .sort((a, b) => Number(owned.has(b.id)) - Number(owned.has(a.id)) || a.name.localeCompare(b.name))
      .slice(0, 60)
  }, [paints, query, brand, owned])
  return (
    <Modal title="Choose a paint" onClose={onClose} wide>
      <div className="picker-tools">
        <input ref={inputRef} autoFocus className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, range or product code…" />
        <select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="paint-picker-list">
        {matches.map((paint) => (
          <button key={paint.id} className="paint-pick" onClick={() => onPick(paint)}>
            <span className={`swatch ${paint.finish}`} style={{ '--paint': paint.hex } as React.CSSProperties} />
            <span><strong>{paint.name}</strong><small>{paintLabel(paint)}</small></span>
            {owned.has(paint.id) && <span className="owned-mark">Owned</span>}
          </button>
        ))}
        {!matches.length && <div className="empty compact">No matching paints.</div>}
      </div>
      <footer className="picker-footer">Showing {matches.length} of {paints.length.toLocaleString()} paints · Owned paints rank first</footer>
    </Modal>
  )
}

function RecipeEditor({ initial, paints, owned, schemes, onSave, onClose }: {
  initial: Recipe; paints: Paint[]; owned: Set<string>; schemes: Scheme[]; onSave: (recipe: Recipe) => void; onClose: () => void
}) {
  const [draft, setDraft] = useState<Recipe>(() => structuredClone(initial))
  const [picking, setPicking] = useState<{ step: number; paint?: number } | null>(null)
  const updateStep = (index: number, patch: Partial<RecipeStep>) =>
    setDraft((current) => ({ ...current, steps: current.steps.map((step, i) => i === index ? { ...step, ...patch } : step) }))
  const moveStep = (index: number, delta: number) => setDraft((current) => {
    const steps = [...current.steps]
    const next = index + delta
    if (next < 0 || next >= steps.length) return current
    ;[steps[index], steps[next]] = [steps[next], steps[index]]
    return { ...current, steps }
  })
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim()) return
    onSave({ ...draft, name: draft.name.trim(), slug: slugify(draft.name), part: draft.part?.trim() || undefined, notes: draft.notes?.trim() || undefined, updatedAt: new Date().toISOString() })
  }
  return (
    <Modal title={initial.name ? 'Edit recipe' : 'New recipe'} onClose={onClose} wide>
      <form onSubmit={save}>
        <div className="editor-grid">
          <label>Recipe name<input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Green armour" /></label>
          <label>Model area<input value={draft.part ?? ''} onChange={(event) => setDraft({ ...draft, part: event.target.value })} placeholder="Armour, leather, base…" /></label>
          <label>Scheme<select value={draft.schemeId ?? ''} onChange={(event) => setDraft({ ...draft, schemeId: event.target.value || undefined })}><option value="">Shared recipe</option>{schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}</select></label>
        </div>
        <div className="steps-heading"><div><span className="eyebrow">Process</span><h3>Painting steps</h3></div><button type="button" className="button secondary small" onClick={() => setDraft({ ...draft, steps: [...draft.steps, { id: uid(), techniqueId: 'layer', paints: [] }] })}>＋ Add step</button></div>
        <div className="step-editor-list">
          {draft.steps.map((step, index) => (
            <section className="step-editor" key={step.id}>
              <div className="step-number">{index + 1}</div>
              <div className="step-body">
                <div className="step-toolbar">
                  <select aria-label="Technique" value={step.techniqueId} onChange={(event) => updateStep(index, { techniqueId: event.target.value })}>{TECHNIQUES.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select>
                  <label className="check"><input type="checkbox" checked={Boolean(step.optional)} onChange={(event) => updateStep(index, { optional: event.target.checked })} /> Optional</label>
                  <div className="step-move"><button type="button" onClick={() => moveStep(index, -1)} disabled={!index} aria-label="Move step up">↑</button><button type="button" onClick={() => moveStep(index, 1)} disabled={index === draft.steps.length - 1} aria-label="Move step down">↓</button><button type="button" className="danger-text" onClick={() => setDraft({ ...draft, steps: draft.steps.filter((_, i) => i !== index) })} aria-label="Delete step">×</button></div>
                </div>
                <div className="selected-paints">
                  {step.paints.map((paint, paintIndex) => (
                    <div className="selected-paint" key={`${paint.paintId ?? paint.name}-${paintIndex}`}>
                      <span className="mini-swatch" style={{ background: paints.find((item) => item.id === paint.paintId)?.hex ?? '#57534e' }} />
                      <span className="selected-name"><strong>{paint.name}</strong><small>{paint.brand}{paint.range ? ` · ${paint.range}` : ''}</small></span>
                      {step.paints.length > 1 && <label className="ratio">Parts<input type="number" min="1" value={paint.ratioParts} onChange={(event) => updateStep(index, { paints: step.paints.map((item, i) => i === paintIndex ? { ...item, ratioParts: Math.max(1, Number(event.target.value)) } : item) })} /></label>}
                      <button type="button" className="remove-chip" onClick={() => updateStep(index, { paints: step.paints.filter((_, i) => i !== paintIndex) })} aria-label={`Remove ${paint.name}`}>×</button>
                    </div>
                  ))}
                  <button type="button" className="add-paint" onClick={() => setPicking({ step: index })}>＋ {step.paints.length ? 'Add paint to mix' : 'Choose paint'}</button>
                </div>
                <div className="step-details">
                  <label>Thinning <span>optional</span><input value={step.thinning ?? ''} onChange={(event) => updateStep(index, { thinning: event.target.value })} placeholder="e.g. 1:1 with water" /></label>
                  <label>Step note <span>optional</span><input value={step.notes ?? ''} onChange={(event) => updateStep(index, { notes: event.target.value })} placeholder="Brush direction, coverage…" /></label>
                </div>
              </div>
            </section>
          ))}
          {!draft.steps.length && <div className="empty compact">No steps yet. Add the first step to describe your process.</div>}
        </div>
        <label className="notes-field">Recipe notes <span>optional</span><textarea rows={3} value={draft.notes ?? ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Anything that applies to the whole recipe…" /></label>
        <div className="modal-actions sticky"><button type="button" className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" disabled={!draft.name.trim()}>Save recipe</button></div>
      </form>
      {picking && <PaintPicker paints={paints} owned={owned} onClose={() => setPicking(null)} onPick={(paint) => {
        const step = draft.steps[picking.step]
        updateStep(picking.step, { paints: [...step.paints, paintRef(paint)] })
        setPicking(null)
      }} />}
    </Modal>
  )
}

function RecipeCard({ recipe, paintsById, owned, onEdit, onDuplicate, onDelete, onMove, canUp, canDown }: {
  recipe: Recipe; paintsById: Map<string, Paint>; owned: Set<string>; onEdit: () => void; onDuplicate: () => void; onDelete: () => void; onMove: (delta: number) => void; canUp: boolean; canDown: boolean
}) {
  const used = [...new Set(recipe.steps.flatMap((step) => step.paints.map((paint) => paint.paintId).filter(Boolean) as string[]))]
  const missing = used.filter((id) => !owned.has(id))
  return (
    <article className="recipe-card">
      <div className="recipe-head">
        <div><div className="recipe-title-row"><h3>{recipe.name}</h3>{recipe.part && <span className="pill accent">{recipe.part}</span>}</div><p>{recipe.steps.length} {recipe.steps.length === 1 ? 'step' : 'steps'} · {used.length} {used.length === 1 ? 'paint' : 'paints'}{missing.length > 0 && <span className="missing"> · {missing.length} missing</span>}</p></div>
        <button className="button secondary small" onClick={onEdit}>Edit</button>
      </div>
      <ol className="recipe-steps">
        {recipe.steps.map((step, index) => (
          <li key={step.id}>
            <span className="list-number">{index + 1}</span>
            <div className="step-colours">{step.paints.map((ref, i) => {
              const paint = ref.paintId ? paintsById.get(ref.paintId) : undefined
              return <span key={i} title={ref.name} className={`step-swatch ${ref.paintId && !owned.has(ref.paintId) ? 'not-owned' : ''}`} style={{ background: paint?.hex ?? '#57534e' }} />
            })}</div>
            <div><strong>{techniqueName(step.techniqueId)}{step.optional && <em>Optional</em>}</strong><span>{step.paints.length ? step.paints.map((paint) => `${paint.name}${step.paints.length > 1 ? ` ${paint.ratioParts}` : ''}`).join(' : ') : 'No paint selected'}</span>{step.thinning && <small>{step.thinning}</small>}{step.notes && <small>{step.notes}</small>}</div>
          </li>
        ))}
      </ol>
      {recipe.notes && <p className="recipe-notes">{recipe.notes}</p>}
      <footer className="recipe-actions"><div><button onClick={() => onMove(-1)} disabled={!canUp} aria-label="Move recipe up">↑</button><button onClick={() => onMove(1)} disabled={!canDown} aria-label="Move recipe down">↓</button></div><button onClick={onDuplicate}>Duplicate</button><button className="danger-text" onClick={onDelete}>Delete</button></footer>
    </article>
  )
}

function SchemeWorkspace({ scheme, recipes, paints, owned, onEditScheme, onAddRecipe, onEditRecipe, onDuplicate, onDeleteRecipe, onMove, onDeleteScheme }: {
  scheme: Scheme; recipes: Recipe[]; paints: Paint[]; owned: Set<string>; onEditScheme: () => void; onAddRecipe: () => void; onEditRecipe: (recipe: Recipe) => void; onDuplicate: (recipe: Recipe) => void; onDeleteRecipe: (recipe: Recipe) => void; onMove: (recipe: Recipe, delta: number) => void; onDeleteScheme: () => void
}) {
  const paintsById = useMemo(() => new Map(paints.map((paint) => [paint.id, paint])), [paints])
  const usedIds = [...new Set(recipes.flatMap((recipe) => recipe.steps.flatMap((step) => step.paints.map((paint) => paint.paintId).filter(Boolean) as string[])))]
  const missing = usedIds.filter((id) => !owned.has(id))
  return (
    <>
      <header className="workspace-head">
        <div><span className="eyebrow">Colour scheme</span><div className="title-actions"><h1>{scheme.name}</h1><button className="text-button" onClick={onEditScheme}>Edit details</button></div>{scheme.notes && <p>{scheme.notes}</p>}</div>
        <button className="button primary" onClick={onAddRecipe}>＋ Add recipe</button>
      </header>
      <div className="summary-strip">
        <div><strong>{recipes.length}</strong><span>Recipes</span></div>
        <div><strong>{usedIds.length}</strong><span>Paints needed</span></div>
        <div className={missing.length ? 'warning' : ''}><strong>{missing.length}</strong><span>Missing from inventory</span></div>
      </div>
      {recipes.length ? <div className="recipe-grid">{recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} paintsById={paintsById} owned={owned} onEdit={() => onEditRecipe(recipe)} onDuplicate={() => onDuplicate(recipe)} onDelete={() => onDeleteRecipe(recipe)} onMove={(delta) => onMove(recipe, delta)} canUp={index > 0} canDown={index < recipes.length - 1} />)}</div> : (
        <div className="empty large"><span className="empty-glyph">◇</span><h2>Build the first recipe</h2><p>Split the scheme into useful model areas such as armour, cloth, metal and bases.</p><button className="button primary" onClick={onAddRecipe}>Create a recipe</button></div>
      )}
      <div className="danger-zone"><button className="text-button danger-text" onClick={onDeleteScheme}>Delete this scheme</button></div>
    </>
  )
}

function Catalogue({ paints, owned, mode, onToggle }: { paints: Paint[]; owned: Set<string>; mode: 'catalogue' | 'inventory'; onToggle: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [finish, setFinish] = useState('all')
  const [target, setTarget] = useState('#4f6b3a')
  const [closest, setClosest] = useState(false)
  const brands = useMemo(() => [...new Set(paints.map((paint) => paint.brand))].sort(), [paints])
  const results = useMemo(() => {
    const q = normaliseSearch(query)
    let rows = paints.filter((paint) => mode === 'catalogue' || owned.has(paint.id))
      .filter((paint) => brand === 'all' || paint.brand === brand)
      .filter((paint) => finish === 'all' || paint.finish === finish)
      .filter((paint) => !q || normaliseSearch(`${paint.name} ${paint.brand} ${paint.range} ${paint.code ?? ''}`).includes(q))
    if (closest) {
      const lab = hexToLab(target)
      rows = [...rows].sort((a, b) => deltaE2000(lab, a.lab) - deltaE2000(lab, b.lab))
    } else rows = [...rows].sort((a, b) => a.name.localeCompare(b.name))
    return rows.slice(0, 180)
  }, [paints, owned, mode, query, brand, finish, target, closest])
  return (
    <>
      <header className="workspace-head"><div><span className="eyebrow">{mode === 'inventory' ? 'Your collection' : 'Paint library'}</span><h1>{mode === 'inventory' ? 'My paints' : 'Explore paints'}</h1><p>{mode === 'inventory' ? `${owned.size} paints marked as owned. Find what is on your shelf.` : 'Search across nine miniature paint brands or find the closest catalogue colour.'}</p></div></header>
      <section className="catalogue-tools">
        <input className="search" value={query} onChange={(event) => { setQuery(event.target.value); setClosest(false) }} placeholder="Search paints, ranges and codes…" />
        <select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={finish} onChange={(event) => setFinish(event.target.value)}><option value="all">All finishes</option><option value="opaque">Opaque</option><option value="metallic">Metallic</option><option value="wash">Wash</option><option value="contrast">Contrast</option><option value="effect">Effect</option></select>
        <div className="colour-match"><input type="color" value={target} onChange={(event) => { setTarget(event.target.value); setClosest(true) }} aria-label="Target colour" /><button className={`button small ${closest ? 'primary' : 'secondary'}`} onClick={() => setClosest(!closest)}>{closest ? 'Closest first' : 'Match colour'}</button></div>
      </section>
      <p className="result-count">{results.length === 180 ? 'First 180 results' : `${results.length} results`}{closest && ' · ordered using CIEDE2000 perceptual distance'}</p>
      {results.length ? <div className="paint-grid">{results.map((paint) => (
        <article className="paint-card" key={paint.id}>
          <div className={`paint-colour ${paint.finish}`} style={{ '--paint': paint.hex } as React.CSSProperties}><span>{paint.finish}</span></div>
          <div className="paint-info"><h3>{paint.name}</h3><p>{paintLabel(paint)}</p>{closest && <small>ΔE {deltaE2000(hexToLab(target), paint.lab).toFixed(1)}</small>}</div>
          <button className={`own-button ${owned.has(paint.id) ? 'owned' : ''}`} onClick={() => onToggle(paint.id)} aria-pressed={owned.has(paint.id)}>{owned.has(paint.id) ? '✓ Owned' : '＋ Add'}</button>
        </article>
      ))}</div> : <div className="empty large"><h2>{mode === 'inventory' && !owned.size ? 'Your inventory is empty' : 'No paints found'}</h2><p>{mode === 'inventory' && !owned.size ? 'Add paints from the library to see them here.' : 'Try removing a filter or using a broader search.'}</p></div>}
    </>
  )
}

export function App() {
  const [workspace, setWorkspace] = useState<Workspace>(loadWorkspace)
  const [paints, setPaints] = useState<Paint[]>([])
  const [dataError, setDataError] = useState('')
  const [view, setView] = useState<View>('schemes')
  const [selectedId, setSelectedId] = useState<string | undefined>(() => loadWorkspace().schemes[0]?.id)
  const [newSchemeOpen, setNewSchemeOpen] = useState(false)
  const [editingScheme, setEditingScheme] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadPaints().then(setPaints).catch((error: Error) => setDataError(error.message)) }, [])
  useEffect(() => { saveWorkspace(workspace) }, [workspace])
  useEffect(() => {
    if (view === 'schemes' && !workspace.schemes.some((scheme) => scheme.id === selectedId)) setSelectedId(workspace.schemes[0]?.id)
  }, [workspace.schemes, selectedId, view])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 6000); return () => window.clearTimeout(timer) }, [toast])

  const selected = workspace.schemes.find((scheme) => scheme.id === selectedId)
  const owned = useMemo(() => new Set(workspace.ownedPaintIds), [workspace.ownedPaintIds])
  const selectedRecipes = workspace.recipes.filter((recipe) => recipe.schemeId === selectedId).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
  const update = (fn: (current: Workspace) => Workspace) => setWorkspace((current) => fn(current))
  const saveRecipeDraft = (recipe: Recipe) => {
    update((current) => {
      const exists = current.recipes.some((item) => item.id === recipe.id)
      const position = exists ? recipe.position : current.recipes.filter((item) => item.schemeId === recipe.schemeId).length + 1
      return { ...current, recipes: exists ? current.recipes.map((item) => item.id === recipe.id ? { ...recipe, position } : item) : [...current.recipes, { ...recipe, position }] }
    })
    setEditingRecipe(null)
    setToast({ message: 'Recipe saved.' })
  }
  const removeRecipe = (recipe: Recipe) => {
    update((current) => ({ ...current, recipes: current.recipes.filter((item) => item.id !== recipe.id) }))
    setToast({ message: `Deleted “${recipe.name}”.`, action: { label: 'Undo', run: () => { update((current) => ({ ...current, recipes: [...current.recipes, recipe] })); setToast(null) } } })
  }
  const moveRecipe = (recipe: Recipe, delta: number) => {
    const list = selectedRecipes
    const index = list.findIndex((item) => item.id === recipe.id), target = index + delta
    if (index < 0 || target < 0 || target >= list.length) return
    const ids = list.map((item) => item.id)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    update((current) => ({ ...current, recipes: current.recipes.map((item) => ids.includes(item.id) ? { ...item, position: ids.indexOf(item.id) + 1 } : item) }))
  }
  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const next = normalizeWorkspace(JSON.parse(await file.text()))
      if (!window.confirm(`Replace this workspace with ${next.schemes.length} schemes, ${next.recipes.length} recipes and ${next.ownedPaintIds.length} owned paints?`)) return
      setWorkspace(next); setSelectedId(next.schemes[0]?.id); setView('schemes'); setToast({ message: 'Workspace imported.' })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : 'Import failed.' }) }
  }
  const exportData = () => download(`schemeforge-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: 'schemeforge', kind: 'workspace-backup', exportedAt: new Date().toISOString(), ...workspace }, null, 2))

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◇</span><div><strong>Schemeforge</strong><small>Miniature paint planner</small></div></div>
        <nav className="main-nav" aria-label="Workspace">
          <button className={view === 'schemes' ? 'active' : ''} onClick={() => setView('schemes')}><Icon>◇</Icon>Schemes<span>{workspace.schemes.length}</span></button>
          <button className={view === 'catalogue' ? 'active' : ''} onClick={() => setView('catalogue')}><Icon>▦</Icon>Paint library<span>{paints.length || '…'}</span></button>
          <button className={view === 'inventory' ? 'active' : ''} onClick={() => setView('inventory')}><Icon>✓</Icon>My paints<span>{owned.size}</span></button>
        </nav>
        {view === 'schemes' && <div className="scheme-nav"><div className="nav-label"><span>Your schemes</span><button onClick={() => setNewSchemeOpen(true)} aria-label="New scheme">＋</button></div>{workspace.schemes.map((scheme) => <button className={scheme.id === selectedId ? 'active' : ''} key={scheme.id} onClick={() => setSelectedId(scheme.id)}><span className="scheme-dot" />{scheme.name}<small>{workspace.recipes.filter((recipe) => recipe.schemeId === scheme.id).length}</small></button>)}{!workspace.schemes.length && <p>No schemes yet.</p>}</div>}
        <div className="sidebar-bottom"><button onClick={exportData}>Export</button><button onClick={() => importRef.current?.click()}>Import</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importFile} /><p>Stored only in this browser</p></div>
      </aside>
      <main>
        {dataError && <div className="error-banner">{dataError}</div>}
        {!paints.length && !dataError ? <div className="loading">Loading paint catalogue…</div> : view === 'schemes' ? selected ? (
          <SchemeWorkspace scheme={selected} recipes={selectedRecipes} paints={paints} owned={owned} onEditScheme={() => setEditingScheme(true)} onAddRecipe={() => setEditingRecipe(createRecipe('', selected.id))} onEditRecipe={setEditingRecipe} onDuplicate={(recipe) => setEditingRecipe({ ...structuredClone(recipe), id: uid(), name: `${recipe.name} copy`, slug: `${recipe.slug}-copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), position: 0, steps: recipe.steps.map((step) => ({ ...step, id: uid() })) })} onDeleteRecipe={removeRecipe} onMove={moveRecipe} onDeleteScheme={() => {
            if (!window.confirm(`Delete “${selected.name}”? Its recipes will become shared and remain available in exported data.`)) return
            update((current) => ({ ...current, schemes: current.schemes.filter((item) => item.id !== selected.id), recipes: current.recipes.map((recipe) => recipe.schemeId === selected.id ? { ...recipe, schemeId: undefined } : recipe) }))
            setToast({ message: 'Scheme deleted; its recipes are now shared.' })
          }} />
        ) : <div className="empty welcome"><span className="empty-glyph">◇</span><span className="eyebrow">A clearer painting workflow</span><h1>Turn a colour idea into repeatable steps.</h1><p>Create a scheme, divide it into model areas and attach exact paints from the catalogue. Everything stays private in your browser.</p><button className="button primary" onClick={() => setNewSchemeOpen(true)}>Create your first scheme</button><button className="text-button" onClick={() => importRef.current?.click()}>or import a 40k Companion backup</button></div> : <Catalogue paints={paints} owned={owned} mode={view} onToggle={(id) => update((current) => ({ ...current, ownedPaintIds: current.ownedPaintIds.includes(id) ? current.ownedPaintIds.filter((item) => item !== id) : [...current.ownedPaintIds, id] }))} />}
      </main>
      <button className="mobile-menu" onClick={() => document.querySelector('.sidebar')?.classList.toggle('open')} aria-label="Toggle navigation">☰</button>
      {newSchemeOpen && <NewScheme onClose={() => setNewSchemeOpen(false)} onCreate={(name, notes) => { const next = createScheme(name, notes); update((current) => ({ ...current, schemes: [...current.schemes, next] })); setSelectedId(next.id); setView('schemes'); setNewSchemeOpen(false) }} />}
      {selected && editingScheme && <EditScheme scheme={selected} onClose={() => setEditingScheme(false)} onSave={(next) => { update((current) => ({ ...current, schemes: current.schemes.map((item) => item.id === next.id ? next : item) })); setEditingScheme(false) }} />}
      {editingRecipe && <RecipeEditor initial={editingRecipe} paints={paints} owned={owned} schemes={workspace.schemes} onSave={saveRecipeDraft} onClose={() => setEditingRecipe(null)} />}
      {toast && <div className="toast" role="status">{toast.message}{toast.action && <button onClick={toast.action.run}>{toast.action.label}</button>}</div>}
    </div>
  )
}
