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
      className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition`}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <Icon className="w-16 h-16 text-white/90 drop-shadow-lg" strokeWidth={1.5} />
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
        {count !== undefined && (
          <p className="text-white/70 text-sm mt-1">
            {count.toLocaleString()} {count === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>
    </Link>
  );
}
