"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const categories = [
  "All",
  "Technology",
  "Programming",
  "AI & ML",
  "Personal",
  "Ideas",
];

const yaps = [
  {
    id: "01",
    title: "The Curious Relationship Between Creativity and Code",
    slug: "creativity-and-code",
    excerpt:
      "Programming is often described as a purely logical discipline. But the more I build things, the more I realize how much creativity is hiding behind every line of code.",
    category: "Programming",
    tags: ["Creativity", "Programming", "Thoughts"],
    date: "2026-11-12",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "02",
    title: "What Does It Actually Mean to Build Something with AI?",
    slug: "building-something-with-ai",
    excerpt:
      "AI tools are changing how we approach software development. But are we becoming better builders, or simply getting better at prompting?",
    category: "AI & ML",
    tags: ["Artificial Intelligence", "Future"],
    date: "2026-11-08",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: "03",
    title: "A Developer's Guide to Getting Lost in Side Projects",
    slug: "getting-lost-in-side-projects",
    excerpt:
      "There is something special about building things just because you can. No deadlines, no clients, no expectations. Just curiosity.",
    category: "Personal",
    tags: ["Side Projects", "Learning"],
    date: "2026-11-04",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: "04",
    title: "Understanding the Internet Beyond the Browser",
    slug: "internet-beyond-the-browser",
    excerpt:
      "We use the internet every day, but how often do we stop to think about what actually happens between entering a URL and seeing a webpage?",
    category: "Technology",
    tags: ["Networking", "Web"],
    date: "2026-10-28",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: "05",
    title: "The Art of Learning Things from Scratch",
    slug: "learning-things-from-scratch",
    excerpt:
      "Starting from zero can feel overwhelming. Here's why embracing the fundamentals and enjoying the process might be the best way forward.",
    category: "Ideas",
    tags: ["Learning", "Personal Growth"],
    date: "2026-10-21",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: "06",
    title: "Why I Still Love Building Small Projects",
    slug: "building-small-projects",
    excerpt:
      "Not every project needs to become a startup. Sometimes the best thing you can build is something small that solves a problem you personally have.",
    category: "Programming",
    tags: ["Projects", "Development"],
    date: "2026-10-15",
    readTime: "7 min read",
    featured: false,
  },
];

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "shortest" | "longest";

export default function YapsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredYaps = useMemo(() => {
    const query = search.toLowerCase().trim();

    return yaps
      .filter((yap) => {
        const matchesCategory =
          activeCategory === "All" || yap.category === activeCategory;

        const matchesSearch =
          !query ||
          yap.title.toLowerCase().includes(query) ||
          yap.excerpt.toLowerCase().includes(query) ||
          yap.tags.some((tag) => tag.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortMode) {
          case "oldest":
            return a.date.localeCompare(b.date);
          case "shortest":
            return parseInt(a.readTime) - parseInt(b.readTime);
          case "longest":
            return parseInt(b.readTime) - parseInt(a.readTime);
          default:
            return b.date.localeCompare(a.date);
        }
      });
  }, [search, activeCategory, sortMode]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));

  const categoryCounts = categories.map((category) => ({
    name: category,
    count:
      category === "All"
        ? yaps.length
        : yaps.filter((yap) => yap.category === category).length,
  }));

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
            {yaps.length} published yaps
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
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === category.name
                  ? "border-primary bg-primary text-white dark:text-black"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {category.name}
              <span
                className={`font-mono text-[10px] ${
                  activeCategory === category.name
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
              {filteredYaps.length} RESULTS
            </span>
          </div>

          {filteredYaps.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2"
                  : "divide-y divide-border"
              }
            >
              {filteredYaps.map((yap, index) => (
                <article
                  key={yap.id}
                  className={`group ${
                    viewMode === "list"
                      ? "py-6 first:pt-0"
                      : "rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    <span className="text-primary">YAP / {yap.id}</span>
                    <span className="text-border">•</span>
                    <span>{formatDate(yap.date)}</span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={11} />
                      {yap.readTime}
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
                        {yap.category}
                      </span>

                      {yap.tags.slice(0, 2).map((tag) => (
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
                  setActiveCategory("All");
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
                  {yaps.length.toString().padStart(2, "0")}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  CATEGORIES
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {categories.length - 1}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 font-mono text-[10px] text-muted-foreground">
                CURRENTLY BROWSING
              </p>
              <p className="text-sm font-medium">
                {activeCategory === "All" ? "All topics" : activeCategory}
              </p>
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
                .filter((category) => category.name !== "All")
                .map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/60"
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
                          ][index]
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
