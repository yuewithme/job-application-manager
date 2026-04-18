import { ApplicationListItem } from './types';

// 使相对时间基于现在以确保Mock数据效果更好
const baseDate = new Date(); 

const offsetDay = (days: number, hours: number = 0) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

export const mockData: ApplicationListItem[] = [
  {
    id: "app-001",
    companyName: "Google",
    positionName: "Frontend Software Engineer",
    status: "面试中",
    priority: "high",
    deadlineAt: null,
    nextAction: "准备第三轮技术连环面（系统设计）",
    nextActionAt: offsetDay(0, 2), // 今天
    updatedAt: offsetDay(-1) // 昨天
  },
  {
    id: "app-002",
    companyName: "ByteDance",
    positionName: "Senior React Developer",
    status: "笔试中",
    priority: "high",
    deadlineAt: offsetDay(1, 12), // 明天截止
    nextAction: "完成在线算法笔试",
    nextActionAt: offsetDay(1, -2), 
    updatedAt: offsetDay(0, -5) // 今天早些时候
  },
  {
    id: "app-003",
    companyName: "Microsoft",
    positionName: "Software Engineer II",
    status: "待投递",
    priority: "medium",
    deadlineAt: offsetDay(3),
    nextAction: "根据JD修改简历并提交",
    nextActionAt: offsetDay(0, 5), // 今天晚些时候
    updatedAt: offsetDay(-3)
  },
  {
    id: "app-004",
    companyName: "Amazon",
    positionName: "Frontend Engineer",
    status: "Offer",
    priority: "high",
    deadlineAt: offsetDay(7),
    nextAction: "回复Offer接受意向及体检表",
    nextActionAt: offsetDay(1),
    updatedAt: offsetDay(0, -1)
  },
  {
    id: "app-005",
    companyName: "Meta",
    positionName: "UI Engineer",
    status: "已投递",
    priority: "medium",
    deadlineAt: null,
    nextAction: "等待初筛结果",
    nextActionAt: null,
    updatedAt: offsetDay(-2)
  },
  {
    id: "app-006",
    companyName: "Vercel",
    positionName: "Design Engineer",
    status: "面试中",
    priority: "high",
    deadlineAt: null,
    nextAction: "和创始人聊一聊最终期望",
    nextActionAt: offsetDay(0, 4), // 今天
    updatedAt: offsetDay(0, -8) 
  },
  {
    id: "app-007",
    companyName: "Stripe",
    positionName: "Frontend Engineer",
    status: "收藏中",
    priority: "low",
    deadlineAt: offsetDay(10),
    nextAction: "评估自己的技术堆栈匹配度",
    nextActionAt: offsetDay(4),
    updatedAt: offsetDay(-5)
  },
  {
    id: "app-008",
    companyName: "Netflix",
    positionName: "Senior UI Engineer",
    status: "已结束",
    priority: "medium",
    deadlineAt: null,
    nextAction: null,
    nextActionAt: null,
    updatedAt: offsetDay(-10)
  }
];

export const mockApplicationDetail: import('./types').ApplicationDetail = {
  id: "app-001",
  companyName: "Google",
  positionName: "Frontend Software Engineer",
  status: "面试中",
  priority: "high",
  deadlineAt: offsetDay(10),
  appliedAt: offsetDay(-14),
  nextAction: "准备第三轮技术连环面（系统设计）",
  nextActionAt: offsetDay(0, 2),
  source: "内推 (通过前同事)",
  location: "Mountain View, CA / Remote",
  notes: "重点复习前端系统设计，比如如何设计一个大型的实时组件协同文档系统。还需要准备Behavior Questions。",
  updatedAt: offsetDay(-1)
};

export const mockStageLogs: import('./types').StageLogItem[] = [
  { id: "log-1", stageType: "已创建 / 收藏", changedAt: offsetDay(-15), remark: "从招聘板上看到了这个岗位" },
  { id: "log-2", stageType: "已投递", changedAt: offsetDay(-14), remark: "找前同事拿了内推链接并完善了简历" },
  { id: "log-3", stageType: "笔试中", changedAt: offsetDay(-10), remark: "收到 OA，限时完成" },
  { id: "log-4", stageType: "面试中", changedAt: offsetDay(-5), remark: "OA通过，HR通知开始进技术轮" }
];

