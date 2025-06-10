FROM node:alpine AS development

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm","run","dev" ]

FROM node:apline AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm i --omit=dev

COPY --from=build /app/dist ./dist

COPY . .

CMD [ "npm","run","prod" ]
