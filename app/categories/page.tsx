"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Brain,
  Code2,
  Cpu,
  Dumbbell,
  Feather,
  Layers3,
  Lightbulb,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { IYapCategory } from "@/lib/types";

type Accent = "primary" | "secondary" | "tertiary";

interface CategoryVisual {
  icon: LucideIcon;
  accent: Accent;
  label: string;
}

const categoryVisuals: Record<string, CategoryVisual> = {
  technology: {
    icon: Cpu,
    accent: "primary",
    label: "DIGITAL FRONTIERS",
  },
  programming: {
    icon: Code2,
    accent: "secondary",
    label: "BUILD WITH CODE",
  },
  "artificial-intelligence": {
    icon: Brain,
    accent: "tertiary",
    label: "INTELLIGENT SYSTEMS",
  },
  development: {
    icon: Activity,
    accent: "primary",
    label: "IDEAS INTO REALITY",
  },
  productivity: {
    icon: Dumbbell,
    accent: "secondary",
    label: "WORK WITH INTENTION",
  },
  "ideas-thoughts": {
    icon: Lightbulb,
    accent: "tertiary",
    label: "CURIOSITY UNFILTERED",
  },
};

const defaultVisual: CategoryVisual = {
  icon: Layers3,
  accent: "primary",
  label: "EXPLORE IDEAS",
};

const accentStyles: Record<
  Accent,
  {
    text: string;
    background: string;
    border: string;
    hoverBorder: string;
    hoverText: string;
  }
