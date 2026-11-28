import SingleCategoryClient from "./single-category-client";

export default async function YapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SingleCategoryClient slug={slug} />;
}
