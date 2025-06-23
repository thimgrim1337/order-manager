import { ApiError, Customer } from '@/types/types';

export async function createCustomer(formData: Customer): Promise<Customer> {
  const response = await fetch('/api/v1/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409)
      throw {
        message: 'Nie udało się utworzyć kontrahenta. Kontrahent już istnieje.',
        statusCode: response.status,
      } satisfies ApiError;

    throw {
      message: data?.error?.message || 'Nie udało się utworzyć kontrahenta',
      statusCode: response.status,
    } satisfies ApiError;
  }

  return data as Customer;
}
