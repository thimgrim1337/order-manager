import { describe, expect, expectTypeOf, it } from 'vitest';
import { Driver, DriverWithId } from './drivers.model';

const API = 'http://localhost:3000/api/v1/drivers';

let response: Response;
let body: Array<{ [key: string]: unknown }>;

const driver: Driver = {
  firstName: 'Konrad',
  lastName: 'Włodarski',
};

describe('GET /api/v1/drivers', () => {
  it('responds with array of drivers', async () => {
    response = await fetch(API);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeArray();
    expect(body.length).toBe(14);
    expect(() => DriverWithId.parse(body[0])).not.toThrowError();
  });
});

describe('GET /api/v1/drivers/:id', () => {
  it('responds with single truck', async () => {
    response = await fetch(API + '/1');
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeObject();
    expect(() => DriverWithId.parse(body)).not.toThrowError();
  });

  it('responds with 404', async () => {
    response = await fetch(API + '/500');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});

describe('POST /api/v1/driver', () => {
  it('responds with an error if driver is already exist', async () => {
    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    body = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('responds with an error if driver is invalid', async () => {
    driver.firstName = '';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    body = await response.json();

    expect(response.status).toBe(422);
  });

  it('responds with an inserted object', async () => {
    driver.id = 15;
    driver.firstName = 'Karol';
    driver.lastName = 'Dygner';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toMatchObject(driver);
  });
});

describe('PATCH /api/v1/drivers/:id', () => {
  it('responds with updated driver', async () => {
    driver.firstName = 'Dawid';
    driver.lastName = 'Dygner';

    response = await fetch(API + '/15', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toMatchObject(driver);
    expect(driver.firstName).toBe('Dawid');
    expect(body).toHaveProperty('id');
  });
});

describe('DELETE /api/v1/drivers/:id', () => {
  it('responds with 204', async () => {
    response = await fetch(API + '/15', {
      method: 'DELETE',
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject(driver);
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
