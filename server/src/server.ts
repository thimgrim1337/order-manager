import express, { urlencoded, json } from 'express';
import { notFound } from './middleware/not-found';
import { error } from './middleware/error';
import api from './api/index';
import env from './env';
import cors from 'cors';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use('/api/v1', api);

app.use(notFound);
app.use(error);

app.listen(env.PORT, () =>
  console.log(`Server is running on port: ${env.PORT}`)
);

export default app;
