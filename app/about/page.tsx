"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Brain,
  Code2,
  Compass,
  Feather,
  FlaskConical,
  Lightbulb,
  Rocket,
  Sparkles,
  Terminal,
  Workflow,
  Globe2,
} from "lucide-react";

const interests = [
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Exploring programming languages, software architecture, web technologies, and the art of building useful digital products.",
    tags: ["Web Development", "iOS", "Backend", "System Design"],
    accent: "primary",
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Understanding how intelligent systems work, experimenting with machine learning, and exploring what AI might make possible.",
    tags: ["Machine Learning", "LLMs", "Local AI", "Neural Networks"],
    accent: "secondary",
  },
  {
    icon: FlaskConical,
    title: "Science & Philosophy",
    description:
      "Questioning what we know, exploring the unexplained, and connecting ideas from science, physics, and philosophy.",
    tags: ["Physics", "Philosophy", "Space", "Big Questions"],
    accent: "tertiary",
  },
  {
    icon: Globe2,
    title: "Learning & Exploration",
    description:
      "Learning new languages, discovering unfamiliar subjects, and finding interesting ways to understand the world.",
    tags: ["Languages", "Productivity", "Learning", "Creativity"],
    accent: "primary",
  },
] as const;

const experiments = [
  {
    number: "01",
    name: "Sutra",
    category: "LOCAL AI & DEVELOPER TOOLS",
    description:
      "Exploring how AI can make developer workflows smarter through a locally driven Git assistant.",
    icon: Terminal,
    tags: ["AI", "Git", "Developer Tools"],
  },
  {
    number: "02",
    name: "Azbuka",
    category: "LANGUAGE LEARNING",
    description:
      "A personal language-learning project designed to make practicing alphabets, words, and phrases more engaging.",
    icon: Globe2,
    tags: ["SwiftUI", "Russian", "Learning"],
  },
  {
    number: "03",
    name: "Yappery",
    category: "PERSONAL BLOG",
    description:
      "A little corner of the internet to collect thoughts, document discoveries, and share interesting rabbit holes.",
    icon: Feather,
    tags: ["Writing", "Ideas", "Web"],
  },
];

