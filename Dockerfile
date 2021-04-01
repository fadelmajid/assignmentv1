FROM node:12

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package*.json .

RUN npm install

COPY . /app/src

EXPOSE 8585

CMD ["npm", "start"]