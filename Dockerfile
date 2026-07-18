FROM --platform=$BUILDPLATFORM node:24-alpine AS build

WORKDIR /app

COPY BirthdayPage/package.json BirthdayPage/pnpm-lock.yaml BirthdayPage/pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY BirthdayPage/ ./
RUN pnpm build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:1337/ || exit 1
