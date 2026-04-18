export type ApplicationListItem = {
  id: string
  companyName: string
  positionName: string
  status: "收藏中" | "待投递" | "已投递" | "笔试中" | "面试中" | "Offer" | "已结束"
  priority: "low" | "medium" | "high"
  deadlineAt: string | null
  nextAction: string | null
  nextActionAt: string | null
  updatedAt: string
}

export type ApplicationFormValues = {
  companyName: string
  positionName: string
  status: "收藏中" | "待投递" | "已投递" | "笔试中" | "面试中" | "Offer" | "已结束"
  priority: "low" | "medium" | "high"
  deadlineAt: string | null
  appliedAt: string | null
  nextAction: string | null
  nextActionAt: string | null
  source: string | null
  location: string | null
  notes: string | null
}

export type ApplicationDetail = {
  id: string
  companyName: string
  positionName: string
  status: "收藏中" | "待投递" | "已投递" | "笔试中" | "面试中" | "Offer" | "已结束"
  priority: "low" | "medium" | "high"
  deadlineAt: string | null
  appliedAt: string | null
  nextAction: string | null
  nextActionAt: string | null
  source: string | null
  location: string | null
  notes: string | null
  updatedAt: string
}

export type StageLogItem = {
  id: string
  stageType: string
  changedAt: string
  remark: string | null
}

export type InterviewItem = {
  id: string
  roundName: string
  interviewAt: string
  mode: string | null
  result: string | null
  notes: string | null
}

export type InterviewScheduleItem = {
  id: string
  companyName: string
  positionName: string
  roundName: string
  interviewAt: string
  mode: string | null
  result: string | null
}

export type CompanyListItem = {
  companyName: string
  applicationCount: number
  activeApplicationCount: number
  topStatus: "收藏中" | "待投递" | "已投递" | "笔试中" | "面试中" | "Offer" | "已结束"
  latestUpdatedAt: string
  hasUpcomingDeadline: boolean
}

export type OfferListItem = {
  id: string
  companyName: string
  positionName: string
  priority: "low" | "medium" | "high"
  deadlineAt: string | null
  nextAction: string | null
  nextActionAt: string | null
  updatedAt: string
}