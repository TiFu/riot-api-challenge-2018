FROM mhart/alpine-node
USER root

WORKDIR /home/root/app/server/frontend/src
COPY ./common /home/root/app/common
COPY ./server/achievement-config /home/root/app/server/achievement-config
COPY ./server/achievement-db /home/root/app/server/achievement-db
COPY ./server/achievement-redis /home/root/app/server/achievement-redis

COPY ./server/frontend /home/root/app/server/frontend

RUN ls -al /home/root/app/server/frontend/src
RUN npm install
RUN npm run build

RUN npm install 
RUN npm run build
ENTRYPOINT ["node", "dist/"]
