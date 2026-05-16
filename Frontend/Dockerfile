FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run lint

RUN npm run test

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]