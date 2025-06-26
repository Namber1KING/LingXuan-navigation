export type NavItems = Record<string, Array<{
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}>>;

export type Categories = string[];