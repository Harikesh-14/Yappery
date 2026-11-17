"use client";

import Link from "next/link";
import Image from "next/image";
import {
  GitBranch,
  Medal,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";

const footerLinks = [
  { title: "Home", href: "/" },
  { title: "Yaps", href: "/yaps" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about" },
];

const socialLinks = [
  {
    title: "GitHub",
    href: "https://github.com/Harikesh-14/Yappery",
    icon: GitBranch,
  },
  {
    title: "Twitter",
    href: "https://thedevsden.com",
    icon: Medal,
  },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:py-14">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Yappery"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />

              <span className="text-lg font-semibold tracking-tight text-foreground">
                Yappery<span className="text-primary">.</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              A little corner of the internet to share thoughts,
              explore ideas, and yap about anything.
            </p>

            {/* Status */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground">
                v0.1 · ONLINE
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Explore
            </h3>

            <nav className="flex flex-col items-start gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Find me elsewhere
            </h3>

            <p className="text-sm leading-6 text-muted-foreground">
              Follow along, explore my projects, or just say hello.
            </p>

            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.title}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.title}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear ?? "----"} Yappery. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            and plenty of caffeine.
          </div>

          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Back to top
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
