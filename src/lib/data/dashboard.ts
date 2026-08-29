// Re-exports for backward compatibility.
// Concrete implementations live in transactions.ts and budgets.ts.
export {
  getDashboardSummary,
  getSpendingByCategory,
  getRecentTransactions,
  getTransactions,
} from "./transactions";

export {
  getBudgetOverview,
  getAllBudgets,
  getAllBudgetsForPage,
  getMonthlyBudgetTotal,
  getCurrentMonthExpensesTotal,
  getMonthlyBudgetSummary,
} from "./budgets";
