import { useMemo, useState } from 'react'
import { ExternalLink, FileSearch, Globe2, Plus, RefreshCw, ShieldAlert, ShieldCheck, Trash2, X } from 'lucide-react'
import { SOURCE_TRUST, sourceTypeOptions } from '../../data/sourceGovernance.js'
import { getSourceSummary } from '../../services/publicSourceService.js'

const EMPTY_FORM = {
  title: '',
  url: '',
  sourceType: 'corporate-website',
  publishedAt: '',
  content: '',
  notes: ''
}

const trustClass = {
  [SOURCE_TRUST.TRUSTED]: 'trusted',
  [SOURCE_TRUST.ALLOWED]: 'allowed',
  [SOURCE_TRUST.RESTRICTED]: 'restricted',
  [SOURCE_TRUST.BLOCKED]: 'blocked'
}

export default function PublicSourcesPanel({ companyId, sources = [], onAdd, onDelete, onReanalyse }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const companySources = useMemo(() => sources.filter((source) => source.companyId === companyId), [sources, companyId])
  const summary = useMemo(() => getSourceSummary(sources, companyId), [sources, companyId])

  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return
    onAdd?.({ ...form, companyId })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  return (
    <div className="company-stack public-sources-panel">
      <section className="company-card source-governance-banner">
        <div><span className="company-card-icon"><ShieldCheck size={18}/></span><div><h2>Public Source Governance</h2><p>Sources are captured with provenance and analysed locally in RULE MODE. No content is sent to an external AI provider.</p></div></div>
        <button type="button" onClick={() => setShowForm(true)}><Plus size={15}/> Add public source</button>
      </section>

      <div className="source-summary-grid">
        <div><strong>{summary.total}</strong><span>Sources</span></div>
        <div><strong>{summary.trusted}</strong><span>Trusted</span></div>
        <div><strong>{summary.topics.length}</strong><span>Topics detected</span></div>
        <div><strong>{summary.painPoints.length}</strong><span>Pain points</span></div>
      </div>

      {(summary.topics.length > 0 || summary.painPoints.length > 0 || summary.buyingSignals.length > 0) && (
        <section className="company-card source-signal-card">
          <div className="company-card-heading"><div><span className="company-card-icon"><FileSearch size={18}/></span><h2>Rule-based signals from public sources</h2></div></div>
          <div className="source-signal-groups">
            <div><span>Topics</span><div>{summary.topics.map((item) => <em key={item}>{item}</em>)}{!summary.topics.length && <small>No topic detected</small>}</div></div>
            <div><span>Pain points</span><div>{summary.painPoints.map((item) => <em key={item}>{item}</em>)}{!summary.painPoints.length && <small>No pain point detected</small>}</div></div>
            <div><span>Buying signals</span><div>{summary.buyingSignals.map((item) => <em key={item}>{item}</em>)}{!summary.buyingSignals.length && <small>No buying signal detected</small>}</div></div>
          </div>
        </section>
      )}

      <div className="public-source-list">
        {companySources.map((source) => (
          <article className="company-card public-source-card" key={source.id}>
            <div className="public-source-head">
              <div>
                <span className={`source-trust ${trustClass[source.trust] || 'restricted'}`}>{source.trust}</span>
                <span className="source-type">{source.sourceType}</span>
              </div>
              <div className="public-source-actions">
                <button type="button" title="Analyse again" onClick={() => onReanalyse?.(source.id)}><RefreshCw size={15}/></button>
                <button type="button" title="Delete source" onClick={() => onDelete?.(source.id)}><Trash2 size={15}/></button>
              </div>
            </div>
            <h3>{source.title}</h3>
            <a href={source.url} target="_blank" rel="noreferrer"><Globe2 size={14}/>{source.url}<ExternalLink size={13}/></a>
            {source.publishedAt && <p className="source-date">Published: {source.publishedAt}</p>}
            {source.content && <p className="source-content">{source.content}</p>}
            <div className="source-analysis-meta"><span>Confidence <strong>{source.analysis?.confidence || 0}%</strong></span><span>{source.analysis?.provider || 'ISAP Rule Intelligence'}</span><span>External transmission: <strong>NO</strong></span></div>
            {!!source.analysis?.matches?.length && <div className="source-match-list">{source.analysis.matches.slice(0, 6).map((match) => <div key={`${source.id}-${match.ruleId}`}><strong>{match.label}</strong><span>{match.type} · {match.score}%</span><p>{match.explanation}</p></div>)}</div>}
          </article>
        ))}
        {!companySources.length && <section className="company-card source-empty"><ShieldAlert size={24}/><h3>No public sources captured yet</h3><p>Add an official website, annual report, press release or public news source. ISAP stores provenance and analyses the supplied content locally.</p><button type="button" onClick={() => setShowForm(true)}>Add first source</button></section>}
      </div>

      {showForm && (
        <div className="source-dialog-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}>
          <form className="source-dialog" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="source-dialog-head"><div><span>Public source</span><h2>Add source evidence</h2></div><button type="button" onClick={() => setShowForm(false)}><X size={18}/></button></div>
            <label>Title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Annual Report 2025" required/></label>
            <label>URL<input value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} placeholder="https://company.com/..." required/></label>
            <div className="source-form-grid"><label>Source type<select value={form.sourceType} onChange={(event) => setForm((current) => ({ ...current, sourceType: event.target.value }))}>{sourceTypeOptions.map((option) => <option value={option.id} key={option.id}>{option.label} · {option.trust}</option>)}</select></label><label>Published<input type="date" value={form.publishedAt} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}/></label></div>
            <label>Relevant public content<textarea value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} placeholder="Paste the relevant public excerpt here. This text is analysed locally by the ISAP Rule Engine."/></label>
            <label>Internal note<textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Why is this source relevant for the meeting?"/></label>
            <div className="source-dialog-policy"><ShieldCheck size={17}/><span>This delivery does not fetch the URL automatically and does not transmit the pasted content to external AI.</span></div>
            <div className="source-dialog-actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" type="submit">Add & analyse locally</button></div>
          </form>
        </div>
      )}
    </div>
  )
}
