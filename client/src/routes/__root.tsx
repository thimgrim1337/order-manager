import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Root,
    notFoundComponent: () => {
      return (
        <div>
          <p>This is the notFoundComponent configured on root route</p>
          <Link to='/'>Start Over</Link>
        </div>
      );
    },
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
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </div>
    </>
  );
}
