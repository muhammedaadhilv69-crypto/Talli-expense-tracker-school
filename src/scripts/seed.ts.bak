import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DEMO_EMAIL = "demo@talli.local";
const DEMO_PASSWORD = "12345678";
const DEMO_NAME = "Demo Student";
const DEMO_CURRENCY = "INR";

// Fixed category IDs.
// Because categories are global, deterministic IDs make the seed
// safely repeatable without requiring a unique(name, type) constraint.
const CATEGORY_IDS = {
  salary: "00000000-0000-0000-0000-000000000001",
  freelance: "00000000-0000-0000-0000-000000000002",
  gift: "00000000-0000-0000-0000-000000000003",
  otherIncome: "00000000-0000-0000-0000-000000000004",

  food: "00000000-0000-0000-0000-000000000101",
  transport: "00000000-0000-0000-0000-000000000102",
  education: "00000000-0000-0000-0000-000000000103",
  shopping: "00000000-0000-0000-0000-000000000104",
  entertainment: "00000000-0000-0000-0000-000000000105",
  health: "00000000-0000-0000-0000-000000000106",
  bills: "00000000-0000-0000-0000-000000000107",
  otherExpense: "00000000-0000-0000-0000-000000000108",
};

async function findDemoUser() {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email === DEMO_EMAIL) ?? null;
}

async function resetDemoUser() {
  const existingUser = await findDemoUser();

  if (!existingUser) {
    console.log("ℹ️ No existing demo user found.");
    return;
  }

  const userId = existingUser.id;

  console.log(`♻️ Resetting demo user ${existingUser.email}...`);

  const { error: savingsError } = await supabase
    .from("savings_goals")
    .delete()
    .eq("user_id", userId);

  if (savingsError) throw savingsError;

  const { error: budgetsError } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", userId);

  if (budgetsError) throw budgetsError;

  const { error: transactionsError } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", userId);

  if (transactionsError) throw transactionsError;

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) throw profileError;

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) throw authError;

  console.log("✅ Existing demo user removed.");
}

// async function resetDemoUser() {
//   const existingUser = await findDemoUser();

//   if (!existingUser) {
//     console.log("ℹ️ No existing demo user found.");
//     return;
//   }

//   const userId = existingUser.id;

//   console.log(`♻️ Resetting demo user ${existingUser.email}...`);

//   // Delete user-owned rows first.
//   // This keeps the seed safe even if some FK constraints aren't CASCADE.
//   const tables = [
//     "savings_goals",
//     "budgets",
//     "transactions",
//     "profiles",
//   ] as const;

//   for (const table of tables) {
//     const { error } = await supabase
//       .from(table)
//       .delete()
//       .eq("id", table === "profiles" ? userId : userId);

//     if (error) {
//       throw new Error(
//         `Failed deleting from ${table}: ${error.message}`,
//       );
//     }
//   }

//   // Delete the Auth user itself.
//   const { error: deleteAuthError } =
//     await supabase.auth.admin.deleteUser(userId);

//   if (deleteAuthError) {
//     throw deleteAuthError;
//   }

//   console.log("✅ Existing demo user removed.");
// }

async function createDemoUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Supabase did not return the created user.");
  }

  return data.user;
}

