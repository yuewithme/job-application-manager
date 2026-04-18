import type { IsoDateTimeString } from "@/types/shared";

export interface Attachment {
  id: string;
  applicationId: string;
  fileName: string;
  fileType: string | null;
  fileUrl: string;
  notes: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface AttachmentListItemDto {
  id: string;
  applicationId: string;
  fileName: string;
  fileType: string | null;
  fileUrl: string;
  createdAt: IsoDateTimeString;
}

export type AttachmentDetailDto = Attachment;

export interface AttachmentFormDto {
  fileName: string;
  fileType: string;
  fileUrl: string;
  notes: string;
}
