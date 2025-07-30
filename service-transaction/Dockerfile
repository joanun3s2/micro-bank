FROM node:22.9

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

CMD ["npm", "run", "start:dev"]