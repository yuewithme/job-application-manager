export type IsoDateTimeString = string;

export const applicationStatusValues = [
  "BOOKMARKED",
  "TODO_APPLY",
  "APPLIED",
  "WRITTEN_TEST",
  "INTERVIEWING",
  "OFFER",
  "CLOSED",
] as const;

export type ApplicationStatusValue = (typeof applicationStatusValues)[number];

export const priorityValues = ["low", "medium", "high"] as const;

export type PriorityValue = (typeof priorityValues)[number];

export interface UserSummary {
  id: string;
  email: string;
  name: string | null;
}
