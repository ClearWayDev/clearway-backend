# Stage 1: Build and compile TypeScript
FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --only=dev

COPY . .

RUN npm run build

# Stage 2: Run the compiled JavaScript files
FROM node:alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

EXPOSE 6699

CMD ["npm", "run", "start"]
