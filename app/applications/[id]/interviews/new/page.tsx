import { notFound } from "next/navigation";

import InterviewRecordFormPageClient from "@/components/interviews/InterviewRecordFormPageClient";
import { getApplicationById } from "@/lib/application-service";

export const dynamic = "force-dynamic";

interface NewInterviewRecordRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewInterviewRecordRoute({
  params,
}: NewInterviewRecordRouteProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  return (
    <InterviewRecordFormPageClient
      applicationId={application.id}
      companyName={application.companyName}
      jobTitle={application.jobTitle}
      existingInterviewCount={application.interviews.length}
    />
  );
}
