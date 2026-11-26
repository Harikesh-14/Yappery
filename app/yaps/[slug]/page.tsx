import SingleYapClient from "./single-yap-client";

export default async function YapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SingleYapClient slug={slug} />;
}
