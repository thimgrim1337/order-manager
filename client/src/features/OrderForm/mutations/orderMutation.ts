import { Order } from '@/types/types';

export async function createOrder(formData: Order): Promise<Order> {
  const response = await fetch('http://localhost:3000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Can't create an order");

  return (await response.json()) satisfies Order;
}

export async function updateOrder(formData: Order): Promise<Order> {
  const response = await fetch(
    `http://localhost:3000/api/v1/orders/${formData.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) throw new Error("Can't update an order");

  return (await response.json()) satisfies Order;
}

export async function removeOrder(formData: Order): Promise<Order> {
  const response = await fetch(
    `http://localhost:3000/api/v1/orders/${formData.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) throw new Error("Can't delete an order");

  return (await response.json()) satisfies Order;
}
