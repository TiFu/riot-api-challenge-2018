FROM alpine-node

WORKDIR /app
ADD ./src /app

RUN npm install && npm run compile
ENTRYPOINT ["node", "dist/"]
