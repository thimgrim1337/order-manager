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
  mutation: UseMutationResult<unknown, Error, OrderWithId, unknown>;
  isOpen: boolean;
  order: OrderWithId;
};

export default function RemoveDialog({
  isOpen,
  onOpenChange,
  mutation,
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
          <AlertDialogAction
            onClick={() =>
              mutation.mutate(order, { onSettled: () => onOpenChange(false) })
            }
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
