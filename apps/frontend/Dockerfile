FROM node:20-alpine AS build
RUN apk update

WORKDIR /app
RUN yarn global add turbo

#COPY package*.json ./
COPY . .
RUN turbo prune --scope=@repo/typescript-config --scope=artifact-storage-frontend --scope=@repo/common --docker

FROM node:20-alpine AS installer
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=build /app/out/json/ .
COPY --from=build /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=build /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@repo/typescript-config --filter=@repo/common --filter=artifact-storage-frontend...


FROM node:20 AS runner
WORKDIR /app

# Don't run production as root
#RUN addgroup --system --gid 1001 reactjs
#RUN adduser --system --uid 1001 reactjs
#USER reactjs

RUN yarn global add serve

COPY --from=installer /app/apps/frontend/build .
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
