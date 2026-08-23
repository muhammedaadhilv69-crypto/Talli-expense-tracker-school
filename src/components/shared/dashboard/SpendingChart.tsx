import { getSpendingByCategory } from "@/lib/data/dashboard";
import SpendingBarChart from "./SpendingBarChart";

export default async function SpendingChart() {
  const data = await getSpendingByCategory();

  return <SpendingBarChart data={data} />;
}
