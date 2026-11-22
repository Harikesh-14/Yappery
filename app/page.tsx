"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Hash,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ICategory } from "@/lib/types";
import { toast } from "sonner";

const articles = [
  {
    category: "Technology",
    date: "NOV 12, 2026",
    readTime: "8 MIN READ",
    title: "The fascinating intersection of technology and human creativity",
    description:
      "Exploring how our tools shape the way we think, create, and understand the world around us.",
    href: "/yaps",
    color: "text-cyan-400",
  },
  {
    category: "Personal",
    date: "NOV 08, 2026",
    readTime: "5 MIN READ",
    title: "Learning to enjoy the process, not just the destination",
    description:
      "A few thoughts on curiosity, consistency, and finding meaning in the little things.",
    href: "/yaps",
    color: "text-emerald-400",
  },
  {
    category: "Ideas",
    date: "NOV 02, 2026",
    readTime: "6 MIN READ",
    title: "What if we started asking better questions?",
    description:
      "Sometimes the most interesting discoveries begin with a question nobody thought to ask.",
    href: "/yaps",
    color: "text-indigo-400",
  },
];

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function Home() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${backendUrl}/yappery/categories`, {
        method: "GET"
      });

      if (!response.ok) {
        toast.error("Oops", {
          description: "Failed to fetch the categories",
          closeButton: true
        })
      }

      const data = await response.json();
      setCategories(data);
      console.log(categories)
    } catch {
      toast.error("Oops", {
        description: "[Categories/Fetch]: Internal Server Error",
        closeButton: true
      })
    }
  }

  useEffect(() => {
    Promise.allSettled([
      fetchCategories()
    ])
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-5 py-12 sm:px-8 lg:gap-28 lg:px-10 lg:py-16">
      {/* HERO */}
      <section className="grid items-center gap-12 border-b border-border/70 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="flex flex-col items-start gap-7 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
              A PERSONAL SPACE FOR THOUGHTS & IDEAS
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              A little space for{" "}
              <span className="bg-linear-to-r from-primary via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                big thoughts.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Welcome to Yappery — a personal corner of the internet where I
              write about technology, programming, ideas, experiences, and
              everything in between. No particular agenda. Just things worth
              sharing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/yaps"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Explore my writing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              A little about me
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-5 pt-3 font-mono text-[10px] tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              PERSONAL BLOG
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>EST. 2026</span>
          </div>
        </div>

        {/* VISUAL PANEL */}
        <div className="relative lg:col-span-5">
          <div className="absolute -inset-5 rounded-3xl bg-linear-to-br from-primary/15 via-cyan-400/10 to-emerald-400/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  thoughts.md
                </span>
              </div>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>

            <div className="relative flex min-h-77.5 flex-col justify-between overflow-hidden bg-linear-to-br from-indigo-500/10 via-background to-cyan-500/10 p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-primary/20" />
              <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full border border-cyan-400/20" />
              <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative space-y-5">
                <span className="font-mono text-[10px] tracking-[0.25em] text-primary">
                  NOTE NO. 001
                </span>
                <h2 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Think.
                  <br />
                  Explore.
                  <br />
                  <span className="text-cyan-400">Write.</span>
                </h2>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  Collecting little pieces of curiosity, one yap at a time.
                </p>
              </div>

              <div className="relative mt-12 flex items-end justify-between border-t border-border/70 pt-4">
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                  AN ONGOING COLLECTION OF IDEAS
                </span>
                <ArrowDownRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-border bg-card px-4 py-3 shadow-xl sm:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] text-muted-foreground">
                ALWAYS CURIOUS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="space-y-7">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              HANDPICKED
            </div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              A thought worth sharing.
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
            FEATURED YAP / 001
          </span>
        </div>

        <Link
          href="/yaps"
          className="group grid overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40 lg:grid-cols-2"
        >
          <div className="relative flex min-h-65 items-center justify-center overflow-hidden bg-linear-to-br from-primary/20 via-indigo-500/10 to-cyan-500/20 p-8">
            <div className="absolute h-64 w-64 rounded-full border border-primary/20" />
            <div className="absolute h-48 w-48 rounded-full border border-cyan-400/20" />
            <div className="relative text-center">
              <span className="font-mono text-xs tracking-[0.3em] text-primary">
                THE ART OF
              </span>
              <p className="mt-3 text-5xl font-semibold tracking-tighter sm:text-6xl">
                Curiosity<span className="text-primary">.</span>
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-widest text-muted-foreground">
                QUESTION EVERYTHING
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 p-7 sm:p-9">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-wider text-primary">
                  IDEAS & PHILOSOPHY
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  7 MIN READ
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                The beauty of being endlessly curious
              </h3>

              <p className="text-sm leading-7 text-muted-foreground">
                Why curiosity might be one of the most underrated qualities we
                can nurture, and how asking questions can change the way we
                experience the world.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                NOV 10, 2026
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-primary">
                Read article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* LATEST WRITING */}
      <section className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-widest text-cyan-400">
              FRESH FROM THE KEYBOARD
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Recent yaps.
            </h2>
            <p className="text-sm text-muted-foreground">
              Some recent thoughts, stories, and things I found interesting.
            </p>
          </div>

          <Link
            href="/yaps"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Link
              key={article.title}
              href={article.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-wider">
                  <span className={article.color}>{article.category}</span>
                  <span className="text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {article.title}
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  {article.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] text-muted-foreground">
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="h-3 w-3" />
                  {article.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOPICS */}
      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-muted/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-emerald-400">
            <Hash className="h-3.5 w-3.5" />
            EXPLORE YOUR INTERESTS
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            Something on your mind?
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Browse through different topics and find something that catches
            your curiosity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:max-w-md sm:justify-end">
          {categories.map((category) => (
            <Link
              key={category._id}
              href="/categories"
              className="rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-cyan-500/10 px-7 py-12 text-center sm:px-12 sm:py-16">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <p className="font-mono text-[10px] tracking-[0.25em] text-primary">
            THAT&apos;S THE SPIRIT OF YAPPERY
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stay curious. Keep exploring.
          </h2>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            There&apos;s always another idea to discover, another perspective to
            consider, and another story to tell.
          </p>
          <Link
            href="/yaps"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start reading <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
