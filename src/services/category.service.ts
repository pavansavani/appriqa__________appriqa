import { supabaseServer } from "@/lib/supabase-server";

export class CategoryService {
  /**
   * Fetch all categories for admin
   */
  static async getAdminCategories() {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Fetch active categories for the public store
   */
  static async getPublicCategories() {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Fetch a single category by ID
   */
  static async getCategoryById(id: string) {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch a single category by Slug
   */
  static async getCategoryBySlug(slug: string) {
    const { data, error } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new category
   */
  static async createCategory(categoryData: any) {
    const { data, error } = await supabaseServer
      .from("categories")
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an existing category
   */
  static async updateCategory(id: string, categoryData: any) {
    const { data, error } = await supabaseServer
      .from("categories")
      .update({ ...categoryData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string) {
    const { error } = await supabaseServer
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
}
