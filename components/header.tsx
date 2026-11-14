"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ModeToggle from "./mode-toggle";

const navLinks = [
  {
    id: "yaps",
    title: "Yaps",
    href: "/yaps",
  },
  {
    id: "categories",
    title: "Categories",
    href: "/categories",
  },
  {
    id: "about",
    title: "About",
    href: "/about",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/85 backdrop-blur-xl transition-colors duration-200 dark:border-white/8 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Yappery"
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain"
            />

            <span className="text-xl font-semibold tracking-tight text-neutral-950 transition-colors hover:text-[#4F46E5] dark:text-white dark:hover:text-[#A5A0FF]">
              Yappery
            </span>
          </Link>

          {/* Version Indicator */}
          <div className="hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2 py-1 dark:border-white/8 dark:bg-neutral-900 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>

            <span className="font-mono text-[10px] font-medium tracking-wide text-[#059669] dark:text-[#10B981]">
              v0.1 Live
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "relative py-1.5 text-[13px] font-medium transition-colors duration-200",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform after:duration-200",
                  isActive
                    ? "text-[#4F46E5] after:scale-x-100 after:bg-[#4F46E5] dark:text-[#A5A0FF] dark:after:bg-[#A5A0FF]"
                    : "text-neutral-500 after:scale-x-0 after:bg-[#4F46E5] hover:text-neutral-950 hover:after:scale-x-100 dark:text-neutral-400 dark:hover:text-white"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <ModeToggle />

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-neutral-900 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-4.5 w-4.5" />
            ) : (
              <Menu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out md:hidden",
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <nav className="border-t border-neutral-200/70 bg-white px-4 py-3 dark:border-white/8 dark:bg-neutral-950 sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`));

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#4F46E5]/8 text-[#4F46E5] dark:bg-[#4F46E5]/15 dark:text-[#A5A0FF]"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                    )}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
