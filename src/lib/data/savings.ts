import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 15;

export async function getAllSavingsForPage(page = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: savings,
    error,
    count,
  } = await supabase
    .from("savings_goals")
    .select(
      `
        id,
        name,
        target_amount,
        current_amount,
        target_date,
        description
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return {
    savings,
    count,
    totalPages,
  };
}
