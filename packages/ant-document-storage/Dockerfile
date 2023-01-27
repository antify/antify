# FROM node:17-alpine

# RUN corepack enable && corepack prepare pnpm@7.5.1 --activate

# RUN mkdir -p /app
# RUN mkdir -p /app-code

# WORKDIR /app-code
# COPY . .

# RUN pnpm install --prod
# RUN pnpm build

# COPY .output /app/

# RUN rm -rf /app-code

# WORKDIR /app

# EXPOSE 3000 

# ENTRYPOINT ["node", "server/index.mjs"]

FROM node:17-alpine

RUN corepack enable && corepack prepare pnpm@7.5.1 --activate

RUN mkdir -p /app

WORKDIR /app
COPY . .

RUN pnpm install --prod
RUN pnpm build

EXPOSE 3000 

ENTRYPOINT ["node", ".output/server/index.mjs"]