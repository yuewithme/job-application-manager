import type { ApplicationStatusValue, IsoDateTimeString } from "@/types/shared";

export interface ApplicationStageLog {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatusValue | null;
  toStatus: ApplicationStatusValue;
  note: string | null;
  changedAt: IsoDateTimeString;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export type ApplicationStageLogDetailDto = ApplicationStageLog;
