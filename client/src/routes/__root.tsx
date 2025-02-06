import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Root,
  }
);

function Root() {
  return (
    <>
      <div className=' max-w-screen-2xl m-auto'>
        <div className='p-2 flex gap-2'>
          <Link to='/' className='[&.active]:font-bold'>
            Home
          </Link>
          <Link to='/orders' className='[&.active]:font-bold'>
            Zlecenia
          </Link>
        </div>
        <hr />
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </div>
    </>
  );
}
