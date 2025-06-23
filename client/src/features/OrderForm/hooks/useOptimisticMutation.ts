import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type useOptimisticMutationProps<T> = {
  mutationFn: (formData: T) => Promise<T>;
  queryKey: QueryKey;
  successMessage: string;
  errorMessage?: string;
  isOptimistic?: boolean;
};

export function useOptimisticMutation<T>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
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
      toast.error(errorMessage || err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onSuccess: () => {
      toast.success(successMessage);
    },
  });
}
