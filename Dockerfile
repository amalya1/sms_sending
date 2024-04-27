FROM node:18-slim as init

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./

RUN apt-get update
RUN apt-get install bash
RUN apt-get -y install make

RUN npm ci

FROM init as builder

COPY ./config ./config
COPY ./data ./data
COPY ./src ./src

RUN npm run build

FROM builder as release

ENTRYPOINT ["npm", "run"]
CMD ["start"]
