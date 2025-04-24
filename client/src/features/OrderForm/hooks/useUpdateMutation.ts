import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type useUpdateMutationProps<T> = {
  mutationFn: (formData: T) => Promise<T>;
  queryKey: [string];
  errorDescription?: string;
  toastTitle: string;
  toastDescription: string;
  onOpenDialogChange?: Dispatch<SetStateAction<boolean>>;
};

export function useUpdateMutation<T>({
  mutationFn,
  queryKey,
  errorDescription,
  toastTitle,
  toastDescription,
  onOpenDialogChange,
}: useUpdateMutationProps<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: mutationFn,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousOrders = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, newData);

      return { previousOrders, newData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([queryKey], context?.previousOrders);
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

  return { mutation };
}
