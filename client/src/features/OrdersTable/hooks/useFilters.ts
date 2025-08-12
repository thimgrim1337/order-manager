import {
  getRouteApi,
  RegisteredRouter,
  RouteIds,
  useNavigate,
} from '@tanstack/react-router';

export function useFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(
  routeId: T
) {
  const routeApi = getRouteApi<T>(routeId);
  const navigte = useNavigate();
  const filters = routeApi.useSearch();

  const setFilters = (partialFilters: Partial<typeof filters>) =>
    navigte({
      to: '.',
      search: (prev) => cleanEmptyParams({ ...prev, ...partialFilters }),
    });

  const resetFilters = () => navigte({ to: '.', search: {} });

  return { filters, setFilters, resetFilters };
}

export const cleanEmptyParams = <T extends Record<string, unknown>>(
  search: T
) => {
  const newSearch = { ...search };
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key];
    if (
      value === undefined ||
      value === '' ||
      (typeof value === 'number' && isNaN(value))
    )
      delete newSearch[key];
  });

  if (search.pageIndex === 0) delete newSearch.pageIndex;
  if (search.pageSize === 10) delete newSearch.pageSize;

  return newSearch;
};