export const mockInterviews: import('./types').InterviewItem[] = [
  { id: "int-1", roundName: "第一轮（技术基础）", interviewAt: offsetDay(-3), mode: "Google Meet", result: "通过", notes: "问了DOM Diff原理，手写防抖节流及Promise.all" },
  { id: "int-2", roundName: "第二轮（业务线交叉面）", interviewAt: offsetDay(-1), mode: "Google Meet", result: "通过", notes: "主要是项目经历深挖，还写了一个Tree树的扁平化" },
  { id: "int-3", roundName: "第三轮（系统设计）", interviewAt: offsetDay(0, 2), mode: "Google Meet", result: "待定/未面", notes: "接下来的硬仗" }
];

export const mockInterviewSchedules: import('./types').InterviewScheduleItem[] = [
  { id: "sch-1", companyName: "Google", positionName: "Frontend Software Engineer", roundName: "第一轮（技术基础）", interviewAt: offsetDay(-3), mode: "Google Meet", result: "通过" },
  { id: "sch-2", companyName: "Google", positionName: "Frontend Software Engineer", roundName: "第二轮（业务线交叉面）", interviewAt: offsetDay(-1), mode: "Google Meet", result: "通过" },
  { id: "sch-3", companyName: "Google", positionName: "Frontend Software Engineer", roundName: "第三轮（系统设计）", interviewAt: offsetDay(0, 2), mode: "Google Meet", result: "待定/未面" },
  { id: "sch-4", companyName: "ByteDance", positionName: "Senior React Developer", roundName: "前端一面", interviewAt: offsetDay(1, -2), mode: "飞书视频", result: "待定/未面" },
  { id: "sch-5", companyName: "Microsoft", positionName: "Software Engineer II", roundName: "HR面", interviewAt: offsetDay(3), mode: "Teams", result: "待定/未面" },
  { id: "sch-6", companyName: "Netflix", positionName: "Senior UI Engineer", roundName: "终面", interviewAt: offsetDay(-10), mode: "Zoom", result: "拒绝" }
];

export const mockCompanyList: import('./types').CompanyListItem[] = [
  { companyName: "Google", applicationCount: 3, activeApplicationCount: 2, topStatus: "面试中", latestUpdatedAt: offsetDay(-1), hasUpcomingDeadline: false },
  { companyName: "ByteDance 字节跳动", applicationCount: 2, activeApplicationCount: 2, topStatus: "笔试中", latestUpdatedAt: offsetDay(0, -5), hasUpcomingDeadline: true },
  { companyName: "Tencent 腾讯", applicationCount: 1, activeApplicationCount: 1, topStatus: "待投递", latestUpdatedAt: offsetDay(-2), hasUpcomingDeadline: true },
  { companyName: "Alibaba 阿里巴巴", applicationCount: 1, activeApplicationCount: 0, topStatus: "已结束", latestUpdatedAt: offsetDay(-10), hasUpcomingDeadline: false },
  { companyName: "Microsoft", applicationCount: 2, activeApplicationCount: 1, topStatus: "待投递", latestUpdatedAt: offsetDay(-3), hasUpcomingDeadline: false },
  { companyName: "Amazon", applicationCount: 1, activeApplicationCount: 1, topStatus: "Offer", latestUpdatedAt: offsetDay(0, -1), hasUpcomingDeadline: false }
];

export const mockOffers: import('./types').OfferListItem[] = [
  { 
    id: "offer-1", 
    companyName: "Baidu 百度", 
    positionName: "AIGC 前端研发", 
    priority: "high", 
    deadlineAt: offsetDay(2, 12), // 即将到期 
    nextAction: "回复猎头确认入职意向", 
    nextActionAt: offsetDay(1), 
    updatedAt: offsetDay(0, -5) 
  },
  { 
    id: "offer-2", 
    companyName: "Amazon", 
    positionName: "Frontend Engineer", 
    priority: "high", 
    deadlineAt: offsetDay(7), 
    nextAction: "提交背景调查材料", 
    nextActionAt: offsetDay(5), 
    updatedAt: offsetDay(0, -1) 
  },
  { 
    id: "offer-3", 
    companyName: "Shopee", 
    positionName: "Web Frontend / Singapore", 
    priority: "medium", 
    deadlineAt: offsetDay(-1), // 已经过期 
    nextAction: "已拒", 
    nextActionAt: null, 
    updatedAt: offsetDay(-2) 
  }
];
