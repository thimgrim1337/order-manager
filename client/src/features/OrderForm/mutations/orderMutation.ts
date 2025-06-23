import { ApiError, Order, OrderWithId } from '@/types/types';

export async function createOrder(formData: Order): Promise<Order> {
  const response = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data?.error?.message || 'Nie udało się utworzyć zlecenia.',
      statusCode: response.status,
    } satisfies ApiError;

  return data as Order;
}

export async function updateOrder(formData: OrderWithId): Promise<OrderWithId> {
  const response = await fetch(`api/v1/orders/${formData.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data?.error?.message || 'Nie udało się utworzyć zlecenia.',
      statusCode: response.status,
    } satisfies ApiError;

  return data as OrderWithId;
}

export async function removeOrder(formData: OrderWithId): Promise<OrderWithId> {
  const response = await fetch(`api/v1/orders/${formData.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data?.error?.message || 'Nie udało się utworzyć zlecenia.',
      statusCode: response.status,
    } satisfies ApiError;

  return data as OrderWithId;
}
