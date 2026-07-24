import type { ActionViewModel } from "./adapters/conversation-to-view-model";

export function TopActionCard({ action }: { action?: ActionViewModel }) {
  if (!action) {
    return (
      <section className="top-action">
        <p className="eyebrow">What should I do now?</p>
        <h2>No action plan was generated</h2>
        <p>There are no actionable recommendations for the current assessment data.</p>
      </section>
    );
  }
  return (
    <section className="top-action">
      <p className="eyebrow">What should I do now?</p>
      <div className="action-heading">
        <h2>{action.title}</h2>
        <span className={`status-pill ${action.status.toLowerCase()}`}>{action.status.replace("_", " ")}</span>
      </div>
      {action.explanation
        ? <div className="blocked-message"><strong>This action cannot start yet.</strong><p>{action.explanation}</p></div>
        : <div className="action-grid">
          <div><span>{action.primaryLabel}</span><b>{action.primaryValue}</b></div>
          <div><span>{action.allocationLabel}</span><b>{action.allocationValue}</b></div>
          <div><span>{action.completionLabel}</span><b>{action.completionValue}</b></div>
          <div><span>{action.impactLabel}</span><b>{action.impactValue}</b></div>
        </div>}
      {action.status === "ACTIONABLE" && <button className="button primary" type="button">Start this month</button>}
    </section>
  );
}
