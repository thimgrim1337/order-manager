import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/primitives/sonner';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Root,
  }
);

function Root() {
  return (
    <>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
