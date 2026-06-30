# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci \
      --prefer-offline \
      --no-audit \
      --fetch-retries=5 \
      --fetch-retry-mintimeout=20000 \
      --fetch-retry-maxtimeout=120000 \
      --fetch-timeout=600000
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:1.27-alpine
EXPOSE 80
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/GestimoWebFront/browser/ /usr/share/nginx/html/

