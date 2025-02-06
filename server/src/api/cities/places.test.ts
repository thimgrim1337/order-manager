import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import { City, CityWithId } from './cities.model';

const API = 'http://localhost:3000/api/v1/cities';

let response: Response;
let body: Array<{ [key: string]: unknown }> & {
  addressID: number;
  name: string;
};

let city: CityWithId;
beforeEach(() => {
  city = {
    id: 1,
    name: 'Płock',
    postal: '09-410',
    countryID: 1,
  };
});

describe('GET /api/v1/cities', () => {
  it('responds with array of cities', async () => {
    response = await fetch(API);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeArray();
    expect(() => CityWithId.parse(body[0])).not.toThrowError();
  });
});

describe('GET /api/v1/cities/:id', () => {
  it('responds with single city', async () => {
    response = await fetch(API + '/1');
    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expectTypeOf(body).toBeObject();
    expect(() => CityWithId.parse(body)).not.toThrowError();
  });

  it('responds with 404', async () => {
    response = await fetch(API + '/500');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });
});

describe('POST /api/v1/city', () => {
  it('responds with an error if city is already exist', async () => {
    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(city),
    });

    body = await response.json();

    expect(response.status).toBe(409);
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('responds with an error if city is invalid', async () => {
    city.name = '';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(city),
    });

    body = await response.json();

    expect(response.status).toBe(422);
  });
  it('responds with an inserted object', async () => {
    city.id = 5;
    city.name = 'Warszawa';

    response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(city),
    });

    body = await response.json();

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(() => City.parse(body)).not.toThrowError();
  });
});

describe('PATCH /api/v1/cities/:id', () => {
  it('responds with updated city', async () => {
    city.name = 'Drobin';

    response = await fetch(API + '/5', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(city),
    });

    body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body.name).toBe('Dawid 2 Company');
  });

  describe('DELETE /api/v1/cities/:id', () => {
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
      expect(response.headers.get('Content-Type')).toContain(
        'application/json'
      );
    });

    it('responds with 500', async () => {
      response = await fetch(API + '/504504dsds', {
        method: 'DELETE',
      });

      body = await response.json();

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toContain(
        'application/json'
      );
    });
  });
});
