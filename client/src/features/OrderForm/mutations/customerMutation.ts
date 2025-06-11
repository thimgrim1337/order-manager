import { Customer, CustomerWithId } from '@/types/types';

export async function createCustomer(
  formData: Customer
): Promise<CustomerWithId> {
  const response = await fetch('/api/v1/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Can't create a customer");

  return (await response.json()) satisfies CustomerWithId;
}
