import {
  PocketKnife,
  Flashlight,
  PenTool,
  Wrench,
  Disc3,
  Wallet,
  Watch,
  Backpack,
  Package,
  type LucideIcon,
} from "lucide-react";

const iconConfig: Record<
  string,
  { Icon: LucideIcon; gradient: string }
> = {
  knives: { Icon: PocketKnife, gradient: "from-orange-500 to-orange-600" },
  flashlights: { Icon: Flashlight, gradient: "from-amber-500 to-orange-500" },
  pens: { Icon: PenTool, gradient: "from-blue-500 to-blue-600" },
  "multi-tools": { Icon: Wrench, gradient: "from-sky-500 to-blue-600" },
  fidget: { Icon: Disc3, gradient: "from-orange-400 to-amber-500" },
  wallets: { Icon: Wallet, gradient: "from-blue-600 to-blue-700" },
  watches: { Icon: Watch, gradient: "from-slate-600 to-blue-600" },
  bags: { Icon: Backpack, gradient: "from-blue-400 to-sky-500" },
};

const defaultConfig = { Icon: Package, gradient: "from-gray-500 to-gray-600" };

const sizeMap = {
  sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { container: "w-12 h-12 rounded-xl", icon: "w-6 h-6" },
  lg: { container: "w-16 h-16 rounded-2xl", icon: "w-8 h-8" },
  xl: { container: "w-24 h-24 rounded-3xl", icon: "w-12 h-12" },
};

export default function CategoryIcon({
  slug,
  size = "md",
}: {
  slug: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const { Icon, gradient } = iconConfig[slug] || defaultConfig;
  const s = sizeMap[size];

  return (
    <div
      className={`${s.container} bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
    >
      <Icon className={`${s.icon} text-white`} />
    </div>
  );
}

export { iconConfig };
