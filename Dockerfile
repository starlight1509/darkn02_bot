FROM node:lts as base

WORKDIR /opt/app

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get autoremove

COPY --chown=node:node package.json .
COPY --chown=node:node pnpm-lock.yaml .

FROM base AS builder

ENV NODE_ENV="development"

COPY --chown=node:node .swcrc .
COPY --chown=node:node tsconfig.base.json .
COPY --chown=node:node src src

RUN corepack enable && \
    pnpm install && \
    pnpm swc-build

FROM base

COPY --from=builder --chown=node:node /opt/app/build build

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]
