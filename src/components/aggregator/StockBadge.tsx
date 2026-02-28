'use client';

interface StockBadgeProps {
  inStock: boolean;
}

export default function StockBadge({ inStock }: StockBadgeProps) {
  return inStock ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
      In Stock
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
      Sold Out
    </span>
  );
}
