import ApplicationFormPageClient from "@/components/applications/ApplicationFormPageClient";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  return <ApplicationFormPageClient mode="create" />;
}
