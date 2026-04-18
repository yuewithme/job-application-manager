import InterviewSchedulePageClient from "@/components/interviews/InterviewSchedulePageClient";
import { getInterviewSchedulePageData } from "@/lib/interview-service";

export const dynamic = "force-dynamic";

export default async function InterviewsPage() {
  const data = await getInterviewSchedulePageData();

  return <InterviewSchedulePageClient data={data} />;
}
