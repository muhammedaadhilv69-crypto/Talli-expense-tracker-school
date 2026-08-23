// src/lib/data/profile.ts

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, currency")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return profile;
}
