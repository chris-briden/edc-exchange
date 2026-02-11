import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import { categoryColors, type Category } from "@/lib/data";

export default function CategoryCard({ category }: { category: Category }) {
  const gradient = categoryColors[category.id] || "from-gray-500 to-gray-700";

  return (
    <Link
      href={`/categories#${category.id}`}
      className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
      style={{}}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition`}
      />
      <div className="relative z-10">
        <div className="mb-2">
          <CategoryIcon slug={category.id} size="lg" />
        </div>
        <h3 className="font-bold text-lg">{category.name}</h3>
        <p className="text-white/70 text-sm mt-1">
          {category.count.toLocaleString()} listings
        </p>
      </div>
    </Link>
  );
}
