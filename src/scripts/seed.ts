import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import seedData from "./seed.json";

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

const DEMO_EMAIL = seedData.demo.email;
const DEMO_PASSWORD = seedData.demo.password;
const DEMO_NAME = seedData.demo.full_name;
const DEMO_CURRENCY = seedData.demo.currency;

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
} as const;

type CategoryKey = keyof typeof CATEGORY_IDS;

function resolveCategoryId(key: string): string {
  if (!(key in CATEGORY_IDS)) {
    throw new Error(
      `Unknown category key in seed.json: "${key}". Add it to CATEGORY_IDS in seed.ts.`,
    );
  }
  return CATEGORY_IDS[key as CategoryKey];
}

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
  const transactions = seedData.transactions.map((transaction) => ({
    user_id: userId,
    category_id: resolveCategoryId(transaction.category_id),
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    transaction_date: transaction.transaction_date,
  }));

  const { error } = await supabase.from("transactions").insert(transactions);

  if (error) {
    throw error;
  }

  console.log(`✅ ${transactions.length} transactions seeded.`);
}

async function seedBudgets(userId: string) {
  const budgets = seedData.budgets.map((budget) => ({
    user_id: userId,
    category_id: resolveCategoryId(budget.category_id),
    amount: budget.amount,
    period: budget.period,
    start_date: budget.start_date,
    end_date: budget.end_date,
  }));

  const { error } = await supabase.from("budgets").insert(budgets);

  if (error) {
    throw error;
  }

  console.log(`✅ ${budgets.length} budgets seeded.`);
}

async function seedSavingsGoals(userId: string) {
  const savingsGoals = seedData.savings_goals.map((goal) => ({
    user_id: userId,
    name: goal.name,
    target_amount: goal.target_amount,
    current_amount: goal.current_amount,
    target_date: goal.target_date,
    description: goal.description,
  }));

  const { error } = await supabase.from("savings_goals").insert(savingsGoals);

  if (error) {
    throw error;
  }

  console.log(`✅ ${savingsGoals.length} savings goals seeded.`);
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
