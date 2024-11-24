FROM node:lts AS base

WORKDIR /app/darkbot

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* \
    corepack enable

COPY --chown=node:node * /app/darkbot

FROM base AS dev

ENV NODE_ENV="development"

CMD [ "pnpm", "swc-watch:dev" ]

FROM base AS builder

RUN pnpm swc-build

FROM builder AS runner

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]
