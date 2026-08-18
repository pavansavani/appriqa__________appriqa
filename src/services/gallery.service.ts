import { supabase } from "@/lib/supabase";
import { ShowcaseItem } from "@/types";

export class GalleryService {
  /**
   * Fetch all gallery items (for Admin)
   */
  static async getAllItems(): Promise<ShowcaseItem[]> {
    const { data, error } = await supabase
      .from("appriqa_showcase")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery items:", error);
      throw new Error("Failed to fetch gallery items.");
    }

    return data as ShowcaseItem[];
  }

  /**
   * Fetch only published gallery items (for public Homepage)
   */
  static async getPublishedItems(): Promise<ShowcaseItem[]> {
    const { data, error } = await supabase
      .from("appriqa_showcase")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching published gallery items:", error);
      return []; // Return empty array on public error instead of crashing
    }

    return data as ShowcaseItem[];
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
