"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lcu_connector_1 = __importDefault(require("lcu-connector"));
var ws_1 = __importDefault(require("ws"));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var connector = new lcu_connector_1.default();
connector.on("connect", function (data) {
    if (!data) {
        return;
    }
    var ws = new ws_1.default("wss://riot:" + data.password + "@127.0.0.1:" + data.port + "/", "wamp");
    ws.on('error', function (err) {
        console.log(err);
    });
    ws.on('message', function (msg) {
        console.log(msg);
    });
    ws.on('open', function () {
        // 5 is probably subscribe https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15
        ws.send('[5, "OnJsonApiEvent_lol-summoner_v1_current-summoner"]');
    });
});
connector.start();
