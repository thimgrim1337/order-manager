FROM node:alpine
WORKDIR /usr/nodeapp

COPY ./dist ./
COPY ./package.json ./

RUN npm install

CMD ["node","server.js"]