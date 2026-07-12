import { HealthGrade } from "../models/HealthReport.js";

/** Interprets a numeric health score as a grade. */
export interface GradePolicy {
  gradeFor(score: number): HealthGrade;
}

/** Default v1 interpretation of scores from 0 to 100. */
export class DefaultGradePolicy implements GradePolicy {
  public gradeFor(score: number): HealthGrade {
    if (score >= 80) return HealthGrade.EXCELLENT;
    if (score >= 60) return HealthGrade.GOOD;
    if (score >= 40) return HealthGrade.FAIR;
    if (score >= 20) return HealthGrade.POOR;
    return HealthGrade.CRITICAL;
  }
}
