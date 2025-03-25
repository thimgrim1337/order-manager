import { Button } from '@/components/ui/button';
import FormDialog from '@/components/ui/data-table/data-table-form-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderForm from '@/features/OrderForm/components/OrderForm';
import { OrderWithDetails } from '@/types/types';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

type TableRowDropdownProps = {
  order: OrderWithDetails;
};

export default function TableRowOptions({ order }: TableRowDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <FormDialog
        title={`Edytuj zlecenie nr ${order.orderNr}`}
        description={'W tym oknie możesz edytować swoje zlecenie'}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <OrderForm values={order} onOpenChange={setIsOpen} />
      </FormDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className='h-8 w-8 p-0 bg-transparent'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
          <DropdownMenuItem>Szczegóły</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Edytuj
          </DropdownMenuItem>
          <DropdownMenuItem>Usuń</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
