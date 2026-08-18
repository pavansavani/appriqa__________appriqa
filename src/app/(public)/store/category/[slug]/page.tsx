import { ProductCatalog } from "@/components/features/ProductCatalog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProductCatalog initialCategory={resolvedParams.slug} />;
}
