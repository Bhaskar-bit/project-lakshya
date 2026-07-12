import type { ActionViewModel } from "./adapters/conversation-to-view-model";

export function ActionSequence({ actions }: { actions: readonly ActionViewModel[] }) {
  if (!actions.length) return null;
  const next = actions[0];
  return <section className="sequence"><span className="eyebrow">What happens afterward?</span><h2>Then {next.title}</h2><p>{next.status === "BLOCKED" ? next.explanation : `Allocate ${next.allocationValue} after the top action is complete.`}</p></section>;
}
