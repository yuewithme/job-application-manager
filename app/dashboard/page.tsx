import Dashboard from "@/components/dashboard/Dashboard";
import { getDashboardPageData } from "@/lib/dashboard-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardPageData();

  return <Dashboard data={data} />;
}
