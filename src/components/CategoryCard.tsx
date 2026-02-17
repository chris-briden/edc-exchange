import Link from "next/link";
import { iconConfig } from "@/components/CategoryIcon";
import { categoryColors } from "@/lib/data";
import { Package } from "lucide-react";

type CategoryCardProps = {
  slug: string;
  name: string;
  count?: number;
};

export default function CategoryCard({ slug, name, count }: CategoryCardProps) {
  const gradient = categoryColors[slug] || "from-gray-500 to-gray-700";
  const config = iconConfig[slug] || { Icon: Package };
  const Icon = config.Icon;

  return (
    <Link
      href={`/categories?category=${slug}`}
      className="group relative overflow-hidden rounded-2xl p-6 bg-zinc-900/50 backdrop-blur border border-zinc-800 text-white hover:border-orange-500/50 transition-all hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-60 transition`}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <Icon className="w-16 h-16 text-orange-400/80 group-hover:text-orange-300 drop-shadow-lg transition" strokeWidth={1.5} />
        </div>
        <h3 className="font-bold text-lg text-white">{name}</h3>
        {count !== undefined && (
          <p className="text-gray-400 text-sm mt-1">
            {count.toLocaleString()} {count === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>
    </Link>
  );
}
