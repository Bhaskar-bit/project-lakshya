export type AnalyticsEventName =
  | "landing_viewed"
  | "assessment_started"
  | "assessment_step_completed"
  | "assessment_validation_failed"
  | "assessment_completed"
  | "review_viewed"
  | "top_action_viewed"
  | "explainability_opened"
  | "assessment_restarted"
  | "feedback_submitted";

export interface AnalyticsProperties {
  readonly assessmentCoverage?: number;
  readonly grade?: string;
  readonly topRecommendationCode?: string;
  readonly actionPlanStatus?: string;
  readonly completionTimeSeconds?: number;
  readonly step?: number;
  readonly useful?: boolean;
  readonly feedbackReason?: string;
}

export interface AnalyticsEvent {
  readonly name: AnalyticsEventName;
  readonly properties: AnalyticsProperties;
  readonly occurredAt: string;
}

const ANALYTICS_KEY = "lakshya.analytics.v1";
const ALLOWED_PROPERTIES = new Set<keyof AnalyticsProperties>([
  "assessmentCoverage",
  "grade",
  "topRecommendationCode",
  "actionPlanStatus",
  "completionTimeSeconds",
  "step",
  "useful",
  "feedbackReason",
]);

/** Privacy boundary: only explicitly allowlisted, non-financial properties are retained. */
export function track(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
  storage: Storage = localStorage,
  now: () => Date = () => new Date(),
): void {
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => ALLOWED_PROPERTIES.has(key as keyof AnalyticsProperties) && value !== undefined),
  ) as AnalyticsProperties;
  const event: AnalyticsEvent = { name, properties: safeProperties, occurredAt: now().toISOString() };
  let existing: AnalyticsEvent[] = [];
  try {
    const raw = storage.getItem(ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed;
    }
  } catch {
    existing = [];
  }
  try {
    storage.setItem(ANALYTICS_KEY, JSON.stringify([...existing.slice(-99), event]));
  } catch {
    // Analytics must never block the financial assessment.
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lakshya:analytics", { detail: event }));
  }
}
