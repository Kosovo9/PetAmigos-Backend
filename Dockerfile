FROM node:18-alpine

WORKDIR /app

# Copiar package.json primero (cache amigable)
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalar dependencias
RUN cd server && npm install
RUN cd client && npm install

# Copiar código fuente
COPY server/ ./server/
COPY client/ ./client/
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts ./

# Build del frontend
RUN cd client && npm run build

# Variables de entorno por defecto (sobreescribir en run)
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Iniciar servidor
CMD ["node", "server/_core/index.js"] 
# Nota: Ajustar el CMD según cómo se compile tu backend typescript
