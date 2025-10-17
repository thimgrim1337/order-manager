import { getTableName, sql, Table } from 'drizzle-orm';
import env from '../env';
import { db, connection } from './index';
import * as schema from './schema/index';
import * as seeds from './seeds/index';

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds.');
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

async function dropTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`DROP TABLE IF EXISTS ${getTableName(table)} CASCADE`)
  );
}

for (const table of [
  schema.driver,
  schema.truck,
  schema.status,
  schema.country,
  schema.city,
  schema.customer,
  schema.order,
  schema.loadingPlaces,
  schema.unloadingPlaces,
]) {
  await resetTable(db, table);
}

await seeds.customer(db);
await seeds.driver(db);
await seeds.truck(db);
await seeds.status(db);
await seeds.country(db);
// await seeds.city(db);
// await seeds.order(db);
// await seeds.loadingPlaces(db);
// await seeds.unloadingPlaces(db);

await connection.end();
