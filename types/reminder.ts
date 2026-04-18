import type { IsoDateTimeString } from "@/types/shared";

export interface Reminder {
  id: string;
  applicationId: string;
  title: string;
  remindAt: IsoDateTimeString;
  isCompleted: boolean;
  notes: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface ReminderListItemDto {
  id: string;
  applicationId: string;
  title: string;
  remindAt: IsoDateTimeString;
  isCompleted: boolean;
}

export type ReminderDetailDto = Reminder;

export interface ReminderFormDto {
  title: string;
  remindAt: string;
  isCompleted: boolean;
  notes: string;
}
