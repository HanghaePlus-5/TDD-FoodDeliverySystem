# TODO: NEED TO UPDATE AVAILABLE DATABASE URL

# Base Stage
FROM node:18-alpine AS base

RUN npm install -g pnpm

# Dependencies Stage
FROM base AS dependencies

WORKDIR /home/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Build Stage
FROM base AS build

WORKDIR /home/app
COPY . .
COPY --from=dependencies /home/app/node_modules ./node_modules

RUN npx prisma generate
RUN pnpm build

# Deploy Stage
FROM base AS deploy

WORKDIR /home/app
COPY --from=build /home/app/dist ./dist
COPY --from=build /home/app/node_modules ./node_modules
# COPY --from=build /home/app/.env ./.env
# COPY --from=build /home/app/.env.test ./.env.test

CMD ["node", "dist/main.js"]