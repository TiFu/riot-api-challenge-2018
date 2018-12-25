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
import { AchievementDB } from '../../achievement-db/index';

const config = loadConfigFromEnvironment()
console.log(config)


const app = express();
app.set("port", config.frontend.port);

let http = new http_pckg.Server(app);
let io = socketio(http) as AchievementServer;

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./index.html'));
});

const achievementdb = new AchievementDB(config.db);

const achievementService = new AchievementService();
const groupService = new GroupService();
const notificationService = new NotificationService(io.of("/web"), io.of("/local"), config.frontend.platform, achievementdb);

io.of("/web").on("connection", (socket) => {
    console.log("new web connection")
    const handler = new WebAchievementSocketHandler(socket, achievementService, groupService, notificationService);
})

io.of("/local").on("connection", (socket) => {
    console.log("new local connection!")
    const handler = new LocalAchievementSocketHandler(socket, achievementService, groupService, notificationService);
})

const server = http.listen(config.frontend.port, function(){
  console.log('listening on *:3000');
});

