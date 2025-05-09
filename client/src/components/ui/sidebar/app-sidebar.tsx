import { Link } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../primitives/sidebar';
import { Calendar, Home, ReceiptEuro, Settings } from 'lucide-react';
import SideBarLogo from './sidebar-logo';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Tablica czasu',
    url: '/time-table',
    icon: Calendar,
  },
  {
    title: 'Zlecenia',
    url: '/orders',
    icon: ReceiptEuro,
  },
  // {
  //   title: 'Zleceniodawcy',
  //   url: '/orders',
  //   icon: ReceiptEuro,
  // },
  // {
  //   title: 'Kierowcy',
  //   url: '/orders',
  //   icon: ReceiptEuro,
  // },
  // {
  //   title: 'Pojazdy',
  //   url: '/orders',
  //   icon: ReceiptEuro,
  // },
  // {
  //   title: 'Settings',
  //   url: '#',
  //   icon: Settings,
  // },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SideBarLogo />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className='text-primary'
                      to={item.url}
                      activeProps={{ style: { fontWeight: 'bold' } }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
