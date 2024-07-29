FROM node:20-alpine AS build
RUN apk update

WORKDIR /app
COPY . .
COPY .gitignore .gitignore
RUN yarn install
RUN yarn vite:build



FROM node:20 AS runner
WORKDIR /app

# Don't run production as root
#RUN addgroup --system --gid 1001 reactjs
#RUN adduser --system --uid 1001 reactjs
#USER reactjs

RUN yarn global add serve

COPY --from=build /app/build .
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
