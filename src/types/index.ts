export interface Product {
  id: string | number;
  name: string;
  slug: string;
  category: "3d-printed-products" | "3d-printed-designs" | "robotics-toys" | "diy-project-kits" | string;
  categoryLabel: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  description: string;
  shortDescription: string;
  images: string[];
  thumbnail: string;
  type: "physical" | "digital";
  stock?: number;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  reviews?: Review[];
  license?: string;
  skillLevel?: "Beginner" | "Intermediate" | "Advanced" | string;
  ageRecommendation?: string;
  learningOutcomes?: string[];
  components?: string[];
  compatibility?: string | string[];
  batteryRequirements?: string;
  requiredTools?: string[];
  fileFormat?: string;
  fileSize?: string;
  printTime?: string;
  material?: string;
  
  ageGroup?: string;
  assemblyTime?: string;
}

export interface Review {
  id: string;
  userId?: string;
  userName?: string;
  author?: string;
  rating: number;
  comment: string;
  verified?: boolean;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  displayOrder: number;
  status: "active" | "inactive";
}

export interface ShowcaseItem {
  id: string;
  type: "image" | "video";
  url: string;
  title: string | null;
  caption: string | null;
  display_order: number;
  is_published: boolean;
  is_featured: boolean;
  created_at?: string;
}
