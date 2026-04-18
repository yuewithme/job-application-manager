import { notFound } from "next/navigation";

import ApplicationFormPageClient from "@/components/applications/ApplicationFormPageClient";
import { getApplicationById } from "@/lib/application-service";

export const dynamic = "force-dynamic";

interface EditApplicationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  return <ApplicationFormPageClient mode="edit" application={application} />;
}
