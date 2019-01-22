FROM mhart/alpine-node
USER root

WORKDIR /home/root/app/server/processing-server/src
COPY ./common /home/root/app/common
COPY ./server/achievement-config /home/root/app/server/achievement-config
COPY ./server/achievement-db /home/root/app/server/achievement-db
COPY ./server/achievement-redis /home/root/app/server/achievement-redis

COPY ./server/processing-server /home/root/app/server/processing-server

RUN ls -al /home/root/app/server/processing-server
RUN ls -al /home/root/app/server/processing-server/src
RUN npm install
RUN npm run build
ENTRYPOINT ["node", "dist/"]
