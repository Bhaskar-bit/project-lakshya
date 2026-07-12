import type { ActionViewModel } from "./adapters/conversation-to-view-model";

export function TopActionCard({ action }: { action?: ActionViewModel }) {
  if (!action) return null;
  return <section className="top-action"><span className="eyebrow">What should I do now?</span><h2>{action.title}</h2>{action.explanation ? <p className="blocked">{action.explanation}</p> : <div className="action-grid"><div><span>{action.primaryLabel}</span><b>{action.primaryValue}</b></div><div><span>{action.allocationLabel}</span><b>{action.allocationValue}</b></div><div><span>{action.completionLabel}</span><b>{action.completionValue}</b></div><div><span>{action.impactLabel}</span><b>{action.impactValue}</b></div></div>}<button type="button">Start this month</button></section>;
}
