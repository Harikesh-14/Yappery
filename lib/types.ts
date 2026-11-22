import { LucideIcon } from "lucide-react";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  badgeText: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  accent: string;
  createdAt: Date;
  updatedAt: Date;
}