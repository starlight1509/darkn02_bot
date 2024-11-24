FROM node:lts as base

WORKDIR /opt/app

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . /opt/app/
RUN corepack enable

FROM base AS builder

RUN pnpm swc-build

FROM base

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]
