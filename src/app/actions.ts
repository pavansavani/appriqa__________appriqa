"use server";

import { supabaseServer } from "@/lib/supabase-server";

export async function submitContact(data: any, token?: string) {
  if (!token) return { success: false, message: "Unauthorized" };
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) return { success: false, message: "Unauthorized" };

  const { error } = await supabaseServer.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    status: "unread",
    // We assume the schema has a user_id or auth_user_id column if needed, otherwise name/email is sufficient. 
    // To be perfectly connected, let's insert it:
    auth_user_id: user.id,
  });

  if (error) {
    console.error("Error inserting contact message:", error);
    return { success: false, message: "Failed to submit message." };
  }
  
  return { success: true, message: "Thank you for reaching out. Our team will contact you shortly." };
}

export async function submitQuery(data: any, token?: string) {
  if (!token) return { success: false, message: "Unauthorized" };
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) return { success: false, message: "Unauthorized" };

  const { error } = await supabaseServer.from("queries").insert({
    customer_name: user.email?.split("@")[0] || "Customer",
    email: data.email,
    subject: data.type,
    message: data.question,
    priority: "normal",
    status: "open",
    auth_user_id: user.id,
  });

  if (error) {
    console.error("Error inserting query:", error);
    return { success: false, message: "Failed to submit query." };
  }

  return { success: true, message: "Your query has been submitted successfully." };
}
