import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  PiggyBank,
  BarChart3,
  Bot,
} from "lucide-react";

export const mainNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    disabled: false,
  },
  {
    title: "Budgets",
    href: "/dashboard/budgets",
    icon: Target,
    disabled: false,
  },
  {
    title: "Savings",
    href: "/dashboard/savings",
    icon: PiggyBank,
    disabled: false,
  },
  {
    title: "AI Guide (Coming soon)",
    href: "/dashboard/ai",
    icon: Bot,
    disabled: true,
  },
];

export const insightNav = [
  {
    title: "Reports (Coming soon)",
    href: "/dashboard/reports",
    icon: BarChart3,
    disabled: false,
  },
];

export const allRoutes = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budgets",
    href: "/dashboard/budgets",
    icon: Target,
  },
  {
    title: "Savings",
    href: "/dashboard/savings",
    icon: PiggyBank,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
];
