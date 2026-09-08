FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

ENV NODE_ENV production

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]