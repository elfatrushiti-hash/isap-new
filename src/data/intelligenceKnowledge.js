export const defaultKnowledge = {
  dictionaries: [
    { id:'credit-information', label:'Credit Information', type:'topic', terms:['credit check','creditworthiness','bonitaet','bonitätsprüfung','scoring','credit risk'], products:['Credit Information'], weight:9 },
    { id:'collections', label:'Collections', type:'topic', terms:['collections','debt collection','overdue','arrears','receivables','dso'], products:['Collections'], weight:9 },
    { id:'fraud', label:'Fraud Prevention', type:'topic', terms:['fraud','identity fraud','fraud prevention','suspicious transaction'], products:['Fraud Prevention'], weight:10 },
    { id:'manual-process', label:'Manual process', type:'pain-point', terms:['manual','spreadsheet','excel','handarbeit','manuell'], products:[], weight:7 },
    { id:'onboarding', label:'Onboarding efficiency', type:'business-impact', terms:['onboarding','customer onboarding','application process'], products:['Credit Information'], weight:6 },
    { id:'cost-reduction', label:'Cost reduction', type:'buying-signal', terms:['cost reduction','reduce cost','efficiency','savings','kosten senken'], products:['Collections'], weight:6 }
  ],
  settings: { explainability:true, minimumConfidence:45, externalAiEnabled:false, mode:'RULE' }
}
