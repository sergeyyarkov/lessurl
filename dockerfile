ARG NODE_IMAGE=node:22.4.1-alpine

FROM ${NODE_IMAGE} AS build

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build && npm run build:css

FROM ${NODE_IMAGE} AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json .
RUN npm ci --production

EXPOSE 3000
CMD [ "node", "./dist/index.js"]

