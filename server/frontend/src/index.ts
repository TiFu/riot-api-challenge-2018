import { loadConfigFromEnvironment } from 'achievement-config';
import express from "express";
import socketio from "socket.io";
import * as http_pckg from 'http'
import path from "path"
import {AchievementServer} from 'achievement-sio'
import { WebAchievementSocketHandler, LocalAchievementSocketHandler } from './handlers';
import { AchievementService } from './services/achievement-service';
import { GroupService } from './services/group-service';
import { NotificationService } from './services/notification-service';
import { AchievementDatabase } from 'achievement-db';
import { AchievementRedis } from 'achievement-redis';
import {Kayn } from 'kayn';

const config = loadConfigFromEnvironment()
console.log(config)


const app = express();
app.set("port", config.frontend.port);

let http = new http_pckg.Server(app);
let io = socketio(http) as AchievementServer;

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./index.html'));
});

const riotApi = Kayn(config.riotApi.apiKey)()
const achievementdb = new AchievementDatabase(config.db);
const achievementRedis = new AchievementRedis(config.redis)
const subscribeRedis = new AchievementRedis(config.redis);

const notificationService = new NotificationService(io.of("/web"), io.of("/local"), achievementdb, riotApi);
const achievementService = new AchievementService(achievementRedis, subscribeRedis, notificationService);
const groupService = new GroupService();

io.of("/web").on("connection", (socket: any) => {
    console.log("new web connection")
    const handler = new WebAchievementSocketHandler(socket, achievementService, groupService, notificationService);
})

io.of("/local").on("connection", (socket: any) => {
    console.log("new local connection!")
    const handler = new LocalAchievementSocketHandler(socket, achievementService, groupService, notificationService);
})

const server = http.listen(config.frontend.port, function(){
  console.log('listening on *:3000');
});

