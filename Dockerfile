FROM node:alpine
WORKDIR /usr/nodeapp

COPY ./server/dist ./
COPY ./server/package.json ./

RUN npm install

CMD ["node","server.js"]