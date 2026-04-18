import type { ApplicationStatusValue, IsoDateTimeString } from "@/types/shared";

export interface CompanyListItemDto {
  companyName: string;
  applicationCount: number;
  activeApplicationCount: number;
  topStatus: ApplicationStatusValue;
  latestUpdatedAt: IsoDateTimeString;
  hasUpcomingDeadline: boolean;
}

export interface CompanyListPageDto {
  items: CompanyListItemDto[];
}
