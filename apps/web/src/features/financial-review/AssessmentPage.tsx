import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "../../analytics";
import { PreliminaryDisclaimer } from "../../components/PreliminaryDisclaimer";
import { saveAssessment } from "./adapters/assessment-storage";
import {
  type FinancialAssessmentInput,
  validateFinancialAssessment,
} from "./adapters/input-to-financial-state";

const steps = [
  {
    title: "Monthly cash flow",
    description: "Your regular monthly income and spending.",
    fields: [
      ["monthlyIncome", "Monthly take-home income"],
      ["essentialExpenses", "Essential monthly expenses"],
      ["discretionaryExpenses", "Discretionary monthly expenses"],
    ],
  },
  {
    title: "Debt obligations",
    description: "Include current balances, even when repayments feel manageable.",
    fields: [
      ["creditCardOutstanding", "Credit-card outstanding"],
      ["totalMonthlyEmi", "Total monthly EMIs"],
      ["unsecuredDebtOutstanding", "Unsecured debt outstanding"],
    ],
  },
  {
    title: "Emergency savings",
    description: "Balances you could access during an emergency.",
    fields: [
      ["savingsBalance", "Savings-account balance"],
      ["cashBalance", "Cash balance"],
      ["liquidFundBalance", "Liquid-fund balance"],
      ["otherEmergencyEligibleAssets", "Other emergency-eligible assets"],
    ],
  },
] as const satisfies readonly {
  title: string;
  description: string;
  fields: readonly (readonly [keyof FinancialAssessmentInput, string])[];
}[];

const empty: FinancialAssessmentInput = {
  monthlyIncome: 0,
  essentialExpenses: 0,
  discretionaryExpenses: 0,
  totalMonthlyEmi: 0,
  creditCardOutstanding: 0,
  unsecuredDebtOutstanding: 0,
  savingsBalance: 0,
  cashBalance: 0,
  liquidFundBalance: 0,
  otherEmergencyEligibleAssets: 0,
};

export function AssessmentPage() {
  const [input, setInput] = useState<FinancialAssessmentInput>(empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FinancialAssessmentInput, string>>>({});
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    track("assessment_started");
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const validateCurrentStep = () => {
    const allErrors = validateFinancialAssessment(input);
    return Object.fromEntries(
      Object.entries(allErrors).filter(([key]) =>
        steps[step].fields.some(([field]) => field === key),
      ),
    ) as Partial<Record<keyof FinancialAssessmentInput, string>>;
  };

  const next = () => {
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      track("assessment_validation_failed", { step: step + 1 });
      const firstKey = Object.keys(stepErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }
    track("assessment_step_completed", { step: step + 1 });
    setStep((value) => value + 1);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateFinancialAssessment(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      track("assessment_validation_failed", { step: step + 1 });
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }
    saveAssessment(input);
    track("assessment_step_completed", { step: 3 });
    track("assessment_completed", {
      completionTimeSeconds: Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
    });
    window.location.assign("/review");
  };

  const current = steps[step];
  return (
    <main className="assessment-shell">
      <header className="assessment-header">
        <a className="brand" href="/">Lakshay</a>
        <span>Step {step + 1} of {steps.length}</span>
      </header>
      <div className="progress" aria-label={`Assessment step ${step + 1} of ${steps.length}`}>
        <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <form className="assessment-card" onSubmit={submit} noValidate>
        <p className="eyebrow">Preliminary assessment · INR</p>
        <h1 ref={headingRef} tabIndex={-1}>{current.title}</h1>
        <p>{current.description}</p>
        <fieldset>
          <legend className="sr-only">{current.title}</legend>
          {current.fields.map(([key, label]) => (
            <label key={key} htmlFor={key}>
              {label}
              <span className="money-input">
                <span aria-hidden="true">₹</span>
                <input
                  id={key}
                  name={key}
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={input[key] || ""}
                  onChange={(event) =>
                    setInput({ ...input, [key]: event.target.value === "" ? 0 : Number(event.target.value) })
                  }
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                />
              </span>
              {errors[key] && <small id={`${key}-error`} className="error" role="alert">{errors[key]}</small>}
            </label>
          ))}
        </fieldset>
        <div className="form-actions">
          {step > 0 && <button className="button secondary" type="button" onClick={() => setStep((value) => value - 1)}>Back</button>}
          {step < steps.length - 1
            ? <button className="button primary" type="button" onClick={next}>Continue</button>
            : <button className="button primary" type="submit">Generate my financial review</button>}
        </div>
      </form>
      <PreliminaryDisclaimer />
      <p className="privacy-note">Your answers stay in this browser session. Financial amounts are never included in analytics.</p>
    </main>
  );
}
