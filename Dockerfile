ARG NODE_VERSION=16-alpine

FROM node:${NODE_VERSION} as base

RUN corepack enable && corepack prepare pnpm@7.5.1 --activate
WORKDIR /app

FROM base as builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY packages/ant-database/package.json /app/packages/ant-database/package.json
COPY packages/ant-auth/package.json /app/packages/ant-auth/package.json
COPY packages/antify-admin/src/package.json /app/packages/antify-admin/src/package.json

RUN --mount=type=cache,id=pnpm-store,target=/app/.pnpm-store\
  pnpm install  --frozen-lockfile --shamefully-hoist
COPY packages/ant-database/ /app/packages/ant-database
COPY packages/ant-auth/ /app/packages/ant-auth
COPY packages/antify-admin/src /app/packages/antify-admin/src

WORKDIR /app/packages/ant-database

RUN pnpm dev:prepare

WORKDIR /app/packages/ant-auth

RUN pnpm dev:prepare

WORKDIR /app/packages/antify-admin/src

RUN pnpm core:generate
RUN pnpm tenant:generate

RUN pnpm build

FROM builder as prod

COPY pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY packages/antify-admin/src/package.json /app/packages/antify-admin/src/package.json

RUN --mount=type=cache,id=pnpm-store,target=/app/.pnpm-store\
  pnpm install --frozen-lockfile --prod && ls -a /app/.pnpm-store

COPY --from=builder app/packages/antify-admin/src/.nuxt/ /app/packages/antify-admin/src/.nuxt/
WORKDIR /app/packages/antify-admin/src

EXPOSE 3000

CMD [ "pnpm", "docker:start" ]