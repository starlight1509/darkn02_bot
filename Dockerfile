FROM node:lts-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/app

RUN apt-get update && \
    apt-get upgrade -y && \
    corepack enable

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm fetch

FROM base AS builder

COPY src/ src/
COPY tsconfig.base.json .

RUN pnpm build

FROM base

COPY --from=base /usr/app/node_modules node_modules
COPY --from=builder /usr/app/build build

CMD [ "pnpm", "start" ]
