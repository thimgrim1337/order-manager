import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import { Order, OrderWithId } from './orders.model';

const API = 'http://localhost:3000/api/v1/orders';

let response: Response;
let body: Array<{ [key: string]: unknown }> & {
  orderNr: string;
  loadingPlaces: number[];
  unloadingPlaces: number[];
};

let order: Order;
beforeEach(() => {
  order = {
    orderNr: '3/11/2024',
    startDate: '2024-12-19',
    endDate: '2024-12-19',
    statusID: 3,
    price: '10000.00',
    truckID: 4,
    driverID: 5,
    customerID: 3,
    loadingPlaces: [1, 2],
    unloadingPlaces: [1],
  };
});

describe('GET /api/v1/orders', () => {
  it('responds with array of orders', async () => {
    response = await fetch(API);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeArray();
    expect(body.length).toBe(4);
    expect(() => OrderWithId.parse(body[0])).not.toThrowError();
  });
});

describe('GET /api/v1/orders/:id', () => {
  it('responds with single order', async () => {
    response = await fetch(API + '/1');
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeObject();
    expect(() => OrderWithId.parse(body)).not.toThrowError();
  });

  it('responds with 404', async () => {
    response = await fetch(API + '/500');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});

describe('POST /api/v1/orders', () => {
  it('respond with an error if order is already exist', async () => {
    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    body = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('responds with an error if order is invalid', async () => {
    order.orderNr = '';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    body = await response.json();

    expect(response.status).toBe(422);
  });

  it('responds with an inserted object', async () => {
    order.id = 5;
    order.orderNr = '5/11/2024';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(() => Order.parse(body)).not.toThrowError();
  });
});

describe('PATCH /api/v1/orders/:id', () => {
  it('responds with updated customer', async () => {
    order.orderNr = '1337/11/2024';
    order.unloadingPlaces = [2, 3];

    response = await fetch(API + '/5', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('orderNr');
    expect(body.orderNr).toBe('1337/11/2024');
  });
});

describe('DELETE /api/v1/orders/:id', () => {
  it('responds with 200 and deleted object', async () => {
    response = await fetch(API + '/5', {
      method: 'DELETE',
    });
    body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty('id');
  });
  it('responds with 404', async () => {
    response = await fetch(API + '/15', {
      method: 'DELETE',
    });

    body = await response.json();

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
  it('responds with 500', async () => {
    response = await fetch(API + '/504504dsds', {
      method: 'DELETE',
    });

    body = await response.json();

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});
