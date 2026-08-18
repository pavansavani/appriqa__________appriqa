import { supabaseServer } from "@/lib/supabase-server";

export class AuthService {
  /**
   * Fetch admin by email or manager_id
   */
  static async getAdminByIdentifier(identifier: string) {
    const { data: admin, error } = await supabaseServer
      .from("admins")
      .select("id, manager_id, name, email, role_id, department, status, password_hash")
      .or(`email.eq.${identifier},manager_id.eq.${identifier}`)
      .single();

    if (error) throw error;
    return admin;
  }

  /**
   * Update admin last login
   */
  static async updateLastLogin(adminId: string) {
    const { error } = await supabaseServer
      .from("admins")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", adminId);

    if (error) throw error;
  }

  /**
   * Fetch permissions for a given role ID
   */
  static async getRolePermissions(roleId: string) {
    const { data: roleData } = await supabaseServer
      .from("role_permissions")
      .select(`
        permission:permissions(name)
      `)
      .eq("role_id", roleId);

    const permissions = roleData?.map(rp => (rp.permission as any).name) || [];
    return permissions;
  }
}
