"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  Check,
  Code,
  Cpu,
  Eye,
  FileText,
  FlaskConical,
  Globe,
  Heart,
  Laptop,
  Lightbulb,
  Palette,
  Rocket,
  Search,
  Sparkles,
  Tag,
  Terminal,
  X,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Category {
  _id: string;
  name: string;
  slug: string;
  badgeText: string;
  description?: string;
  tags: string[];
  icon: string;
  accent: "primary" | "secondary" | "tertiary";
}

interface Yap {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: Category | string;
  tags: string[];
  readingTime: number;
  publishedAt?: string;
  createdAt?: string;
  viewsCount: number;
  coverImage?: string;
}

interface BlogsResponse {
  data: Yap[];
  total: number;
  page: number;
  totalPages: number;
}

interface SingleCategoryClientProps {
  slug: string;
}

type SortOption = "newest" | "oldest" | "most-viewed";

/* -------------------------------------------------------------------------- */
/*  Constants & helpers                                                        */
/* -------------------------------------------------------------------------- */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PAGE_SIZE = 9;

const accentStyles = {
  primary: {
    text: "text-primary",
    solid: "bg-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    glow: "from-primary/20",
  },
  secondary: {
    text: "text-secondary",
    solid: "bg-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    glow: "from-secondary/20",
  },
  tertiary: {
    text: "text-tertiary",
    solid: "bg-tertiary",
    bg: "bg-tertiary/10",
    border: "border-tertiary/20",
    glow: "from-tertiary/20",
  },
};

type Accent = (typeof accentStyles)[keyof typeof accentStyles];

const iconMap: Record<string, LucideIcon> = {
  Activity,
  BookOpen,
  Brain,
  Briefcase,
  Code,
  Cpu,
  FlaskConical,
  Globe,
  Heart,
  Laptop,
  Lightbulb,
  Palette,
  Rocket,
  Sparkles,
  Terminal,
};

function formatDate(date?: string) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

/** Returns page numbers with "gap" markers, e.g. [1, "gap", 4, 5, 6, "gap", 12]. */
function getPageNumbers(page: number, totalPages: number) {
  const pages: (number | "gap")[] = [];

  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
      const last = pages[pages.length - 1];
      if (typeof last === "number" && n - last > 1) pages.push("gap");
      pages.push(n);
    }
  }

  return pages;
}

