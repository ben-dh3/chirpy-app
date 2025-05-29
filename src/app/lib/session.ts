"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUserSession() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return { 
        userId: user.id, 
        name: user.user_metadata?.name
      };
    }
    return null;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}