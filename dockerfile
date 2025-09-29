FROM node:current-alpine3.21

COPY . .

RUN npm ci
RUN npm run build
