#docker build -t mgt-student .
#edit MONGO_URL in .env or write file docker-compose.yml contain mongodb service and mgt-student
FROM node:18.12.1-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/src/main.js"]