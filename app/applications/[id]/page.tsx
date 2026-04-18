import { notFound } from "next/navigation";

import ApplicationDetailPage from "@/components/applications/ApplicationDetailPage";
import { getApplicationById } from "@/lib/application-service";

export const dynamic = "force-dynamic";

interface ApplicationDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailRoute({
  params,
}: ApplicationDetailRouteProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  return <ApplicationDetailPage application={application} />;
}
