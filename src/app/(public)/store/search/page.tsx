import { ProductCatalog } from "@/components/features/ProductCatalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "all";

  return <ProductCatalog initialSearchQuery={q} initialCategory={category} />;
}
