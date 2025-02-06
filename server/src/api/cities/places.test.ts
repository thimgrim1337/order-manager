// import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
// import { City, CityWithId, CityWithIdAndCountry } from './cities.model';

// const API = 'http://localhost:3000/api/v1/places';

// let response: Response;
// let body: Array<{ [key: string]: unknown }> & {
//   addressID: number;
//   name: string;
// };

// let place: CityWithIdAndCountry;
// beforeEach(() => {
//   place = {
//     name: 'DEVIL Express 1',
//     address: {
//       street: 'Otolińska',
//       streetNr: '21/101',
//       postal: '09-407',
//       city: 'Płock',
//       countryID: 1,
//     },
//   };
// });

// describe('GET /api/v1/places', () => {
//   it('responds with array of places', async () => {
//     response = await fetch(API);
//     body = await response.json();

//     expect(response.status).toBe(200);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expectTypeOf(body).toBeArray();
//     expect(() => PlaceWithIdWithFullAddress.parse(body[0])).not.toThrowError();
//   });
// });

// describe('GET /api/v1/places/:id', () => {
//   it('responds with single place', async () => {
//     response = await fetch(API + '/1');
//     body = await response.json();

//     expect(response.status).toBe(200);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expectTypeOf(body).toBeObject();
//     expect(() => PlaceWithIdWithFullAddress.parse(body)).not.toThrowError();
//   });

//   it('responds with 404', async () => {
//     response = await fetch(API + '/500');

//     expect(response.status).toBe(404);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//   });
// });

// describe('POST /api/v1/place', () => {
//   it('responds with an error if place is already exist', async () => {
//     response = await fetch(API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(409);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//   });

//   it('responds with an error if place is invalid', async () => {
//     place.name = '';

//     response = await fetch(API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(422);
//   });
//   it('responds with an inserted object', async () => {
//     place.id = 5;
//     place.name = 'Dawid Company';

//     response = await fetch(API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(201);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expect(() => City.parse(body)).not.toThrowError();
//   });
//   it('responds with an inserted object including existing addressID', () => {
//     expect(body).toHaveProperty('addressID');
//     expect(body.addressID).toEqual(1);
//   });

//   it('responds with inserted objecet including created addressID', async () => {
//     place.id = 6;
//     place.name = 'Firma Krzak';
//     place.address = {
//       street: 'Jana Pawła',
//       streetNr: '71/48',
//       postal: '09-410',
//       city: 'Płock',
//       countryID: 1,
//     };

//     response = await fetch(API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(201);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expect(() => City.parse(body)).not.toThrowError();
//     expect(body).toHaveProperty('addressID');
//     expect(body.addressID).not.toBe(1);
//   });
// });

// describe('PATCH /api/v1/places/:id', () => {
//   it('responds with updated place', async () => {
//     place.name = 'Dawid 2 Company';

//     response = await fetch(API + '/5', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(200);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expect(body).toHaveProperty('id');
//     expect(body).toHaveProperty('name');
//     expect(body.name).toBe('Dawid 2 Company');
//   });

//   it('responds with updated place including new address', async () => {
//     place.name = 'Dawid 2 Company';
//     place.address = {
//       street: 'Testowa',
//       streetNr: '40/1',
//       city: 'Płock',
//       postal: '09-404',
//       countryID: 1,
//     };

//     response = await fetch(API + '/5', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(place),
//     });

//     body = await response.json();

//     expect(response.status).toBe(200);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//     expect(body).toHaveProperty('id');
//     expect(body.addressID).not.toBe(1);
//   });
// });

// describe('DELETE /api/v1/places/:id', () => {
//   it('responds with 200 and deleted object', async () => {
//     response = await fetch(API + '/5', {
//       method: 'DELETE',
//     });

//     response = await fetch(API + '/6', {
//       method: 'DELETE',
//     });

//     body = await response.json();

//     expect(response.status).toBe(200);
//     expect(body).toHaveProperty('id');
//   });

//   it('responds with 404', async () => {
//     response = await fetch(API + '/15', {
//       method: 'DELETE',
//     });

//     body = await response.json();

//     expect(response.status).toBe(404);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//   });

//   it('responds with 500', async () => {
//     response = await fetch(API + '/504504dsds', {
//       method: 'DELETE',
//     });

//     body = await response.json();

//     expect(response.status).toBe(500);
//     expect(response.headers.get('Content-Type')).toContain('application/json');
//   });
// });
