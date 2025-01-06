import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import {
  Customer,
  CustomerWithFullAddress,
  CustomerWithIdWithFullAddress,
} from './customers.model';

const API = 'http://localhost:3000/api/v1/customers';

let response: Response;
let body: Array<{ [key: string]: unknown }> & {
  addressID?: number;
  name?: string;
  tax?: string;
};

let customer: CustomerWithFullAddress;
beforeEach(() => {
  customer = {
    name: 'Test Comapny',
    tax: 'PL123445678',
    address: {
      street: 'Otolińska',
      streetNr: '21/101',
      postal: '09-400',
      city: 'Płock',
      countryID: 1,
    },
  };
});

describe('GET /api/v1/customers', () => {
  it('responds with array of customer', async () => {
    response = await fetch(API);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeArray();
    expect(() =>
      CustomerWithIdWithFullAddress.parse(body[0])
    ).not.toThrowError();
  });
});

describe('GET /api/v1/customers/:id', () => {
  it('responds with single customer', async () => {
    response = await fetch(API + '/1');
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeObject();
    expect(() => CustomerWithIdWithFullAddress.parse(body)).not.toThrowError();
  });

  it('responds with 404', async () => {
    response = await fetch(API + '/500');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});

describe('POST /api/v1/customer', () => {
  it('responds with an error if customer is already exist', async () => {
    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('responds with an error if customer is invalid', async () => {
    customer.name = '';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(422);
  });

  it('responds with an inserted object', async () => {
    customer.id = 5;
    customer.name = 'Dawid Company';
    customer.tax = '7743241621';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(() => Customer.parse(body)).not.toThrowError();
  });

  it('responds with an inserted object including existing addressID', () => {
    expect(body).toHaveProperty('addressID');
    expect(body.addressID).toEqual(1);
  });

  it('responds with inserted objecet including created addressID', async () => {
    customer.id = 6;
    customer.tax = '7743211111';
    customer.name = 'Firma Krzak';
    customer.address = {
      street: 'Jana Pawła',
      streetNr: '78/48',
      postal: '09-410',
      city: 'Płock',
      countryID: 1,
    };

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(() => Customer.parse(body)).not.toThrowError();
    expect(body).toHaveProperty('addressID');
    expect(body.addressID).not.toBe(1);
  });
});

describe('PATCH /api/v1/customers/:id', () => {
  it('responds with updated customer', async () => {
    customer.name = 'Dawid 2 Company';
    customer.tax = '7743241621';

    response = await fetch(API + '/5', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body.name).toBe('Dawid 2 Company');
    expect(body.tax).toBe('7743241621');
  });

  it('responds with updated customer including new address', async () => {
    customer.name = 'Dawid 2 Company';
    customer.tax = '7743241621';
    customer.address = {
      street: 'Testowa',
      streetNr: '404/1',
      city: 'Płock',
      postal: '09-404',
      countryID: 1,
    };

    response = await fetch(API + '/5', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toHaveProperty('id');
    expect(body.addressID).not.toBe(1);
  });
});

describe('DELETE /api/v1/customers/:id', () => {
  it('responds with 200 and deleted object', async () => {
    response = await fetch(API + '/5', {
      method: 'DELETE',
    });

    response = await fetch(API + '/6', {
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
