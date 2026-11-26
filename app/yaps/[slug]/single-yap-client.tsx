"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import rehypeHighlight from "rehype-highlight";
import GithubSlugger from "github-slugger";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  Code2,
  Cpu,
  Eye,
  Lightbulb,
  List,
  PenLine,
  Sparkles,
} from "lucide-react";

import type { IYap } from "@/lib/types";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface SingleYapClientProps {
  slug: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  technology: Cpu,
  programming: Code2,
  "ai-ml": Sparkles,
  personal: PenLine,
  ideas: Lightbulb,
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatViews(count: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  })
    .format(count)
    .replace(/K$/, "k");
}

function extractText(node: any): string {
  if (node.type === "text") return node.value ?? "";

  if (node.children) {
    return node.children.map(extractText).join("");
  }

  return "";
}

function extractHeadings(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);

  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];

  visit(tree, "heading", (node: any) => {
    // Keep the TOC focused on meaningful article sections.
    if (node.depth < 2 || node.depth > 3) return;

    const text = extractText(node).trim();

    if (!text) return;

    headings.push({
      id: slugger.slug(text),
      text,
      level: node.depth,
    });
  });

  return headings;
}

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* -------------------------------------------------------------------------- */
/*  Cover                                                                      */
/* -------------------------------------------------------------------------- */

