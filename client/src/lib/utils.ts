import { OrderFilters, SortParams } from '@/types/types';
import { SortingState } from '@tanstack/react-table';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const sortByToState = (sortBy: SortParams['sortBy'] | undefined) => {
  if (!sortBy) return [];

  const [id, desc] = sortBy.split('.');
  return [{ id, desc: desc === 'desc' }];
};

export const stateToSortBy = (sorting: SortingState | undefined) => {
  if (!sorting || sorting.length == 0) return undefined;

  const sort = sorting[0];

  return `${sort.id}.${sort.desc ? 'desc' : 'asc'}` as const;
};

export const stateToFilters = (filters: OrderFilters) =>
  Object.entries(filters)
    .flat()
    .reduce(
      (acc, cur, index) =>
        index % 2 === 0 ? acc + `${cur}=` : acc + `${cur}&`,
      ''
    )
    .toString()
    .slice(0, -1);
