import { Suspense } from "react";
import SingleYapClient from "./single-yap-client";

interface YapPageProps {
  params: Promise<{ slug: string }>;
}

async function YapContent({ params }: YapPageProps) {
  const { slug } = await params;

  return <SingleYapClient slug={slug} />;
}

export default function YapPage({ params }: YapPageProps) {
  return (
    <Suspense fallback={<YapLoading />}>
      <YapContent params={params} />
    </Suspense>
  );
}

function YapLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl animate-pulse space-y-5">
        <div className="h-6 w-32 rounded-full bg-muted" />
        <div className="h-12 w-full rounded-lg bg-muted" />
        <div className="h-12 w-3/4 rounded-lg bg-muted" />
        <div className="aspect-video rounded-3xl bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </main>
  );
}