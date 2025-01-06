import { describe, expect, expectTypeOf, it } from 'vitest';
import { Truck, TruckWithId } from './trucks.model';

const API = 'http://localhost:3000/api/v1/trucks';

let response: Response;
let body: Array<{ [key: string]: unknown }>;

const truck: Truck = {
  plate: 'WND0997C',
  insuranceEndAt: '2025-01-01',
  serviceEndAt: '2025-01-01',
};

describe('GET /api/v1/trucks', () => {
  it('responds with array of trucks', async () => {
    response = await fetch(API);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeArray();
    expect(body.length).toBe(14);
    expect(() => TruckWithId.parse(body[0])).not.toThrowError();
  });
});

describe('GET /api/v1/trucks/:id', () => {
  it('responds with single truck', async () => {
    response = await fetch(API + '/1');
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeObject();
    expect(() => TruckWithId.parse(body)).not.toThrowError();
  });

  it('responds with 404', async () => {
    response = await fetch(API + '/500');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});

describe('POST /api/v1/trucks', () => {
  it('responds with an error if truck is already exist', async () => {
    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(truck),
    });

    body = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('responds with an error if truck is invalid', async () => {
    truck.plate = '';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(truck),
    });

    body = await response.json();

    expect(response.status).toBe(422);
  });

  it('responds with an inserted object', async () => {
    truck.id = 15;
    truck.plate = 'WP0997F';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(truck),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toMatchObject(truck);
  });
});

describe('PATCH /api/v1/trucks/:id', () => {
  it('responds with updated truck', async () => {
    truck.plate = 'WP0997ZX';

    response = await fetch(API + '/15', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(truck),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toMatchObject(truck);
    expect(truck.plate).toBe('WP0997ZX');
    expect(body).toHaveProperty('id');
  });
});

describe('DELETE /api/v1/trucks/:id', () => {
  it('responds with 200', async () => {
    response = await fetch(API + '/15', {
      method: 'DELETE',
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject(truck);
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