> = {
  primary: {
    text: "text-indigo-600 dark:text-[#A5A0FF]",
    background: "bg-indigo-500/10 dark:bg-[#4F46E5]/10",
    border: "border-indigo-500/25 dark:border-[#4F46E5]/25",
    hoverBorder:
      "group-hover:border-indigo-500/50 dark:group-hover:border-[#4F46E5]/50",
    hoverText:
      "group-hover:text-indigo-600 dark:group-hover:text-[#A5A0FF]",
  },
  secondary: {
    text: "text-cyan-600 dark:text-[#06B6D4]",
    background: "bg-cyan-500/10 dark:bg-[#06B6D4]/10",
    border: "border-cyan-500/25 dark:border-[#06B6D4]/25",
    hoverBorder:
      "group-hover:border-cyan-500/50 dark:group-hover:border-[#06B6D4]/50",
    hoverText:
      "group-hover:text-cyan-600 dark:group-hover:text-[#06B6D4]",
  },
  tertiary: {
    text: "text-emerald-600 dark:text-[#10B981]",
    background: "bg-emerald-500/10 dark:bg-[#10B981]/10",
    border: "border-emerald-500/25 dark:border-[#10B981]/25",
    hoverBorder:
      "group-hover:border-emerald-500/50 dark:group-hover:border-[#10B981]/50",
    hoverText:
      "group-hover:text-emerald-600 dark:group-hover:text-[#10B981]",
  },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [topicLoader, setTopicLoader] = useState(true);

  const [categories, setCategories] = useState<IYapCategory[]>([]);
  const [categoryLoader, setCategoryLoader] = useState(true);

  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {
    const controller = new AbortController();

    // Fetch all unique blog tags
    const fetchAllTopics = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/blogs/tags`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to fetch topics");
        }

        const data: unknown = await response.json();

        if (
          !Array.isArray(data) ||
          !data.every((item) => typeof item === "string")
        ) {
          throw new Error("Invalid topics response");
        }

        setAllTopics(
          [...new Set(data.map((tag: string) => tag.trim()).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b))
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        toast.error("Unable to load blog topics");
      } finally {
        if (!controller.signal.aborted) {
          setTopicLoader(false);
        }
      }
    };

    // Fetch categories from the backend
    const fetchAllCategories = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/yappery/categories`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch categories");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid categories response");
        }

        setCategories(data as IYapCategory[]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        toast.error("Unable to load categories");
      } finally {
        if (!controller.signal.aborted) {
          setCategoryLoader(false);
        }
      }
    };

    Promise.allSettled([
      fetchAllTopics(),
      fetchAllCategories(),
    ]);

    return () => controller.abort();
  }, []);

  // ============================================================
  // SEARCH AND FILTERING
  // ============================================================

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description ?? "").toLowerCase().includes(query)
    );
  }, [search, categories]);

  const clearFilters = () => {
    setSearch("");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-32">

        {/* INTRODUCTION */}
        <section className="relative overflow-hidden border-b border-border pb-8 sm:pb-10 lg:pb-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-[0.12em] sm:text-[10px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
                <Layers3 size={12} />
                THE YAPPERY INDEX
              </span>

              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">CATEGORIES</span>
            </div>

            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                  A little order to
                  <br className="hidden sm:block" /> all the{" "}
                  <span className="text-primary">curiosity.</span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base">
                  Every yap has a place. Explore the subjects, ideas, and
                  rabbit holes that make up this little corner of the
                  internet.
                </p>
              </div>

              <div className="flex w-full gap-8 border-t border-border pt-5 md:w-auto md:shrink-0 md:gap-7 md:border-l md:border-t-0 md:pb-1 md:pl-6 md:pt-0">
                <div>
                  <p className="font-mono text-[9px] tracking-wider text-muted-foreground sm:text-[10px]">
                    CATEGORIES
                  </p>

                  {categoryLoader ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-1.5 text-2xl font-semibold sm:text-3xl">
                      {String(categories.length).padStart(2, "0")}
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[9px] tracking-wider text-muted-foreground sm:text-[10px]">
                    TOPICS
                  </p>

                  {topicLoader ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-1.5 text-2xl font-semibold sm:text-3xl">
                      {String(allTopics.length).padStart(2, "0")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH AND TOPIC FILTERS */}
        <section className="border-b border-border py-7 sm:py-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-medium">
                  <Search size={17} className="text-primary" />
                  Explore the index
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Find a category or explore a particular topic.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search categories..."
                  aria-label="Search categories"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* TOPIC TAGS */}
            <div>
              <p className="mb-3 font-mono text-[9px] tracking-[0.13em] text-muted-foreground sm:text-[10px]">
                EXPLORE BY TOPIC
              </p>

              <div className="flex flex-wrap gap-2" aria-busy={topicLoader}>
                {topicLoader ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-8 w-20 rounded-md"
                    />
                  ))
                ) : allTopics.length > 0 ? (
                  allTopics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/yaps?tag=${encodeURIComponent(topic)}`}
                      className="rounded-md border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:py-1.5 sm:text-xs"
                    >
                      {topic}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No topics available yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY COLLECTION */}
        <section className="py-9 sm:py-12">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground sm:text-[10px]">
                THE COLLECTION
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Browse categories
              </h2>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] text-muted-foreground">
                SHOWING{" "}
                {String(filteredCategories.length).padStart(2, "0")} OF{" "}
                {categoryLoader
                  ? "--"
                  : String(categories.length).padStart(2, "0")}
              </span>

              {search && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-primary transition-colors hover:opacity-80"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY LOADING SKELETONS */}
          {categoryLoader ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-h-72.5 flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-6"
                >
                  <div>
                    <div className="mb-6 flex items-start justify-between">
                      <Skeleton className="h-11 w-11 rounded-lg" />
                      <Skeleton className="h-3 w-12" />
                    </div>

                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="mt-4 h-7 w-3/4 rounded" />

                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {filteredCategories.map((category, index) => {
                const visual = categoryVisuals[category.slug] ?? defaultVisual;
                const Icon = visual.icon;
                const style = accentStyles[visual.accent];

                return (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className={`group flex min-w-0 flex-col justify-between rounded-xl border border-border bg-card p-5 text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent sm:p-6 ${style.hoverBorder}`}
                  >
                    <div className="min-w-0">
                      {/* CARD HEADER */}
                      <div className="mb-6 flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${style.background} ${style.border} ${style.text}`}
                        >
                          <Icon size={21} strokeWidth={1.7} />
                        </div>

                        <span className="font-mono text-[10px] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(filteredCategories.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* CATEGORY LABEL */}
                      <span
                        className={`inline-flex max-w-full rounded border px-2 py-1 font-mono text-[9px] tracking-wider ${style.background} ${style.border} ${style.text}`}
                      >
                        {visual.label}
                      </span>

                      {/* TITLE */}
                      <h3
                        className={`mt-3 flex items-start justify-between gap-3 text-lg font-semibold leading-snug tracking-tight transition-colors sm:text-xl ${style.hoverText}`}
                      >
                        <span className="min-w-0 wrap-break-word">
                          {category.name}
                        </span>

                        <ArrowUpRight
                          size={17}
                          className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-3 text-[13px] leading-6 text-muted-foreground sm:text-sm">
                        {category.description}
                      </p>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <span className="text-[11px] text-muted-foreground">
                        Explore category
                      </span>

                      <span
                        className={`flex items-center gap-1.5 text-[11px] ${style.text}`}
                      >
                        Browse collection
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-62.5 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-5 text-center sm:min-h-75">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <Search size={20} />
              </div>

              <h3 className="text-base font-medium">
                {search ? "Nothing found here" : "No categories available"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {search
                  ? "No categories match your search. Try another keyword or clear your search."
                  : "There are no categories to display right now. Check back later."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-xs font-medium text-primary transition-colors hover:opacity-80"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* EDITORIAL NOTE */}
        <section className="border-t border-border pt-8 sm:pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-[#10B981]">
                <Feather size={18} />
              </div>

              <div className="min-w-0">
                <p className="font-mono text-[9px] tracking-[0.13em] text-emerald-600 dark:text-[#10B981] sm:text-[10px]">
                  A NOTE ON CURIOSITY
                </p>

                <h3 className="mt-2 text-base font-medium sm:text-lg">
                  Not everything fits into a category.
                </h3>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
                  Some ideas overlap, some lead to unexpected places, and
                  some simply refuse to be organised. That&apos;s perfectly
                  fine. The categories are just a starting point.
                </p>
              </div>
            </div>

            <Link
              href="/yaps"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore all yaps
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
