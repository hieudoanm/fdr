'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { PiMagnifyingGlass } from 'react-icons/pi';
import { countries, foods, type Food } from '@/data';

interface CuisineListProps {
  filterLabel?: string;
}

const cuisineLabel = (country: string): string =>
  countries.find((cuisine) => cuisine.value === country)?.label ?? country;

const cuisineEmoji = (country: string): string =>
  countries.find((cuisine) => cuisine.value === country)?.emoji ?? '🍽️';

export const CuisineList: FC<CuisineListProps> = ({
  filterLabel = 'All countries',
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const rows: Food[] = useMemo(() => {
    const query = search.toLowerCase().trim();
    return foods.filter(
      (food) =>
        (filter === 'all' || food.country === filter) &&
        (!query ||
          food.label.toLowerCase().includes(query) ||
          cuisineLabel(food.country).toLowerCase().includes(query))
    );
  }, [search, filter]);

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="border-base-content/10 bg-base-200 flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          <PiMagnifyingGlass className="text-base-content/50 h-4 w-4 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes or countries…"
            aria-label="Search dishes"
            data-testid="cuisine-search"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <label className="text-base-content/70 flex items-center gap-2 text-xs font-bold tracking-wider uppercase sm:self-center">
          Cuisine
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            data-testid="cuisine-filter"
            className="border-base-content/20 bg-base-200 text-base-content cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium normal-case outline-none">
            <option value="all">{filterLabel}</option>
            {countries.map((cuisine) => (
              <option key={cuisine.value} value={cuisine.value}>
                {cuisine.emoji} {cuisine.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="border-base-content/10 bg-base-200 mt-4 overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" data-testid="cuisine-table">
            <thead>
              <tr className="text-base-content/50 border-base-content/10 border-b text-xs font-bold tracking-wider uppercase">
                <th className="px-4 py-3">Dish</th>
                <th className="px-4 py-3">Cuisine</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Slug</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-base-content/50 px-4 py-8 text-center">
                    No dishes match your search
                  </td>
                </tr>
              ) : (
                rows.map((food) => (
                  <tr
                    key={food.value}
                    data-testid="cuisine-row"
                    className="border-base-content/5 border-b last:border-b-0">
                    <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                      <span className="mr-2">{food.emoji}</span>
                      {food.label}
                    </td>
                    <td className="text-base-content/60 px-4 py-2.5 whitespace-nowrap">
                      {cuisineEmoji(food.country)} {cuisineLabel(food.country)}
                    </td>
                    <td className="text-base-content/60 px-4 py-2.5 capitalize">
                      {food.category}
                    </td>
                    <td className="text-base-content/60 px-4 py-2.5 capitalize">
                      {food.subcategory}
                    </td>
                    <td className="text-base-content/40 px-4 py-2.5 font-mono text-xs whitespace-nowrap">
                      {food.value}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p
          data-testid="cuisine-count"
          className="text-base-content/50 border-base-content/10 border-t px-4 py-2 text-xs">
          {rows.length} of {foods.length} dishes
        </p>
      </div>
    </div>
  );
};

CuisineList.displayName = 'CuisineList';
