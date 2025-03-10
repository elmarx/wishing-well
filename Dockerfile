# layer with all devDependencies
FROM node:20.17.0-alpine AS devDependencies
WORKDIR /usr/src/wishing-well

COPY package.json package-lock.json ./

RUN npm ci

# layer with prod-dependencies only
FROM node:20.17.0-alpine AS dependencies
WORKDIR /usr/src/wishing-well

COPY package.json package-lock.json ./
COPY --from=devDependencies /usr/src/wishing-well/node_modules node_modules
RUN npm prune --omit=dev

# builder image where we compile, i.e. create the dist artifact
FROM node:20.17.0-alpine AS builder
WORKDIR /usr/src/wishing-well
ENV PATH=$PATH:./node_modules/.bin

COPY --from=devDependencies /usr/src/wishing-well/node_modules node_modules
COPY . .
RUN tsc -p tsconfig.dist.json

# final image
FROM node:20.17.0-alpine
ARG GIT_REVISION

ENV NODE_ENV=production
USER node
WORKDIR /usr/local/wishing-well

COPY --from=dependencies /usr/src/wishing-well/node_modules node_modules
COPY --from=builder /usr/src/wishing-well/dist dist

ENV GIT_REVISION=$GIT_REVISION
CMD node -r source-map-support/register dist/index.js
