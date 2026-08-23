"use client";

import { useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getAuthData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch profile:", error);
          setProfile(null);
        } else {
          setProfile(profile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    getAuthData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;

      setUser(user);

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch profile:", error);
          setProfile(null);
        } else {
          setProfile(profile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signUp(email: string, password: string, name: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/consent`,
      },
    });
  }

  async function logIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function logOut() {
    return await supabase.auth.signOut();
  }

  return {
    user,
    profile,
    loading,
    signUp,
    logIn,
    logOut,
  };
}
