export type Budget = {
 id: string;
 category_id: string;
 amount: number;
 period: "monthly" | "weekly";
 start_date: string;
 end_date: string;
 categories: {
 name: string;
 icon: string;
 } | null;
 spent?: number | undefined;
}