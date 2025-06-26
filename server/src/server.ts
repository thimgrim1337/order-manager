import express, { urlencoded, json } from 'express';
import { notFound } from './middleware/not-found';
import { error } from './middleware/error';
import api from './api/index';
import env from './env';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createFakeOrder } from './db/seeds/order';
import { appendData } from './lib/file';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// async function seed() {
//   try {
//     const orders = [];
//     for (let i = 0; i < 999; i++) {
//       orders.push(createFakeOrder());
//     }

//     await appendData(join(__dirname, 'db/seeds/data/orders.json'), orders);
//   } catch (error) {
//     console.error(error);
//   }
// }

// seed();

app.use('/api/v1', api);

app.use(notFound);
app.use(error);

app.listen(env.PORT, () =>
  console.log(`Server is running on port: ${env.PORT}`)
);

export default app;
