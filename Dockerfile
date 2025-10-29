# Gunakan image Node.js resmi (LTS)
FROM node:20-alpine AS builder

# Buat direktori kerja di container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependensi (termasuk devDependencies untuk build TS)
RUN npm ci

# Salin seluruh source code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build

# ------------------------
# Tahap kedua: image ringan untuk produksi
# ------------------------
FROM node:20-alpine

WORKDIR /app

# Salin hanya hasil build + dependensi production
COPY package*.json ./
RUN npm ci --omit=dev

# Salin hasil build dari tahap builder
COPY --from=builder /app/dist ./dist

# Jalankan app
EXPOSE 3000
CMD ["node", "dist/index.js"]
