import CompanyListPageClient from "@/components/companies/CompanyListPageClient";
import { getCompanyListPageData } from "@/lib/company-service";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const data = await getCompanyListPageData();

  return <CompanyListPageClient data={data} />;
}
