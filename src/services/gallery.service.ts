import { supabase } from "@/lib/supabase";
import { ShowcaseItem } from "@/types";

const FALLBACK_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "showcase-1",
    type: "image",
    url: "/images/project-1.png",
    title: "Autonomous Robotics Arm",
    caption: "Micro-factory precision arm with AI computer vision calibration.",
    display_order: 1,
    is_published: true,
    is_featured: true,
  },
  {
    id: "showcase-2",
    type: "image",
    url: "/images/project-2.png",
    title: "Edge AI Sensor Node",
    caption: "Low-power neural network telemetry module for smart infrastructure.",
    display_order: 2,
    is_published: true,
    is_featured: false,
  },
  {
    id: "showcase-3",
    type: "image",
    url: "/images/project-3.png",
    title: "Sentinel Drone System",
    caption: "Autonomous multi-agent navigation & precision swarm architecture.",
    display_order: 3,
    is_published: true,
    is_featured: false,
  },
  {
    id: "showcase-4",
    type: "image",
    url: "/images/project-4.png",
    title: "Neuro-Processing Board",
    caption: "Custom embedded firmware architecture and neural accelerator testing.",
    display_order: 4,
    is_published: true,
    is_featured: false,
  },
  {
    id: "showcase-5",
    type: "image",
    url: "/images/project-5.png",
    title: "Industrial 3D Printing Prototype",
    caption: "High-tolerance composite enclosure with thermal dissipation channels.",
    display_order: 5,
    is_published: true,
    is_featured: false,
  },
  {
    id: "showcase-6",
    type: "image",
    url: "/images/home-hero.png",
    title: "Aerospace Aerial Platform",
    caption: "Advanced telemetry & multi-spectral scanning system for harsh environments.",
    display_order: 6,
    is_published: true,
    is_featured: false,
  },
];

export class GalleryService {
  /**
   * Fetch all gallery items (for Admin)
   */
  static async getAllItems(): Promise<ShowcaseItem[]> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return FALLBACK_SHOWCASE_ITEMS;
    }

    try {
      const { data, error } = await supabase
        .from("appriqa_showcase")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data) {
        return FALLBACK_SHOWCASE_ITEMS;
      }

      return data as ShowcaseItem[];
    } catch {
      return FALLBACK_SHOWCASE_ITEMS;
    }
  }

  /**
   * Fetch only published gallery items (for public Homepage)
   */
  static async getPublishedItems(): Promise<ShowcaseItem[]> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return FALLBACK_SHOWCASE_ITEMS;
    }

    try {
      const { data, error } = await supabase
        .from("appriqa_showcase")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return FALLBACK_SHOWCASE_ITEMS;
      }

      return data as ShowcaseItem[];
    } catch {
      return FALLBACK_SHOWCASE_ITEMS;
    }
  }

  /**
   * Create a new gallery item
   */
  static async createItem(item: Omit<ShowcaseItem, "id" | "created_at">): Promise<ShowcaseItem> {
    // If setting as featured, un-feature others first
    if (item.is_featured) {
      await supabase.from("appriqa_showcase").update({ is_featured: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    }

    const { data, error } = await supabase
      .from("appriqa_showcase")
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery item:", error);
      throw new Error("Failed to create gallery item.");
    }

    return data as ShowcaseItem;
  }

  /**
   * Update an existing gallery item
   */
  static async updateItem(id: string, updates: Partial<ShowcaseItem>): Promise<ShowcaseItem> {
    // If setting as featured, un-feature others first
    if (updates.is_featured) {
      await supabase.from("appriqa_showcase").update({ is_featured: false }).neq("id", id);
    }

    const { data, error } = await supabase
      .from("appriqa_showcase")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery item:", error);
      throw new Error("Failed to update gallery item.");
    }

    return data as ShowcaseItem;
  }

  /**
   * Delete a gallery item
   */
  static async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("appriqa_showcase")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting gallery item:", error);
      throw new Error("Failed to delete gallery item.");
    }

    return true;
  }
}