async function seedCategories() {
  const categories = [
    {
      id: CATEGORY_IDS.salary,
      name: "Salary",
      type: "income",
      icon: "BriefcaseBusiness",
    },
    {
      id: CATEGORY_IDS.freelance,
      name: "Freelance",
      type: "income",
      icon: "Laptop",
    },
    {
      id: CATEGORY_IDS.gift,
      name: "Gift",
      type: "income",
      icon: "Gift",
    },
    {
      id: CATEGORY_IDS.otherIncome,
      name: "Other Income",
      type: "income",
      icon: "CircleDollarSign",
    },

    {
      id: CATEGORY_IDS.food,
      name: "Food",
      type: "expense",
      icon: "Utensils",
    },
    {
      id: CATEGORY_IDS.transport,
      name: "Transport",
      type: "expense",
      icon: "Car",
    },
    {
      id: CATEGORY_IDS.education,
      name: "Education",
      type: "expense",
      icon: "GraduationCap",
    },
    {
      id: CATEGORY_IDS.shopping,
      name: "Shopping",
      type: "expense",
      icon: "ShoppingBag",
    },
    {
      id: CATEGORY_IDS.entertainment,
      name: "Entertainment",
      type: "expense",
      icon: "Gamepad2",
    },
    {
      id: CATEGORY_IDS.health,
      name: "Health",
      type: "expense",
      icon: "HeartPulse",
    },
    {
      id: CATEGORY_IDS.bills,
      name: "Bills",
      type: "expense",
      icon: "Receipt",
    },
    {
      id: CATEGORY_IDS.otherExpense,
      name: "Other",
      type: "expense",
      icon: "CircleEllipsis",
    },
  ];

  const { error } = await supabase.from("categories").upsert(categories, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  console.log("✅ Categories seeded.");
}

async function seedProfile(userId: string) {
  // Your Auth trigger should have already created this row.
  // We update it rather than inserting another profile.
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: DEMO_NAME,
      currency: DEMO_CURRENCY,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  console.log("✅ Profile seeded.");
}

async function seedTransactions(userId: string) {
  const transactions = [
    // Income
    {
      user_id: userId,
      category_id: CATEGORY_IDS.salary,
      type: "income",
      amount: 5000,
      description: "Monthly allowance",
      transaction_date: "2026-08-01",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.freelance,
      type: "income",
      amount: 2500,
      description: "Website project",
      transaction_date: "2026-08-05",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.gift,
      type: "income",
      amount: 1000,
      description: "Birthday gift",
      transaction_date: "2026-08-08",
    },

    // Expenses
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      type: "expense",
      amount: 250,
      description: "Lunch",
      transaction_date: "2026-08-02",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.transport,
      type: "expense",
      amount: 120,
      description: "Taxi",
      transaction_date: "2026-08-03",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.education,
      type: "expense",
      amount: 800,
      description: "Online course",
      transaction_date: "2026-08-04",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      type: "expense",
      amount: 340,
      description: "Dinner",
      transaction_date: "2026-08-06",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.shopping,
      type: "expense",
      amount: 650,
      description: "Clothes",
      transaction_date: "2026-08-07",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.entertainment,
      type: "expense",
      amount: 300,
      description: "Movie",
      transaction_date: "2026-08-09",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.transport,
      type: "expense",
      amount: 180,
      description: "Bus and taxi",
      transaction_date: "2026-08-10",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      type: "expense",
      amount: 420,
      description: "Groceries",
      transaction_date: "2026-08-11",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.education,
      type: "expense",
      amount: 100,
      description: "Study materials",
      transaction_date: "2026-08-12",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.health,
      type: "expense",
      amount: 250,
      description: "Pharmacy",
      transaction_date: "2026-08-13",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      type: "expense",
      amount: 290,
      description: "Lunch",
      transaction_date: "2026-08-15",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.bills,
      type: "expense",
      amount: 500,
      description: "Phone bill",
      transaction_date: "2026-08-16",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.entertainment,
      type: "expense",
      amount: 200,
      description: "Games",
      transaction_date: "2026-08-18",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      type: "expense",
      amount: 360,
      description: "Dinner",
      transaction_date: "2026-08-20",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.shopping,
      type: "expense",
      amount: 450,
      description: "Accessories",
      transaction_date: "2026-08-21",
    },
  ];

  const { error } = await supabase.from("transactions").insert(transactions);

  if (error) {
    throw error;
  }

  console.log("✅ Transactions seeded.");
}

async function seedBudgets(userId: string) {
  const budgets = [
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      amount: 2000,
      period: "monthly",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.transport,
      amount: 1000,
      period: "monthly",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.education,
      amount: 1500,
      period: "monthly",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.shopping,
      amount: 1000,
      period: "monthly",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
    },
    {
      user_id: userId,
      category_id: CATEGORY_IDS.entertainment,
      amount: 750,
      period: "monthly",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
    },

    // Weekly budget example
    {
      user_id: userId,
      category_id: CATEGORY_IDS.food,
      amount: 500,
      period: "weekly",
      start_date: "2026-08-17",
      end_date: "2026-08-23",
    },
  ];

  const { error } = await supabase.from("budgets").insert(budgets);

  if (error) {
    throw error;
  }

  console.log("✅ Budgets seeded.");
}

async function seedSavingsGoals(userId: string) {
  const savingsGoals = [
    {
      user_id: userId,
      name: "New Laptop",
      target_amount: 50000,
      current_amount: 12500,
      target_date: "2027-03-01",
      description: "Saving for a new development laptop.",
    },
    {
      user_id: userId,
      name: "Emergency Fund",
      target_amount: 20000,
      current_amount: 7500,
      target_date: "2027-01-01",
      description: "Build a small emergency fund.",
    },
    {
      user_id: userId,
      name: "Trip",
      target_amount: 15000,
      current_amount: 4000,
      target_date: "2027-06-01",
      description: "Savings for a future trip.",
    },
  ];

  const { error } = await supabase.from("savings_goals").insert(savingsGoals);

  if (error) {
    throw error;
  }

  console.log("✅ Savings goals seeded.");
}

async function seed() {
  console.log("🌱 Starting Talli database seed...\n");

  // Reset the demo Auth user and all of its data.
  await resetDemoUser();

  // Global categories.
  await seedCategories();

  // Create fresh Auth user.
  const user = await createDemoUser();

  console.log(`👤 Created ${user.email}`);
  console.log(`🆔 ${user.id}\n`);

  // Profile is created by your Auth trigger.
  await seedProfile(user.id);

  await seedTransactions(user.id);
  await seedBudgets(user.id);
  await seedSavingsGoals(user.id);

  console.log("\n🎉 Talli seed completed successfully!");
  console.log("-----------------------------------");
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log("-----------------------------------");
}

seed().catch((error) => {
  console.error("\n❌ Talli seed failed:");
  console.error(error);
  process.exit(1);
});
