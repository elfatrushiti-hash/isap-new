const normalize = (value='') => String(value).toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')

export function analyseWithRules(input, knowledge) {
  const text = normalize([input?.title,input?.description,input?.text,input?.notes,...(input?.tags||[])].filter(Boolean).join(' '))
  const matches = (knowledge?.dictionaries || []).map((rule) => {
    const terms = (rule.terms || []).filter((term) => text.includes(normalize(term)))
    if (!terms.length) return null
    const score = Math.min(100, Math.round((rule.weight || 5) * 7 + terms.length * 9))
    return { ruleId:rule.id, label:rule.label, type:rule.type, terms, products:rule.products || [], score,
      explanation:`Matched ${terms.map((term)=>`“${term}”`).join(', ')} against ${rule.label}.` }
  }).filter(Boolean).sort((a,b)=>b.score-a.score)
  const confidence = matches.length ? Math.round(matches.reduce((sum,item)=>sum+item.score,0)/matches.length) : 0
  return { provider:'ISAP Rule Intelligence', mode:'RULE', externalTransmission:false, confidence, matches,
    topics:matches.filter(x=>x.type==='topic').map(x=>x.label), painPoints:matches.filter(x=>x.type==='pain-point').map(x=>x.label),
    buyingSignals:matches.filter(x=>x.type==='buying-signal').map(x=>x.label), products:[...new Set(matches.flatMap(x=>x.products))] }
}

export function validateKnowledge(knowledge) {
  return (knowledge?.dictionaries || []).every((rule)=>rule.id && rule.label && Array.isArray(rule.terms))
}
