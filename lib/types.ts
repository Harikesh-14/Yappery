export interface IYapCategory {
  _id: string;
  name: string;
  slug: string;
  badgeText?: string;
  description?: string;
  tags?: string[];
  icon?: string;
  accent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IYap {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: IYapCategory;
  tags: string[];
  readingTime: number;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}