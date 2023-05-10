FROM node:18 as build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18

COPY package*.json /.
RUN npm install

COPY --from=build ./ ./

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "npm", "start" ]