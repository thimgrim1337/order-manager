import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/dropdown-menu';

import { Dispatch, ReactElement, SetStateAction } from 'react';

export type DropdownMenuItem = {
  label: string;
  onClick: Dispatch<SetStateAction<boolean>>;
};

type DropdownMenuProps = {
  trigger?: ReactElement | string;
  title: string;
  items: DropdownMenuItem[];
};

export default function DropdownMenu({
  trigger,
  title,
  items,
}: DropdownMenuProps) {
  const isString = typeof trigger !== 'string' ? true : false;
  return (
    <Dropdown>
      {trigger && (
        <DropdownMenuTrigger
          className='text-primary-foreground'
          asChild={isString}
        >
          {trigger}
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.label} onClick={() => item.onClick(true)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </Dropdown>
  );
}
