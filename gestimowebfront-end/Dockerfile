FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
EXPOSE 80
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/GestimoWebFront/browser/ /usr/share/nginx/html/

