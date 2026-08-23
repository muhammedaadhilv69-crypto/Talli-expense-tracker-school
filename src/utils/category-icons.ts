import {
  Utensils,
  ShoppingCart,
  Bus,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Home,
  CircleDollarSign,
  type LucideIcon,
  Receipt,
  Gift,
  CircleEllipsis,
  BriefcaseBusiness,
  Laptop,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Utensils: Utensils,
  ShoppingBag: ShoppingCart,
  Car: Bus,
  Gamepad2: Gamepad2,
  GraduationCap: GraduationCap,
  health: HeartPulse,
  BriefcaseBusiness: BriefcaseBusiness,
  Receipt: Receipt,
  housing: Home,
  CircleDollarSign: CircleDollarSign,
  Gift: Gift,
  CircleEllipsis: CircleEllipsis,
  Laptop: Laptop
};

export function getCategoryIcon(icon: string): LucideIcon {
  return categoryIcons[icon] ?? CircleDollarSign;
}
