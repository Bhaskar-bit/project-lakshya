import { useState } from "react";
import { track } from "../../analytics";
import { saveFeedback } from "./adapters/assessment-storage";

const reasons = [
  "Recommendation felt incorrect",
  "Allocation was unrealistic",
  "I need more explanation",
  "My situation was not represented",
  "Other",
] as const;

export function ReviewFeedback({ assessmentSavedAt }: { assessmentSavedAt: string }) {
  const [useful, setUseful] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (useful === null) return;
    const feedback = {
      assessmentSavedAt,
      useful,
      ...(reason ? { reason } : {}),
      submittedAt: new Date().toISOString(),
    };
    saveFeedback(feedback);
    track("feedback_submitted", { useful, feedbackReason: reason });
    setSubmitted(true);
  };

  return (
    <section className="feedback" aria-labelledby="feedback-heading">
      <p className="eyebrow">Help improve Lakshay</p>
      <h2 id="feedback-heading">Was this recommendation useful?</h2>
      {submitted
        ? <p role="status">Thank you. Your feedback was saved without your financial amounts.</p>
        : <>
          <div className="choice-row" role="group" aria-label="Recommendation usefulness">
            <button className={`button ${useful === true ? "selected" : "secondary"}`} type="button" onClick={() => setUseful(true)}>Yes</button>
            <button className={`button ${useful === false ? "selected" : "secondary"}`} type="button" onClick={() => setUseful(false)}>Not really</button>
          </div>
          {useful !== null && <>
            <fieldset className="feedback-reasons">
              <legend>What was missing?</legend>
              {reasons.map((item) => (
                <label key={item}>
                  <input type="radio" name="feedback-reason" value={item} checked={reason === item} onChange={() => setReason(item)} />
                  {item}
                </label>
              ))}
            </fieldset>
            <button className="button primary" type="button" onClick={submit}>Submit feedback</button>
          </>}
        </>}
    </section>
  );
}
