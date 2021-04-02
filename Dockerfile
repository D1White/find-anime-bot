FROM node:14-alpine as bot_build
WORKDIR /app
COPY /package*.json /app/
RUN npm install
COPY . /app
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY --from=bot_build /app/build /app
COPY /package.json /app/package.json
COPY /.env /app/.env
RUN npm install --only=prod

CMD ["node", "bot.js"]