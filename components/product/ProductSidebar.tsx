'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

function FilterSection({ title, children, isOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        className="flex items-center justify-between w-full text-sm font-bold text-gray-800 hover:text-black uppercase tracking-wide"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function ProductSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:block pr-8 border-r border-gray-100 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold text-base uppercase tracking-wide">
          Filters
        </span>
        <button className="text-xs text-accent font-bold uppercase hover:underline">
          Clear All
        </button>
      </div>

      {/* Brands */}
      <FilterSection title="Brands">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search Brand"
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black"
          />
          <Search className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {['Nike', 'Puma', 'Adidas', 'H&M', 'Zara', 'Levis', 'Biba', 'Roadster'].map((brand) => (
          <label key={brand} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm text-gray-600 group-hover:text-black">
              {brand}
            </span>
            <span className="text-[10px] text-gray-400 ml-auto">
              (120)
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        {[
          'Rs. 199 to Rs. 599',
          'Rs. 599 to Rs. 999',
          'Rs. 999 to Rs. 1999',
          'Rs. 1999 to Rs. 2999',
          'Rs. 2999+',
        ].map((price) => (
          <label key={price} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm text-gray-600 group-hover:text-black">
              {price}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {[
            'bg-black',
            'bg-white border border-gray-200',
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-400',
            'bg-pink-500',
          ].map((color, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${color}`}
            />
          ))}
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount Range">
        {[
          '10% and above',
          '20% and above',
          '30% and above',
          '50% and above',
        ].map((discount) => (
          <label key={discount} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="discount"
              className="w-4 h-4 border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm text-gray-600 group-hover:text-black">
              {discount}
            </span>
          </label>
        ))}
      </FilterSection>

    </aside>
  );
}