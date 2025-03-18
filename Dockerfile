FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npx", "expo", "start" ]
EXPOSE 8081 19000 19001 19002