FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build          # Next.js build

FROM node:20 AS runner
WORKDIR /app

# dependencias y artefactos
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig.seed.json ./tsconfig.seed.json
# (opcional) COPY --from=builder /app/tsconfig.json ./tsconfig.json

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
