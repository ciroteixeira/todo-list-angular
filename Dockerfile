# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Fazer build da aplicação (modo produção)
RUN npm run build

# Estágio 2: Servir a aplicação usando Nginx (Leve e rápido)
FROM nginx:alpine

# Copiar configuração Nginx customizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos compilados do estágio de build
COPY --from=builder /app/dist/todo-list/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]