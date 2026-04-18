import ApplicationFormPageClient from "@/components/applications/ApplicationFormPageClient";
import { prisma } from "@/lib/prisma";
import type { UserSummary } from "@/types";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const users: UserSummary[] = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <ApplicationFormPageClient mode="create" users={users} />;
}
