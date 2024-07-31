FROM node:20-alpine AS build
RUN apk update

WORKDIR /app
RUN yarn global add turbo

COPY . .
RUN turbo prune \
    --scope=@repo/typescript-config \
    --scope=artifact-storage-backend \
    --scope=@repo/common \
    --docker

FROM node:20-alpine AS installer
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=build /app/out/json/ .
COPY --from=build /app/out/yarn.lock ./yarn.lock
RUN yarn install


COPY --from=build /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build \
    --filter=@repo/typescript-config \
    --filter=@repo/common \
    --filter=artifact-storage-backend...

FROM node:20 AS runner
WORKDIR /app

COPY --from=installer /app/apps/backend/out .
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/node_modules ./node_modules

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 3001
CMD ["node", "index.js"]