import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/primitives/alert-dialog';
import { OrderWithId } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type RemoveDialogProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  mutationFn: UseMutationResult<unknown, Error, OrderWithId, unknown>['mutate'];
  isOpen: boolean;
  order: OrderWithId;
};

export default function RemoveDialog({
  isOpen,
  onOpenChange,
  mutationFn,
  order,
}: RemoveDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta czynność jest nieodwracalna. Bezpowrotnie usuniesz zlecenie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutationFn(order)}>
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
