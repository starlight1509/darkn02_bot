FROM node:lts AS base

WORKDIR /app/darkbot

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node ../package.json ./ \
    --chown=node:node ../pnpm-lock.yaml ./ \
    --chown=node:node ../tsconfig* ./ \
    --chown=node:node ../.swcrc ./

FROM base AS dev

ENV NODE_ENV="development"

USER node

CMD [ "pnpm", "swc-watch:dev" ]

FROM base AS builder

COPY --chown=node:node ../ ./

RUN pnpm swc-build

FROM builder AS runner

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]
