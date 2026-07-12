import { useState, type FormEvent } from "react";
import { saveAssessment } from "./adapters/assessment-storage";
import { type FinancialAssessmentInput, validateFinancialAssessment } from "./adapters/input-to-financial-state";
import { demoFinancialState } from "./fixtures/demo-financial-state";

const fields: readonly [keyof FinancialAssessmentInput, string, string][] = [
  ["monthlyIncome", "Monthly take-home income", "Monthly cash flow"], ["essentialExpenses", "Essential monthly expenses", "Monthly cash flow"], ["discretionaryExpenses", "Discretionary monthly expenses", "Monthly cash flow"],
  ["creditCardOutstanding", "Credit-card outstanding", "Debt obligations"], ["totalMonthlyEmi", "Total monthly EMIs", "Debt obligations"], ["unsecuredDebtOutstanding", "Unsecured debt outstanding", "Debt obligations"],
  ["savingsBalance", "Savings-account balance", "Emergency savings"], ["cashBalance", "Cash balance", "Emergency savings"], ["liquidFundBalance", "Liquid-fund balance", "Emergency savings"],
];
const empty: FinancialAssessmentInput = { monthlyIncome: 0, essentialExpenses: 0, discretionaryExpenses: 0, totalMonthlyEmi: 0, creditCardOutstanding: 0, unsecuredDebtOutstanding: 0, savingsBalance: 0, cashBalance: 0, liquidFundBalance: 0 };

export function AssessmentPage() {
  const [input, setInput] = useState<FinancialAssessmentInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FinancialAssessmentInput, string>>>({});
  const submit = (event: FormEvent) => { event.preventDefault(); const next = validateFinancialAssessment(input); setErrors(next); if (Object.keys(next).length) return; saveAssessment(input); window.location.assign("/review"); };
  const loadExample = () => { const input = { monthlyIncome: demoFinancialState.cashFlow.monthlyIncome, essentialExpenses: demoFinancialState.cashFlow.monthlyEssentialExpenses, discretionaryExpenses: demoFinancialState.cashFlow.monthlyDiscretionaryExpenses, totalMonthlyEmi: 0, creditCardOutstanding: 100_000, unsecuredDebtOutstanding: 0, savingsBalance: 190_000, cashBalance: 40_000, liquidFundBalance: 100_000 }; saveAssessment(input); window.location.assign("/review/demo"); };
  return <main className="review"><section><span className="eyebrow">Under two minutes</span><h1>Build your preliminary financial review</h1><p>We currently assess cash flow, debt, and emergency savings. Your assessment is intentionally partial.</p><button type="button" onClick={loadExample}>Load example</button></section><form className="assessment-form" onSubmit={submit}>{["Monthly cash flow", "Debt obligations", "Emergency savings"].map((section) => <fieldset key={section}><legend>{section}</legend>{fields.filter(([, , group]) => group === section).map(([key, label]) => <label key={key}>{label}<input type="number" min="0" inputMode="decimal" value={input[key] || ""} onChange={(event) => setInput({ ...input, [key]: event.target.value === "" ? 0 : Number(event.target.value) })} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} />{errors[key] && <small id={`${key}-error`} className="error">{errors[key]}</small>}</label>)}</fieldset>)}<button type="submit">Generate my financial review</button></form></main>;
}
