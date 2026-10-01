FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Prisma 7 config requires DATABASE_URL during generate.
# This is only a build-time value; the real value is provided by Docker Compose.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/client_dashboard"

RUN DATABASE_URL=postgresql://postgres:postgres@localhost:5432/client_dashboard \
	npx prisma generate --config prisma7.config.ts

RUN npm run build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Reuse dependencies generated in builder.
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma7.config.ts ./
COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]