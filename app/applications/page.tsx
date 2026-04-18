import ApplicationListPageClient from "@/components/applications/ApplicationListPageClient";
import {
  buildApplicationsPath,
  readApplicationListFilters,
  toApplicationListPageDto,
  toApplicationListQuery,
  type ApplicationPageSearchParams,
} from "@/lib/applications";
import { listApplications } from "@/lib/application-service";

export const dynamic = "force-dynamic";

interface ApplicationsPageProps {
  searchParams?: Promise<ApplicationPageSearchParams>;
}

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const filters = readApplicationListFilters(resolvedSearchParams);
  const result = await listApplications(toApplicationListQuery(filters));
  const data = toApplicationListPageDto(result);

  return (
    <ApplicationListPageClient
      key={buildApplicationsPath(filters)}
      data={data}
      filters={filters}
    />
  );
}
