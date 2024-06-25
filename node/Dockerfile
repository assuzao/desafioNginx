# Use a imagem oficial do Node.js
FROM node:14-alpine

# Crie um diretório de trabalho para o aplicativo
WORKDIR /usr/src/app

# Instale as dependências do aplicativo
COPY package*.json ./
RUN npm install

# Copie o código fonte do aplicativo
COPY . .

# Exponha a porta 3000 para o ambiente externo
EXPOSE 3000

# Comando padrão para executar o aplicativo
CMD ["node", "app.js"]

