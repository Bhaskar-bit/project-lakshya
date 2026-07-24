import { useEffect } from "react";
import { track } from "./analytics";
import { PreliminaryDisclaimer } from "./components/PreliminaryDisclaimer";

export function LandingPage() {
  useEffect(() => track("landing_viewed"), []);
  return (
    <main className="landing">
      <section className="hero">
        <span className="brand">Lakshay</span>
        <p className="eyebrow">A clearer next step for your money</p>
        <h1>Understand your financial health in under two minutes.</h1>
        <p className="hero-copy">
          Turn a few financial facts into a preliminary assessment and a practical monthly action plan.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/assessment">Start assessment</a>
          <a className="button secondary" href="/review/demo">View example</a>
        </div>
      </section>
      <section className="value-list" aria-labelledby="value-heading">
        <h2 id="value-heading">What you’ll get</h2>
        <ul>
          <li>A preliminary financial-health score</li>
          <li>The biggest issue affecting your finances</li>
          <li>A monthly action plan</li>
          <li>The next action after that</li>
        </ul>
      </section>
      <PreliminaryDisclaimer />
      <p className="privacy-note">Your financial data stays in this browser. We do not send financial amounts to analytics.</p>
    </main>
  );
}
