import type { FindingViewModel } from "./adapters/conversation-to-view-model";

export function FindingsList({ findings }: { findings: readonly FindingViewModel[] }) {
  return <section><h2>Other findings</h2><div className="findings">{findings.map((finding) => <article key={`${finding.sourcePillar}-${finding.title}`}><span>{finding.status}</span><h3>{finding.title}</h3><p>{finding.fact}</p><small>{finding.sourcePillar} · {finding.scoreImpact}</small></article>)}</div></section>;
}
