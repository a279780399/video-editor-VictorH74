FROM node:20
WORKDIR /video-editor

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000