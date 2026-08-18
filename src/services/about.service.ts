import { supabase } from "@/lib/supabase";

export class AboutService {
  // ==========================================
  // ABOUT SETTINGS
  // ==========================================
  static async getSetting(sectionKey: string) {
    const { data, error } = await supabase
      .from("appriqa_about_settings")
      .select("data")
      .eq("section_key", sectionKey)
      .single();
    
    if (error) {
      console.error(`Error fetching about setting ${sectionKey}:`, error);
      return null;
    }
    return data?.data;
  }

  static async updateSetting(sectionKey: string, payload: any) {
    const { data, error } = await supabase
      .from("appriqa_about_settings")
      .upsert({ section_key: sectionKey, data: payload }, { onConflict: "section_key" })
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating about setting ${sectionKey}:`, error);
      throw new Error("Failed to update setting.");
    }
    return data;
  }

  static async getAllSettings() {
    const { data, error } = await supabase
      .from("appriqa_about_settings")
      .select("*");
      
    if (error) {
      console.error("Error fetching all settings:", error);
      return {};
    }
    
    const settings: Record<string, any> = {};
    data.forEach((row: any) => {
      settings[row.section_key] = row.data;
    });
    return settings;
  }

  // ==========================================
  // TEAM MEMBERS
  // ==========================================
  static async getTeamMembers(onlyPublished = false) {
    let query = supabase.from("appriqa_team_members").select("*").order("display_order", { ascending: true });
    if (onlyPublished) query = query.eq("is_published", true);
    
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch team members:", error);
      return [];
    }
    return data;
  }

  static async createTeamMember(payload: any) {
    const { data, error } = await supabase.from("appriqa_team_members").insert([payload]).select().single();
    if (error) throw new Error("Failed to create team member.");
    return data;
  }

  static async updateTeamMember(id: string, payload: any) {
    const { data, error } = await supabase.from("appriqa_team_members").update(payload).eq("id", id).select().single();
    if (error) throw new Error("Failed to update team member.");
    return data;
  }

  static async deleteTeamMember(id: string) {
    const { error } = await supabase.from("appriqa_team_members").delete().eq("id", id);
    if (error) throw new Error("Failed to delete team member.");
    return true;
  }

  // ==========================================
  // MILESTONES
  // ==========================================
  static async getMilestones(onlyPublished = false) {
    let query = supabase.from("appriqa_milestones").select("*").order("display_order", { ascending: true });
    if (onlyPublished) query = query.eq("is_published", true);
    
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch milestones:", error);
      return [];
    }
    return data;
  }

  static async createMilestone(payload: any) {
    const { data, error } = await supabase.from("appriqa_milestones").insert([payload]).select().single();
    if (error) throw new Error("Failed to create milestone.");
    return data;
  }

  static async updateMilestone(id: string, payload: any) {
    const { data, error } = await supabase.from("appriqa_milestones").update(payload).eq("id", id).select().single();
    if (error) throw new Error("Failed to update milestone.");
    return data;
  }

  static async deleteMilestone(id: string) {
    const { error } = await supabase.from("appriqa_milestones").delete().eq("id", id);
    if (error) throw new Error("Failed to delete milestone.");
    return true;
  }

  // ==========================================
  // PARTNERS
  // ==========================================
  static async getPartners(onlyPublished = false) {
    let query = supabase.from("appriqa_partners").select("*").order("display_order", { ascending: true });
    if (onlyPublished) query = query.eq("is_published", true);
    
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch partners:", error);
      return [];
    }
    return data;
  }

  static async createPartner(payload: any) {
    const { data, error } = await supabase.from("appriqa_partners").insert([payload]).select().single();
    if (error) throw new Error("Failed to create partner.");
    return data;
  }

  static async updatePartner(id: string, payload: any) {
    const { data, error } = await supabase.from("appriqa_partners").update(payload).eq("id", id).select().single();
    if (error) throw new Error("Failed to update partner.");
    return data;
  }

  static async deletePartner(id: string) {
    const { error } = await supabase.from("appriqa_partners").delete().eq("id", id);
    if (error) throw new Error("Failed to delete partner.");
    return true;
  }
}
