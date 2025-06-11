import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

type useOptimisticMutationProps<T> = {
  mutationFn: (formData: T) => Promise<T>;
  queryKey: QueryKey;
  errorDescription?: string;
  toastDescription: string;
  onOpenDialogChange?: Dispatch<SetStateAction<boolean>>;
  isOptimistic?: boolean;
};

export function useOptimisticMutation<T>({
  mutationFn,
  queryKey,
  errorDescription,
  toastDescription,
  onOpenDialogChange,
  isOptimistic = false,
}: useOptimisticMutationProps<T>) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, T, { previousItems?: T[] }>({
    mutationFn: mutationFn,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      if (isOptimistic) {
        const previousItems = queryClient.getQueryData<T[]>(queryKey);
        if (previousItems)
          queryClient.setQueryData<T[]>(queryKey, (old = []) => [
            ...old,
            newItem,
          ]);
        return { previousItems };
      }
    },
    onError: (err, newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error(errorDescription || 'Wystąpił błąd podczas zapisu.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      if (onOpenDialogChange) onOpenDialogChange(false);
    },
    onSuccess: () => {
      toast.success(toastDescription);
    },
  });
}
