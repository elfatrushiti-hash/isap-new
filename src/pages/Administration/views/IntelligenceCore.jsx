import { useMemo, useState } from 'react'
import { BrainCircuit, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { analyseWithRules } from '../../../services/ruleIntelligenceService.js'

export default function IntelligenceCore(){
 const { intelligenceKnowledge, updateIntelligenceKnowledge }=useIsapStore(); const [sample,setSample]=useState('We still perform most credit checks manually and want to improve onboarding.');
 const result=useMemo(()=>analyseWithRules({text:sample},intelligenceKnowledge),[sample,intelligenceKnowledge]);
 const patchRule=(id,changes)=>updateIntelligenceKnowledge({...intelligenceKnowledge,dictionaries:intelligenceKnowledge.dictionaries.map(r=>r.id===id?{...r,...changes}:r)});
 const addRule=()=>updateIntelligenceKnowledge({...intelligenceKnowledge,dictionaries:[...intelligenceKnowledge.dictionaries,{id:`rule-${Date.now()}`,label:'New rule',type:'topic',terms:[],products:[],weight:5}]});
 const removeRule=(id)=>updateIntelligenceKnowledge({...intelligenceKnowledge,dictionaries:intelligenceKnowledge.dictionaries.filter(r=>r.id!==id)});
 return <div className="admin-view-stack intelligence-core">
  <div className="admin-panel intelligence-core-hero"><div><span className="admin-panel-kicker">ISAP Intelligence Core</span><h2>Deterministic intelligence first.</h2><p>Dictionary, taxonomy and scoring run locally in the browser. External AI is structurally reserved but hard-disabled.</p></div><div className="intelligence-mode-card"><ShieldCheck size={22}/><strong>RULE MODE</strong><span>No external AI transmission</span></div></div>
  <div className="admin-panel"><div className="admin-toolbar"><div><span>Knowledge dictionary</span><small>{intelligenceKnowledge.dictionaries.length} explainable rules</small></div><button className="admin-primary-button" onClick={addRule}><Plus size={16}/> Add rule</button></div>
   <div className="intelligence-rule-list">{intelligenceKnowledge.dictionaries.map(rule=><div className="intelligence-rule" key={rule.id}>
    <input value={rule.label} onChange={e=>patchRule(rule.id,{label:e.target.value})}/><select value={rule.type} onChange={e=>patchRule(rule.id,{type:e.target.value})}><option value="topic">Topic</option><option value="pain-point">Pain point</option><option value="buying-signal">Buying signal</option><option value="business-impact">Business impact</option><option value="objection">Objection</option></select><input value={(rule.terms||[]).join(', ')} onChange={e=>patchRule(rule.id,{terms:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)})} placeholder="Terms, comma separated"/><input type="number" min="1" max="10" value={rule.weight} onChange={e=>patchRule(rule.id,{weight:Number(e.target.value)})}/><button className="admin-icon-button" onClick={()=>removeRule(rule.id)} title="Delete rule"><Trash2 size={15}/></button>
   </div>)}</div>
  </div>
  <div className="admin-panel intelligence-test"><div><span className="admin-panel-kicker">Rule laboratory</span><h2>Explainability test</h2><textarea value={sample} onChange={e=>setSample(e.target.value)}/></div><div><div className="intelligence-score"><BrainCircuit size={20}/><strong>{result.confidence}%</strong><span>confidence</span></div>{result.matches.map(m=><div className="intelligence-match" key={m.ruleId}><strong>{m.label}</strong><span>{m.type} · {m.score}%</span><p>{m.explanation}</p></div>)}{!result.matches.length&&<p>No rule matched this text.</p>}</div></div>
  <div className="admin-panel intelligence-provider"><div><Save size={18}/><div><strong>External AI provider</strong><p>Interface reserved for a later compliance-approved provider. It is not configured and cannot transmit data in this release.</p></div><span>LOCKED</span></div>
 </div>
}
