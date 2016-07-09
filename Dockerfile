FROM node:0.10-slim

COPY . .

RUN npm install

ENTRYPOINT ["npm", "test"]