interface CategoryIconProps {
  name?: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ name, size = 24, className }: CategoryIconProps) {
  // Support both Lucide icon names and emoji characters.
  const Icon = name ? iconMap[name] : undefined;

  if (Icon) return <Icon size={size} className={className} />;
  if (name) return <span className={className}>{name}</span>;

  return <Sparkles size={size} className={className} />;
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function PostCard({
  yap,
  category,
  accent,
}: {
  yap: Yap;
  category: Category;
  accent: Accent;
}) {
  return (
    <Link
      href={`/yaps/${yap.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Cover */}
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        {yap.coverImage ? (
          <img
            src={yap.coverImage}
            alt={yap.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`relative flex size-full items-center justify-center bg-linear-to-br ${accent.glow} via-card to-muted`}
          >
            <div
              className={`flex size-16 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-3xl backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}
            >
              <CategoryIcon
                name={category.icon}
                size={28}
                className={accent.text}
              />
            </div>
            <div className="pointer-events-none absolute -bottom-10 -right-6 size-36 rounded-full border border-foreground/5" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        <span
          className={`absolute bottom-3 left-4 rounded-full border ${accent.border} ${accent.bg} px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${accent.text}`}
        >
          {category.name}
        </span>

        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={12} />
            {formatDate(yap.publishedAt || yap.createdAt)}
          </span>
          <span className="size-1 rounded-full bg-border" />
          <span>{yap.readingTime || 1} min read</span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {yap.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
          {yap.excerpt || "Explore this article on Yappery."}
        </p>

        {yap.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {yap.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye size={13} />
            {yap.viewsCount ?? 0} views
          </span>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${accent.text}`}
          >
            Read article
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-border/60 bg-card/60">
      <div className="aspect-16/10 bg-muted" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-5 w-4/5 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  loading,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onChange: (page: number) => void;
}) {
  const navButton =
    "flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card/50 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-border/60 pt-7 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <strong className="text-foreground">
          {(page - 1) * PAGE_SIZE + 1}
        </strong>{" "}
        –{" "}
        <strong className="text-foreground">
          {Math.min(page * PAGE_SIZE, total)}
        </strong>{" "}
        of <strong className="text-foreground">{total}</strong> articles
      </p>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1 || loading}
          className={navButton}
          aria-label="Previous page"
        >
          <ArrowLeft size={16} />
        </button>

        {getPageNumbers(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              disabled={loading}
              aria-current={page === item ? "page" : undefined}
              className={`size-10 rounded-xl text-sm font-semibold transition ${page === item
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border/70 bg-card/50 hover:border-primary/40 hover:text-primary"
                }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages || loading}
          className={navButton}
          aria-label="Next page"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SingleCategoryClient({
  slug,
}: SingleCategoryClientProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [yaps, setYaps] = useState<Yap[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const accent = accentStyles[category?.accent ?? "primary"];
  const hasFilters = Boolean(search || selectedTag);

  // Find the category using its slug.
  useEffect(() => {
    if (!BACKEND_URL) {
      setError("Backend URL is not configured.");
      setCategoryLoading(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchCategory() {
      try {
        setCategoryLoading(true);
        setError("");
        setNotFound(false);

        const response = await fetch(`${BACKEND_URL}/yappery/categories`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Unable to load categories.");

        const categories: Category[] = await response.json();

        const found = categories.find(
          (item) => item.slug.toLowerCase() === slug.toLowerCase()
        );

        if (!found) {
          setNotFound(true);
          setCategory(null);
          return;
        }

        setCategory(found);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setCategoryLoading(false);
      }
    }

    fetchCategory();

    return () => controller.abort();
  }, [slug]);

  // Fetch blogs belonging to the selected category.
  const fetchYaps = useCallback(
    async (signal?: AbortSignal) => {
      if (!BACKEND_URL || !category?._id) return;

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          category: category._id,
          page: String(page),
          limit: String(PAGE_SIZE),
          sortBy,
        });

        if (search.trim()) params.set("search", search.trim());
        if (selectedTag) params.set("tag", selectedTag);

        const response = await fetch(
          `${BACKEND_URL}/blogs?${params.toString()}`,
          { signal, cache: "no-store" }
        );

        if (!response.ok) throw new Error("Unable to load articles.");

        const result: BlogsResponse = await response.json();

        if (signal?.aborted) return;

        setYaps(result.data ?? []);
        setTotal(result.total ?? 0);
        setTotalPages(result.totalPages ?? 1);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (!signal?.aborted) setError(getErrorMessage(err));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [category?._id, page, sortBy, search, selectedTag]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchYaps(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchYaps]);

  const handleSearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag((current) => (current === tag ? "" : tag));
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedTag("");
    setPage(1);
  };

  /* ------------------------------ Loading ------------------------------ */

  if (categoryLoading) {
    return (
      <main className="min-h-screen px-4 py-24">
        <div className="mx-auto max-w-6xl animate-pulse space-y-8">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-72 rounded-[2rem] bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-3xl bg-muted" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------- Not found / error ---------------------------- */

  if (notFound) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={30} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Category not found
          </h1>
          <p className="mt-3 text-muted-foreground">
            Looks like this category doesn&apos;t exist or may have been moved.
          </p>
          <Link
            href="/categories"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Explore categories
          </Link>
        </div>
      </main>
    );
  }

  if (error && !category) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!category) return null;

  /* ------------------------------- Content ------------------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Ambient background */}
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full bg-linear-to-br ${accent.glow} to-transparent opacity-50 blur-[120px]`}
      />
      <div className="pointer-events-none absolute right-0 top-162.5 h-80 w-80 rounded-full bg-secondary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/categories"
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All categories
        </Link>

        {/* Hero */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-xl sm:p-10 lg:p-14">
          {/* Dotted texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18] mask-[radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className={`pointer-events-none absolute -right-20 -top-32 size-96 rounded-full bg-linear-to-br ${accent.glow} to-transparent opacity-70 blur-3xl`}
          />
          <div className="pointer-events-none absolute -bottom-32 -right-16 size-80 rounded-full border border-foreground/5" />
          <div className="pointer-events-none absolute -bottom-20 -right-4 size-56 rounded-full border border-foreground/5" />

          <div className="relative z-10 max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full border ${accent.border} ${accent.bg} px-3.5 py-1.5`}
            >
              <Sparkles size={13} className={accent.text} />
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${accent.text}`}
              >
                {category.badgeText || "Explore"}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
              <div
                className={`flex size-16 shrink-0 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} text-3xl shadow-sm sm:size-20 sm:rounded-3xl sm:text-4xl`}
              >
                <CategoryIcon
                  name={category.icon}
                  size={36}
                  className={accent.text}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  {category.name}
                  <span className={accent.text}>.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {category.description ||
                    `Discover articles, ideas, and perspectives about ${category.name}.`}
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                <BookOpen size={15} className={accent.text} />
                <span>
                  <strong className="font-semibold text-foreground">
                    {total}
                  </strong>{" "}
                  {total === 1 ? "article" : "articles"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                <Tag size={15} className={accent.text} />
                <span>
                  <strong className="font-semibold text-foreground">
                    {category.tags?.length ?? 0}
                  </strong>{" "}
                  topics
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <span className={`h-px w-8 ${accent.solid}`} />
            <p
              className={`font-mono text-[10px] font-bold uppercase tracking-[0.25em] ${accent.text}`}
            >
              The collection
            </p>
          </div>

          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-4xl">
                Articles in {category.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ideas worth reading. Perspectives worth exploring.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search articles..."
                  className="h-11 w-full rounded-full border border-border/70 bg-card/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-64"
                />
              </form>

              <div className="relative">
                <ArrowDown
                  size={14}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  value={sortBy}
                  onChange={(event) =>
                    handleSortChange(event.target.value as SortOption)
                  }
                  className="h-11 w-full appearance-none rounded-full border border-border/70 bg-card/70 px-5 pr-10 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-44"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="most-viewed">Most viewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Topic filters */}
          {category.tags?.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Topics
              </span>

              {category.tags.map((tag) => {
                const active = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all ${active
                        ? `${accent.bg} ${accent.border} ${accent.text}`
                        : "border-border/70 bg-card/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                  >
                    {active && <Check size={12} />}
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active filters */}
          {hasFilters && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Active filters:</span>

              {search && (
                <span className="rounded-full bg-muted px-3 py-1">
                  Search: {search}
                </span>
              )}

              {selectedTag && (
                <span className="rounded-full bg-muted px-3 py-1">
                  Topic: {selectedTag}
                </span>
              )}

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <X size={12} />
                Clear all
              </button>
            </div>
          )}

          {/* Article grid */}
          <div className="mt-8">
            {error && (
              <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
              </div>
            ) : yaps.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {yaps.map((yap) => (
                    <PostCard
                      key={yap._id}
                      yap={yap}
                      category={category}
                      accent={accent}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    loading={loading}
                    onChange={setPage}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-border/80 bg-card/30 px-6 py-20 text-center">
                <div
                  className={`flex size-16 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}
                >
                  {hasFilters ? <Search size={27} /> : <BookOpen size={27} />}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {hasFilters ? "No matching articles" : "Nothing here just yet"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {hasFilters
                    ? "We couldn't find articles matching your filters. Try changing your search or selecting another topic."
                    : `There aren't any published articles in ${category.name} yet. Check back soon!`}
                </p>

                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom note */}
        <div className="mt-24 flex flex-col items-center border-t border-border/60 pt-10 text-center">
          <div
            className={`flex size-11 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}
          >
            <Sparkles size={18} />
          </div>
          <p className="mt-4 text-sm font-semibold">
            Keep exploring. Keep yapping.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            There&apos;s always another idea waiting to be discovered.
          </p>
        </div>
      </div>
    </main>
  );
}