'use client';

import { Store, ShoppingBag } from 'lucide-react';

interface RetailerBadgeProps {
  name: string;
  type: 'retail' | 'secondary';
  logoUrl?: string | null;
}

export default function RetailerBadge({ name, type }: RetailerBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-md ${
          type === 'retail'
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-amber-500/20 text-amber-400'
        }`}
      >
        {type === 'retail' ? (
          <Store className="w-3.5 h-3.5" />
        ) : (
          <ShoppingBag className="w-3.5 h-3.5" />
        )}
      </div>
      <span className="text-sm font-medium text-white">{name}</span>
    </div>
  );
}
