import AppSidebar from '@/components/ui/sidebar/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/primitives/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className='bg-primary-foreground' />
      <Outlet />
    </SidebarProvider>
  );
}
