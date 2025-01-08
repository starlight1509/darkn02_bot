FROM node:lts-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/app

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoremove && \
    corepack enable

COPY package.json .
COPY pnpm-lock.yaml .

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY src/ src/
COPY tsconfig.base.json .
COPY .swcrc .

RUN pnpm build

FROM base

COPY --from=builder /usr/app/node_modules node_modules
COPY --from=builder /usr/app/build build

CMD [ "pnpm", "start" ]
