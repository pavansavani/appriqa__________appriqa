import { supabaseServer } from "@/lib/supabase-server";

export class ProductService {
  /**
   * Fetch all products for admin with category relations
   */
  static async getAdminProducts() {
    const { PRODUCTS } = await import("@/data/products");
    return PRODUCTS;
  }

  static async getPublicProducts(categoryId?: string) {
    const { PRODUCTS } = await import("@/data/products");
    
    // We mock the DB format slightly if needed, but PRODUCTS is exactly what we exported
    let result = PRODUCTS;
    
    if (categoryId) {
      result = result.filter(p => (p as any).category_id === categoryId || p.category === categoryId);
    }
    
    return result;
  }

  static async getProductById(id: string) {
    const { PRODUCTS } = await import("@/data/products");
    const product = PRODUCTS.find(p => p.id === id || p.slug === id);
    return product || null;
  }

  /**
   * Create a new product
   */
  static async createProduct(productData: any) {
    const { data, error } = await supabaseServer
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an existing product
   */
  static async updateProduct(id: string, productData: any) {
    const { data, error } = await supabaseServer
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string) {
    const { error } = await supabaseServer
      .from("products")
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return true;
  }
}
