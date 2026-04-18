import type { IsoDateTimeString } from "@/types/shared";

export interface Interview {
  id: string;
  applicationId: string;
  round: number;
  title: string;
  interviewType: string | null;
  scheduledAt: IsoDateTimeString;
  location: string | null;
  meetingUrl: string | null;
  interviewer: string | null;
  result: string | null;
  notes: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface InterviewListItemDto {
  id: string;
  applicationId: string;
  round: number;
  title: string;
  interviewType: string | null;
  scheduledAt: IsoDateTimeString;
  location: string | null;
  interviewer: string | null;
  result: string | null;
}

export interface InterviewScheduleItemDto {
  id: string;
  applicationId: string;
  companyName: string;
  jobTitle: string;
  round: number;
  title: string;
  interviewType: string | null;
  scheduledAt: IsoDateTimeString;
  result: string | null;
}

export interface InterviewSchedulePageDto {
  items: InterviewScheduleItemDto[];
  currentTime: IsoDateTimeString;
}

export type InterviewDetailDto = Interview;

export interface InterviewFormDto {
  round: number;
  title: string;
  interviewType: string;
  scheduledAt: string;
  location: string;
  meetingUrl: string;
  interviewer: string;
  result: string;
  notes: string;
}

export interface CreateInterviewRecordDto {
  roundName: string;
  interviewAt: string;
  mode?: string | null;
  result?: string | null;
  notes?: string | null;
}

export interface InterviewRecordFormDto {
  roundName: string;
  interviewAt: string;
  mode: string;
  result: string;
  notes: string;
}
