FROM node:alpine
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY ./src ./src
EXPOSE 5060
CMD ["npm", "start"]