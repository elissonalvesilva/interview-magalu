FROM node:12-alpine

WORKDIR /usr/src/app

ADD . .

ENV NODE_ENV=production

RUN npm run test:ci

USER node

EXPOSE 4513

CMD [ "node", "dist/main/server.js" ]
