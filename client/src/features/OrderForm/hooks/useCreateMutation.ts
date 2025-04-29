import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type useCreateMutationProps<T> = {
  mutationFn: (formData: T) => Promise<T>;
  queryKey: [string];
  errorDescription?: string;
  toastTitle: string;
  toastDescription: string;
  onOpenDialogChange?: Dispatch<SetStateAction<boolean>>;
};

export function useCreateMutation<T>({
  mutationFn,
  queryKey,
  errorDescription,
  toastTitle,
  toastDescription,
  onOpenDialogChange,
}: useCreateMutationProps<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousItems = queryClient.getQueryData(queryKey);

      if (previousItems)
        queryClient.setQueryData(queryKey, (old: T[]) => [...old, newItem]);

      return { previousItems };
    },
    onError: (err, newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
        console.log(err);
      }
      toast({
        title: 'Błąd',
        description: errorDescription,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      if (onOpenDialogChange) onOpenDialogChange(false);
    },
    onSuccess: () => {
      toast({
        title: toastTitle,
        description: toastDescription,
      });
    },
  });

  return { createMutation };
}
