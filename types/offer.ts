import type { IsoDateTimeString, PriorityValue } from "@/types/shared";

export interface OfferListItemDto {
  id: string;
  companyName: string;
  jobTitle: string;
  priority: PriorityValue;
  deadlineAt: IsoDateTimeString | null;
  nextAction: string | null;
  nextActionAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
}

export interface OfferListPageDto {
  items: OfferListItemDto[];
  currentTime: IsoDateTimeString;
}
