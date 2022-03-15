FROM node:14

WORKDIR /MedicalTests-server1

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "app.js"]
