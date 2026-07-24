import type { ActionViewModel } from "./adapters/conversation-to-view-model";

export function ActionSequence({ actions }: { actions: readonly ActionViewModel[] }) {
  if (!actions.length) {
    return (
      <section className="sequence">
        <p className="eyebrow">What happens afterward?</p>
        <h2>No subsequent action yet</h2>
        <p>The assessment did not produce another sequenced action.</p>
      </section>
    );
  }
  const next = actions[0];
  return (
    <section className="sequence">
      <p className="eyebrow">What happens afterward?</p>
      <h2>Then {next.title}</h2>
      <p>{next.status === "BLOCKED"
        ? `After the current priority is complete, redirect the available monthly allocation toward ${next.title.toLowerCase()}.`
        : `Allocate ${next.allocationValue} after the top action is complete.`}</p>
    </section>
  );
}
