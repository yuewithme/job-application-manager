import OfferListPageClient from "@/components/offers/OfferListPageClient";
import { getOfferListPageData } from "@/lib/offer-service";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const data = await getOfferListPageData();

  return <OfferListPageClient data={data} />;
}
