
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Folder,
  Info,
  Home,
} from "lucide-react";

const searchItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    keywords: ["home", "homepage"],
  },
  {
    title: "Yaps",
    href: "/yaps",
    icon: FileText,
    keywords: ["blogs", "articles", "posts", "yaps"],
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Folder,
    keywords: ["topics", "categories"],
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
    keywords: ["about", "author", "information"],
  },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-full justify-start gap-2 rounded-lg border-neutral-200 bg-neutral-50 px-3 text-sm font-normal text-neutral-500 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 sm:w-52"
      >
        <Search className="h-4 w-4" />

        <span>Search anything...</span>

        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-500 dark:border-white/10 dark:bg-neutral-800 sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Yappery..." />

        <CommandList>
          <CommandEmpty>
            No results found.
          </CommandEmpty>

          <CommandGroup heading="Navigation">
            {searchItems.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.keywords.join(" ")}`}
                  onSelect={() => navigate(item.href)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-neutral-500" />
                  <span>{item.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <div className="px-3 py-2 text-[11px] text-neutral-400">
            Navigate through Yappery
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
