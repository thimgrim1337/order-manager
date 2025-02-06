import { OrderCreate } from '@/types/types';

export async function createOrder(formData: OrderCreate): Promise<OrderCreate> {
  const response = await fetch('http://localhost:3000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Can't create an order");

  return (await response.json()) satisfies OrderCreate;
}