function ArticleCover({ yap }: { yap: IYap }) {
  const [imageError, setImageError] = useState(false);

  const categorySlug = yap.category?.slug?.toLowerCase() ?? "";
  const Icon = categoryIcons[categorySlug] ?? Lightbulb;
  const imageUrl = yap.coverImage?.trim();

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  if (!imageUrl || imageError) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/15 via-secondary/10 to-tertiary/15 shadow-xl shadow-black/5 sm:aspect-21/9">
        {/* Soft dotted texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-3xl border border-border/60 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-md sm:size-24">
            <Icon className="size-9 text-primary sm:size-11" />
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {yap.category?.name ?? "Yappery"}
          </span>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-12 size-72 rounded-full border border-primary/15" />
        <div className="pointer-events-none absolute -bottom-14 -right-4 size-52 rounded-full border border-primary/15" />
        <div className="pointer-events-none absolute -left-16 -top-20 size-60 rounded-full border border-secondary/15" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-xl shadow-black/10 sm:aspect-21/9">
      <Image
        src={imageUrl}
        alt={yap.title}
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, 1024px"
        onError={() => setImageError(true)}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-foreground/5" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table of contents                                                          */
/* -------------------------------------------------------------------------- */

function DesktopToc({
  headings,
  activeHeading,
}: {
  headings: TocItem[];
  activeHeading: string;
}) {
  if (!headings.length) return null;

  return (
    <aside className="fixed right-6 top-32 z-30 hidden w-64 2xl:block">
      <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2">
          <List size={13} className="text-primary" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            On this page
          </span>
        </div>

        <nav className="relative max-h-[50vh] overflow-y-auto pr-1">
          {/* Rail */}
          <span className="absolute bottom-1 left-0.75 top-1 w-px bg-border" />

          <ul className="space-y-0.5">
            {headings.map((heading) => {
              const active = activeHeading === heading.id;

              return (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`group relative flex w-full items-start gap-3 py-1.5 text-left text-xs leading-relaxed transition-colors ${active
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    style={{
                      paddingLeft: heading.level === 3 ? "0.75rem" : "0",
                    }}
                  >
                    <span
                      className={`relative z-10 mt-1.75 size-1.75 shrink-0 rounded-full border transition-all ${active
                        ? "scale-110 border-primary bg-primary"
                        : "border-border bg-card group-hover:border-foreground/40"
                        }`}
                    />
                    <span className="line-clamp-2">{heading.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function MobileToc({
  headings,
  activeHeading,
}: {
  headings: TocItem[];
  activeHeading: string;
}) {
  if (!headings.length) return null;

  return (
    <details className="group overflow-hidden rounded-2xl border border-border bg-card/60 2xl:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <List size={14} className="text-primary" />
          </span>
          In this article
          <span className="font-mono text-[10px] text-muted-foreground">
            {headings.length}
          </span>
        </span>

        <ChevronDown
          size={16}
          className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <nav className="border-t border-border px-3 py-3">
        <ul className="space-y-0.5">
          {headings.map((heading) => {
            const active = activeHeading === heading.id;

            return (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  style={{
                    paddingLeft: heading.level === 3 ? "1.75rem" : "0.75rem",
                  }}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}

/* -------------------------------------------------------------------------- */
/*  Markdown styling                                                           */
/* -------------------------------------------------------------------------- */

const markdownComponents: Components = {
  h1: ({ ...props }) => (
    <h1
      className="mb-6 mt-14 scroll-mt-28 text-3xl font-bold tracking-tight sm:text-4xl"
      {...props}
    />
  ),

  h2: ({ ...props }) => (
    <h2
      className="mb-5 mt-16 scroll-mt-28 border-b border-border pb-4 text-2xl font-semibold tracking-tight first:mt-0 sm:text-[1.75rem]"
      {...props}
    />
  ),

  h3: ({ ...props }) => (
    <h3
      className="mb-3 mt-10 scroll-mt-28 text-xl font-semibold tracking-tight sm:text-[1.35rem]"
      {...props}
    />
  ),

  h4: ({ ...props }) => (
    <h4
      className="mb-3 mt-8 scroll-mt-28 text-lg font-semibold"
      {...props}
    />
  ),

  p: ({ ...props }) => (
    <p
      className="my-6 text-base leading-[1.85] text-foreground/75 sm:text-[17px]"
      {...props}
    />
  ),

  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-medium text-primary underline decoration-primary/30 decoration-2 underline-offset-4 transition-colors hover:decoration-primary"
      {...props}
    >
      {children}
    </a>
  ),

  ul: ({ ...props }) => (
    <ul
      className="my-6 list-disc space-y-2.5 pl-6 text-base leading-[1.8] text-foreground/75 marker:text-primary sm:text-[17px]"
      {...props}
    />
  ),

  ol: ({ ...props }) => (
    <ol
      className="my-6 list-decimal space-y-2.5 pl-6 text-base leading-[1.8] text-foreground/75 marker:font-semibold marker:text-primary sm:text-[17px]"
      {...props}
    />
  ),

  li: ({ ...props }) => <li className="pl-1" {...props} />,

  blockquote: ({ ...props }) => (
    <blockquote
      className="my-10 rounded-r-2xl border-l-4 border-primary bg-linear-to-r from-primary/10 to-transparent px-6 py-5 text-lg italic leading-8 text-foreground/85 [&>p]:my-0 [&>p]:text-inherit"
      {...props}
    />
  ),

  hr: () => (
    <div className="my-14 flex items-center justify-center gap-2" aria-hidden>
      <span className="size-1 rounded-full bg-border" />
      <span className="size-1.5 rounded-full bg-primary/60" />
      <span className="size-1 rounded-full bg-border" />
    </div>
  ),

  strong: ({ ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),

  em: ({ ...props }) => <em className="text-foreground/90" {...props} />,

  pre: ({ ...props }) => (
    <pre
      className="my-8 overflow-x-auto rounded-2xl border border-border bg-[#0d1117] p-5 text-[13px] leading-7 text-[#e6edf3] shadow-lg shadow-black/10 sm:p-6 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
      {...props}
    />
  ),

  code: ({ className, children, ...props }) => (
    <code
      className={`rounded-md font-mono text-[0.88em] ${className
        ? className
        : "border border-border/60 bg-muted px-1.5 py-0.5 text-primary"
        }`}
      {...props}
    >
      {children}
    </code>
  ),

  table: ({ ...props }) => (
    <div className="my-10 w-full overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),

  thead: ({ ...props }) => <thead className="bg-muted/70" {...props} />,

  th: ({ ...props }) => (
    <th
      className="border-b border-border px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground"
      {...props}
    />
  ),

  td: ({ ...props }) => (
    <td
      className="border-b border-border px-5 py-3.5 leading-7 text-foreground/75 group-last:border-0"
      {...props}
    />
  ),

  img: ({ src, alt }) => (
    <span className="my-10 block overflow-hidden rounded-2xl border border-border shadow-lg shadow-black/5">
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        loading="lazy"
        className="h-auto w-full object-cover"
      />
      {alt && (
        <span className="block border-t border-border bg-muted/40 px-4 py-2.5 text-center text-xs text-muted-foreground">
          {alt}
        </span>
      )}
    </span>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SingleYapClient({ slug }: SingleYapClientProps) {
  const [yap, setYap] = useState<IYap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);

  const viewedSlugRef = useRef<string | null>(null);

  const incrementViewCount = async (signal: AbortSignal) => {
    if (!BACKEND_URL || viewedSlugRef.current === slug) return;

    // Prevent duplicate requests during React Strict Mode effect re-runs.
    viewedSlugRef.current = slug;

    try {
      const response = await fetch(
        `${BACKEND_URL}/blogs/${encodeURIComponent(slug)}/view`,
        {
          method: "POST",
          signal,
        }
      );

      if (!response.ok) {
        throw new Error("Unable to increment view count.");
      }

      // Update the displayed count only after the backend confirms success.
      setYap((current) => {
        if (!current) return current;

        return {
          ...current,
          viewsCount: (current.viewsCount ?? 0) + 1,
        };
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      // Allow another attempt if the request failed.
      viewedSlugRef.current = null;

      console.error("Unable to increment yap views:", error);
    }
  };

  // Fetch article
  useEffect(() => {
    const controller = new AbortController();

    async function fetchYap() {
      try {
        if (!BACKEND_URL) {
          throw new Error("Backend URL is not configured.");
        }

        const response = await fetch(
          `${BACKEND_URL}/blogs/${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404 ? "Yap not found." : "Failed to fetch yap."
          );
        }

        const data: IYap = await response.json();
        setYap(data);

        void incrementViewCount(controller.signal);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Error fetching yap:", err);
        setError(true);
        toast.error("Unable to load this yap.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchYap();

    return () => controller.abort();
  }, [slug]);

  const headings = useMemo(
    () => (yap?.content ? extractHeadings(yap.content) : []),
    [yap?.content]
  );

  // Track the currently visible section.
  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length) {
          setActiveHeading(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  // Reading progress indicator.
  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress = (window.scrollY / scrollableHeight) * 100;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });

    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  /* ------------------------------ Loading ------------------------------ */

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="animate-pulse">
          <div className="mb-12 h-9 w-44 rounded-full bg-muted" />

          <div className="mx-auto max-w-3xl">
            <div className="mb-6 h-6 w-36 rounded-full bg-muted" />
            <div className="mb-3 h-11 w-full rounded-lg bg-muted" />
            <div className="mb-8 h-11 w-3/4 rounded-lg bg-muted" />
            <div className="mb-3 h-4 w-full rounded bg-muted" />
            <div className="mb-10 h-4 w-2/3 rounded bg-muted" />
          </div>

          <div className="mx-auto mb-12 aspect-video max-w-5xl rounded-3xl bg-muted sm:aspect-21/9" />

          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------- Error ------------------------------- */

  if (error || !yap) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-muted shadow-sm">
            <BookOpen className="size-7 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Yap not found<span className="text-primary">.</span>
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            This article may have been moved, unpublished, or no longer exists.
          </p>

          <Link
            href="/yaps"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:text-black"
          >
            <ArrowLeft size={15} />
            Back to archive
          </Link>
        </div>
      </main>
    );
  }

  /* ------------------------------ Article ------------------------------ */

  const publishedDate = yap.publishedAt ?? yap.createdAt;

  return (
    <>
      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-50 h-0.75 w-full bg-transparent">
        <div
          className="h-full bg-linear-to-r from-emerald-400 to-emerald-500 transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="relative overflow-x-clip">
        {/* Ambient glow behind the header */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-130 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_65%)]"
        />

        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          {/* Back link */}
          <div className="mb-12 sm:mb-16">
            <Link
              href="/yaps"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Back to writing archive
            </Link>
          </div>

          {/* Header */}
          <header className="mx-auto mb-12 max-w-3xl sm:mb-14">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {yap.category && (
                <Link
                  href={`/yaps?category=${yap.category.slug}`}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  {yap.category.name}
                </Link>
              )}

              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-px w-6 bg-border" />
                Yappery / Article
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              {yap.title}
              <span className="text-primary">.</span>
            </h1>

            {yap.excerpt && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                {yap.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays size={14} className="text-primary" />
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(publishedDate))}
              </span>

              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 size={14} className="text-primary" />
                {yap.readingTime || 1} min read
              </span>

              <span
                title={`${(yap.viewsCount ?? 0).toLocaleString("en-IN")} views`}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Eye size={14} className="text-primary" />

                <span>
                  {formatViews(yap.viewsCount ?? 0)}{" "}
                  {(yap.viewsCount ?? 0) === 1 ? "view" : "views"}
                </span>
              </span>
            </div>
          </header>

          {/* Cover (wider than the text column for an editorial feel) */}
          <div className="mx-auto mb-12 max-w-5xl sm:mb-16">
            <ArticleCover yap={yap} />
          </div>

          {/* Content column */}
          <div className="mx-auto max-w-3xl">
            {/* Mobile / tablet TOC */}
            <div className="mb-12">
              <MobileToc headings={headings} activeHeading={activeHeading} />
            </div>

            {/* Markdown content */}
            <article className="min-w-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeHighlight]}
                components={markdownComponents}
              >
                {yap.content}
              </ReactMarkdown>
            </article>

            {/* Footer */}
            <footer className="mt-20 border-t border-border pt-10">
              {yap.tags?.length > 0 && (
                <div className="mb-10">
                  <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Filed under
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {yap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/30 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        #{tag.replaceAll(" ", "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/10 via-card to-secondary/10 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full border border-primary/15" />
                <div className="pointer-events-none absolute -right-2 -top-8 size-28 rounded-full border border-primary/15" />

                <div className="relative">
                  <p className="text-lg font-semibold tracking-tight">
                    Enjoyed this yap?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    There&apos;s more where that came from.
                  </p>
                </div>

                <Link
                  href="/yaps"
                  className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 dark:text-black"
                >
                  Explore more yaps
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Desktop floating TOC */}
      <DesktopToc headings={headings} activeHeading={activeHeading} />
    </>
  );
}