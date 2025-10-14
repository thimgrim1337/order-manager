import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/primitives/dialog';
import { Button } from '@/components/ui/primitives/button';
import { Order, OrderWithDetails } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

import { Ban, CheckCircle, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/primitives/badge';

const statusConfig = {
  pending: {
    id: 1,
    label: 'W trakcie',
    icon: Truck,
    description: 'Zlecenie zostało rozpoczęte.',
  },
  cancelled: {
    id: 2,
    label: 'Anulowane',
    icon: Ban,
    description: 'Zlecenie zostało anulowane.',
  },
  delivered: {
    id: 3,
    label: 'Zakończone',
    icon: CheckCircle,
    description: 'Zlecenie zostało zakończone.',
  },
};

type StatusDialogProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  mutation: UseMutationResult<unknown, Error, Order, unknown>['mutate'];
  order: OrderWithDetails;
};

export default function StatusDialog({
  onOpenChange,
  isOpen,
  mutation,
  order,
}: StatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Zmień status zlecenia nr {order.orderNr}</DialogTitle>
        </DialogHeader>

        <div className='flex items-center gap-3'>
          <span>Aktualny status:</span>
          {order.status ? (
            <Badge>{order.status}</Badge>
          ) : (
            <Badge variant='secondary'>Not Set</Badge>
          )}
        </div>
        <div className='space-y-3 pt-4'>
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={status}
                variant='outline'
                className='w-full justify-start h-auto p-4 text-left'
                onClick={() =>
                  mutation(
                    { ...order, statusID: config.id },
                    { onSettled: () => onOpenChange(false) }
                  )
                }
              >
                <div className='flex items-start gap-3'>
                  <Icon className='w-5 h-5 mt-0.5 flex-shrink-0' />
                  <div className='space-y-1'>
                    <div className='font-medium'>{config.label}</div>
                    <div className='text-sm text-muted-foreground'>
                      {config.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
