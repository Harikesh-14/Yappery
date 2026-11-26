"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Code2,
  Cpu,
  Grid2X2,
  Lightbulb,
  List,
  PenLine,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { IYap, IYapCategory } from "@/lib/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "shortest" | "longest";

interface BlogsResponse {
  data: IYap[];
  total: number;
  page: number;
  totalPages: number;
}

interface CategoryFilter {
  name: string;
  slug: string;
  count: number;
}

const PAGE_LIMIT = 100;

const categoryIcons: Record<string, ElementType> = {
  technology: Cpu,
  programming: Code2,
  "ai-ml": Sparkles,
  personal: PenLine,
  ideas: Lightbulb,
};

function YapCover({ yap }: { yap: IYap }) {
  const [imageError, setImageError] = useState(false);

  const categorySlug = yap.category?.slug?.toLowerCase() ?? "";
  const Icon = categoryIcons[categorySlug] ?? Lightbulb;

  const imageUrl = yap.coverImage?.trim();
  const showImage = Boolean(imageUrl) && !imageError;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      {showImage ? (
        <Image
          src={imageUrl!}
          alt={yap.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          unoptimized
          onError={() => setImageError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 via-secondary/10 to-tertiary/10">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-background/70 shadow-sm backdrop-blur-sm">
              <Icon className="size-8 text-primary" />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {yap.category?.name ?? "Yappery"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function YapsPage() {
  const [yaps, setYaps] = useState<IYap[]>([]);
  const [categories, setCategories] = useState<IYapCategory[]>([]);
  const [totalYaps, setTotalYaps] = useState(0);

  const [yapsLoading, setYapsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Fetch published yaps, including additional pages when necessary.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchYaps() {
      try {
        if (!BACKEND_URL) {
          throw new Error("Backend URL is not configured.");
        }

        const fetchPage = async (page: number): Promise<BlogsResponse> => {
          const response = await fetch(
            `${BACKEND_URL}/blogs?onlyPublished=true&page=${page}&limit=${PAGE_LIMIT}`,
            { signal: controller.signal }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch yaps.");
          }

          return response.json();
        };

        const firstPage = await fetchPage(1);

        let allYaps = [...(firstPage.data ?? [])];

        if (firstPage.totalPages > 1) {
          const remainingPages = await Promise.all(
            Array.from(
              { length: firstPage.totalPages - 1 },
              (_, index) => fetchPage(index + 2)
            )
          );

          allYaps = [
            ...allYaps,
            ...remainingPages.flatMap((page) => page.data ?? []),
          ];
        }

        setYaps(allYaps);
        setTotalYaps(firstPage.total ?? allYaps.length);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        console.error("Error fetching yaps:", error);
        toast.error("Unable to load yaps. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setYapsLoading(false);
        }
      }
    }

    async function fetchCategories() {
      try {
        if (!BACKEND_URL) {
          throw new Error("Backend URL is not configured.");
        }

        const response = await fetch(
          `${BACKEND_URL}/yappery/categories`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }

        const data: IYapCategory[] = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        console.error("Error fetching categories:", error);
        toast.error("Unable to load categories.");
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
        }
      }
    }

    fetchYaps();
    fetchCategories();

    return () => controller.abort();
  }, []);

  // Build category filters dynamically.
  const categoryCounts = useMemo<CategoryFilter[]>(() => {
    const filters: CategoryFilter[] = [
      {
        name: "All",
        slug: "all",
        count: totalYaps,
      },
    ];

    categories.forEach((category) => {
      filters.push({
        name: category.name,
        slug: category.slug,
        count: yaps.filter(
          (yap) => yap.category?.slug === category.slug
        ).length,
      });
    });

    return filters;
  }, [categories, yaps, totalYaps]);

  // Search, filter and sort yaps.
  const filteredYaps = useMemo(() => {
    const query = search.toLowerCase().trim();

    return yaps
      .filter((yap) => {
        const matchesCategory =
          activeCategory === "all" ||
          yap.category?.slug === activeCategory;

        const matchesSearch =
          !query ||
          yap.title?.toLowerCase().includes(query) ||
          yap.excerpt?.toLowerCase().includes(query) ||
          yap.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
          );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.publishedAt ?? a.createdAt
        ).getTime();

        const dateB = new Date(
          b.publishedAt ?? b.createdAt
        ).getTime();

        switch (sortMode) {
          case "oldest":
            return dateA - dateB;

          case "shortest":
            return (a.readingTime ?? 0) - (b.readingTime ?? 0);

          case "longest":
            return (b.readingTime ?? 0) - (a.readingTime ?? 0);

          default:
            return dateB - dateA;
        }
      });
  }, [yaps, search, activeCategory, sortMode]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));

  const activeCategoryName =
    categoryCounts.find((category) => category.slug === activeCategory)
      ?.name ?? "All topics";

  const isLoading = yapsLoading || categoriesLoading;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      {/* Page heading */}
      <section className="border-b border-border pb-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="text-primary">YAPPERY</span>
            <span className="text-border">/</span>
            <span>Writing archive</span>
          </div>

          <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {isLoading ? "Loading yaps..." : `${totalYaps} published yaps`}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              All yaps<span className="text-primary">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              A collection of thoughts, ideas, discoveries, and things I find
              worth writing about. Some technical, some personal, and some
              somewhere in between.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <BookOpen size={14} className="text-primary" />
            <span>THE WRITING ARCHIVE</span>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="space-y-5 border-b border-border py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, keyword, or topic..."
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
              </button>

              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid2X2 size={16} />
              </button>
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="h-10 appearance-none rounded-lg border border-border bg-background pl-9 pr-8 text-xs font-medium outline-none transition-colors focus:border-primary"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="shortest">Shortest read</option>
                <option value="longest">Longest read</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categoryCounts.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === category.slug
                  ? "border-primary bg-primary text-white dark:text-black"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {category.name}
              <span
                className={`font-mono text-[10px] ${
                  activeCategory === category.slug
                    ? "text-white/70 dark:text-black"
                    : "text-muted-foreground"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Archive content */}
      <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-12 lg:gap-12">
        {/* Article stream */}
        <section className="lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold">The archive</h2>
            </div>

            <span className="font-mono text-[11px] text-muted-foreground">
              {isLoading ? "LOADING" : `${filteredYaps.length} RESULTS`}
            </span>
          </div>

          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2"
                  : "space-y-6"
              }
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-border p-5"
                >
                  {viewMode === "grid" && (
                    <div className="mb-4 aspect-video rounded-lg bg-muted" />
                  )}
                  <div className="mb-4 h-3 w-1/3 rounded bg-muted" />
                  <div className="mb-3 h-5 w-4/5 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredYaps.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2"
                  : "divide-y divide-border"
              }
            >
              {filteredYaps.map((yap, index) => (
                <article
                  key={yap._id}
                  className={`group ${
                    viewMode === "list"
                      ? "py-6 first:pt-0"
                      : "rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  }`}
                >
                  {viewMode === "grid" && (
                    <Link
                      href={`/yaps/${yap.slug}`}
                      className="-mx-5 -mt-5 mb-4 block overflow-hidden rounded-t-xl"
                    >
                      <YapCover yap={yap} />
                    </Link>
                  )}

                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    <span className="text-primary">
                      YAP / {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-border">•</span>
                    <span>
                      {formatDate(yap.publishedAt ?? yap.createdAt)}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={11} />
                      {yap.readingTime || 1} min read
                    </span>
                  </div>

                  <Link href={`/yaps/${yap.slug}`} className="block">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-xl">
                      {yap.title}
                      <ArrowUpRight
                        size={16}
                        className="ml-1 inline-block -translate-y-0.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100"
                      />
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {yap.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                        {yap.category?.name ?? "Uncategorized"}
                      </span>

                      {(yap.tags ?? []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted-foreground"
                        >
                          #{tag.replaceAll(" ", "")}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/yaps/${yap.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Read yap <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
              <Search size={24} className="mb-3 text-muted-foreground" />
              <h3 className="font-semibold">No yaps found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search term or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="mt-4 text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-5 lg:col-span-4">
          {/* Archive information */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Archive overview
              </h3>
              <BookOpen size={15} className="text-primary" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  TOTAL YAPS
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {totalYaps.toString().padStart(2, "0")}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  CATEGORIES
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {categories.length.toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 font-mono text-[10px] text-muted-foreground">
                CURRENTLY BROWSING
              </p>
              <p className="text-sm font-medium">{activeCategoryName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {filteredYaps.length} matching{" "}
                {filteredYaps.length === 1 ? "article" : "articles"}
              </p>
            </div>
          </div>

          {/* Browse topics */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Explore topics
              </h3>
              <ArrowUpRight size={15} className="text-muted-foreground" />
            </div>

            <div className="space-y-1">
              {categoryCounts
                .filter((category) => category.slug !== "all")
                .map((category, index) => (
                  <button
                    key={category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/60 ${
                      activeCategory === category.slug
                        ? "bg-muted/60"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          [
                            "bg-primary",
                            "bg-cyan-500",
                            "bg-emerald-500",
                            "bg-amber-500",
                            "bg-violet-500",
                          ][index % 5]
                        }`}
                      />
                      {category.name}
                    </span>

                    <span className="font-mono text-[10px] text-muted-foreground">
                      {category.count.toString().padStart(2, "0")}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Small author note */}
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
              <CalendarDays size={13} />
              A note from the author
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              This is my little corner of the internet. A place to document
              what I learn, share what I think, and explore ideas that keep me
              curious.
            </p>

            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground transition-colors hover:text-primary"
            >
              More about me <ArrowUpRight size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
