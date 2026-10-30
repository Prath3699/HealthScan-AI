# HealthScan AI - backend API (Express + MongoDB)
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies first for better layer caching.
# --include=optional pulls in nodemailer (appointment reminder emails);
# omitting it would skip optional deps and silently disable email sending.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --include=optional && npm cache clean --force

COPY . .

USER node
EXPOSE 5000

CMD ["node", "server.js"]
