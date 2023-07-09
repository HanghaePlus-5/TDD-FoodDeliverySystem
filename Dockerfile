# # TODO: NEED TO UPDATE AVAILABLE DATABASE URL

# # Base Stage
# FROM node:18-alpine AS base

# RUN npm install -g pnpm

# # Dependencies Stage
# FROM base AS dependencies

# WORKDIR /home/app
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install

# # Build Stage
# FROM base AS build

# WORKDIR /home/app
# COPY . .
# COPY --from=dependencies /home/app/node_modules ./node_modules

# RUN npx prisma generate
# RUN pnpm build

# # Deploy Stage
# FROM base AS deploy

# WORKDIR /home/app
# COPY --from=build /home/app/dist ./dist
# COPY --from=build /home/app/node_modules ./node_modules
# # COPY --from=build /home/app/.env ./.env
# # COPY --from=build /home/app/.env.test ./.env.test

# CMD ["node", "dist/main.js"]

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

ARG API_VERSION
ARG DATABASE_URL
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG MIN_COOKING_TIME
ARG MAX_COOKING_TIME
ARG BUSINESS_NUMBER_CHECK_API_KEY

ENV API_VERSION=$API_VERSION
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV MIN_COOKING_TIME=$MIN_COOKING_TIME
ENV MAX_COOKING_TIME=$MAX_COOKING_TIME
ENV BUSINESS_NUMBER_CHECK_API_KEY=$BUSINESS_NUMBER_CHECK_API_KEY

WORKDIR /home/app
COPY --from=build /home/app/dist ./dist
COPY --from=build /home/app/node_modules ./node_modules
# COPY --from=build /home/app/.env ./.env
# COPY --from=build /home/app/.env.test ./.env.test

CMD ["node", "dist/src/main.js"]