const accentStyles = {
  primary: {
    icon: "bg-indigo-500/10 text-indigo-600 dark:text-[#A5A0FF]",
    tag: "border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-[#A5A0FF]",
  },
  secondary: {
    icon: "bg-cyan-500/10 text-cyan-600 dark:text-[#06B6D4]",
    tag: "border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-[#06B6D4]",
  },
  tertiary: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-[#10B981]",
    tag: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-[#10B981]",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-10">

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border pb-12 sm:pb-16 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />

          <div className="relative">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.13em]">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
                <Sparkles size={12} />
                THE PERSON BEHIND THE YAPS
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">ABOUT ME</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
              <div className="max-w-4xl">
                <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">
                  Hello, curious
                  <br />
                  <span className="text-primary">internet stranger.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                  I'm a developer, an enthusiastic learner, and someone
                  who probably has too many questions about how things work.
                  I enjoy building software, exploring emerging technologies,
                  and following interesting ideas wherever they lead.
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  This is a little introduction to the person behind
                  Yappery — what I build, what I explore, and what keeps
                  my curiosity alive.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/yaps"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Read my yaps
                    <ArrowUpRight size={15} />
                  </Link>

                  <a
                    href="https://thedevsden.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    My portfolio
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              {/* PERSONALITY CARD */}
              <div className="relative">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Lightbulb size={23} />
                  </div>

                  <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                    CURRENT OPERATING SYSTEM
                  </p>

                  <h2 className="mt-3 text-xl font-semibold tracking-tight">
                    Powered by curiosity.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Constantly learning, occasionally overthinking,
                    and always looking for something interesting to build.
                  </p>

                  <div className="mt-6 border-t border-border pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Always exploring
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-primary/10 blur-3xl"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-12 flex items-center gap-3 text-muted-foreground">
            <ArrowDown size={15} />
            <span className="font-mono text-[10px] tracking-[0.15em]">
              A LITTLE MORE ABOUT ME
            </span>
          </div>
        </section>

        {/* MY STORY */}
        <section className="border-b border-border py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-primary">
                01 / THE STORY
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                More than just
                <br />
                <span className="text-muted-foreground">writing code.</span>
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-8 text-muted-foreground sm:text-base">
              <p>
                My journey revolves around one simple thing: curiosity.
                I've always enjoyed understanding how things work,
                figuring out how different pieces fit together, and
                discovering what happens when an idea becomes reality.
              </p>

              <p>
                Software development gives me a way to turn that curiosity
                into something tangible. I enjoy working across different
                areas of technology, from building web applications and
                backend systems to experimenting with iOS development
                and artificial intelligence.
              </p>

              <p>
                But my interests don't stop at technology. I find myself
                exploring science, philosophy, space, languages, and
                questions that don't necessarily have straightforward
                answers.
              </p>

              <p>
                I don't want to limit myself to knowing just one thing.
                I'd rather keep learning, experiment with unfamiliar ideas,
                make mistakes, and gradually understand a little more
                about the world.
              </p>
            </div>
          </div>
        </section>

        {/* INTERESTS */}
        <section className="border-b border-border py-12 sm:py-16 lg:py-20">
          <div className="mb-9 flex flex-col gap-3 sm:mb-12">
            <p className="font-mono text-[10px] tracking-[0.15em] text-primary">
              02 / THINGS I EXPLORE
            </p>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                A mind with many tabs open.
              </h2>

              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                A few subjects that consistently find their way
                into my reading lists, projects, and late-night thoughts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {interests.map((interest, index) => {
              const Icon = interest.icon;
              const style = accentStyles[interest.accent];

              return (
                <article
                  key={interest.title}
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50 sm:p-7"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${style.icon}`}
                    >
                      <Icon size={21} />
                    </div>

                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">
                    {interest.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {interest.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {interest.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md border px-2.5 py-1.5 text-[10px] ${style.tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="border-b border-border py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Compass size={22} />
            </div>

            <p className="mb-5 font-mono text-[10px] tracking-[0.15em] text-primary">
              03 / A WAY OF THINKING
            </p>

            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-[1.2]">
              Stay curious.
              <br />
              <span className="text-primary">
                Question everything.
              </span>
              <br />
              Keep building.
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
              I believe learning isn't about collecting answers.
              It's also about asking better questions. Some ideas
              turn into projects, some become experiments, and some
              simply lead to even more questions. All of them are
              worth exploring.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
                <Lightbulb size={14} className="text-primary" />
                Think freely
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
                <Workflow size={14} className="text-cyan-600 dark:text-cyan-400" />
                Experiment often
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
                <Rocket size={14} className="text-emerald-600 dark:text-emerald-400" />
                Build relentlessly
              </div>
            </div>
          </div>
        </section>

        {/* WHY YAPPERY */}
        <section className="border-b border-border py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-primary">
                04 / WHY YAPPERY?
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                A home for all
                <br />
                those random thoughts.
              </h2>
            </div>

            <div>
              <p className="text-sm leading-8 text-muted-foreground sm:text-base">
                Yappery started with a simple idea: create a place
                where I can write about things that interest me without
                having to fit everything into a single niche.
              </p>

              <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                It might be a programming lesson, an interesting
                discovery about AI, a project breakdown, a philosophical
                question, or an idea that has been occupying my mind.
                Different subjects, different perspectives, one place.
              </p>

              <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                Think of it as a personal knowledge garden, an
                experimentation log, and occasionally, a place for
                me to yap about absolutely anything.
              </p>

              <Link
                href="/yaps"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
              >
                Explore what I've written
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="pt-12 sm:pt-16 lg:pt-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.16), transparent 65%)",
              }}
            />

            <div className="relative">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Feather size={22} />
              </div>

              <p className="font-mono text-[10px] tracking-[0.15em] text-primary">
                THAT'S A LITTLE BIT ABOUT ME
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Now, what are you
                <br className="hidden sm:block" /> curious about?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                There's always something interesting to explore.
                Have a look around, find something that catches your
                attention, and let's go down a rabbit hole together.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/yaps"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Explore the blog
                  <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Browse categories
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
