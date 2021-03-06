import LCUConnector from 'lcu-connector';

import WebSocket from 'ws';
import { PluginLolSummonerApi,PluginLolPlatformConfigApi, PluginLolGameApi, HttpBasicAuth } from 'lcu-api';
import { PlayerInfo } from '../store/player/types';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

interface LCUConnectionData {
    address: string
    port: number
    username: string
    password: string
    protocol: string
}

export interface LCUListener {
    onConnectionStateChanged(connected: boolean): void;
    onUserLogin(): void;
    onGameEnd(gameId: number): void;
    onChampAndSkinChanged(champId: number, skinId: number): void;
}

export class LCUService {
    private connector: LCUConnector;
    private lcuData: LCUConnectionData | null = null
    private ws: WebSocket | null = null
    private subscribeEvents = [
        "OnJsonApiEvent_lol-summoner_v1_current-summoner",
        "OnJsonApiEvent_lol-gameflow_v1_session",
        "OnJsonApiEvent_lol-champ-select_v1_session",
//        "OnJsonApiEvent"
    ]
    private LOGIN_NS: string = "LoginDataPacket"
    private currentSummonerApi: PluginLolSummonerApi;
    private platformConfigApi: PluginLolPlatformConfigApi
    private lolGameApi: PluginLolGameApi

    private listener: LCUListener | null = null;

    public constructor() {
        this.connector = new LCUConnector()    
        this.currentSummonerApi = new PluginLolSummonerApi()
        this.platformConfigApi = new PluginLolPlatformConfigApi()
        this.connector.on("connect", (data) => {
            this.lcuData = data

            this.configureApis()
            this.connectToWS().then(() => {
                if (this.listener) 
                    this.listener.onConnectionStateChanged(true)
            }).catch((err) => {
                console.log(err);
            })
        })
        this.connector.on("disconnect", () => {
            if (this.listener) 
                this.listener.onConnectionStateChanged(false)
            this.lcuData = null
            if (this.ws)
                this.ws.close();
        })
    }

    public setListener(listener: LCUListener) {
        this.listener = listener;
    }

    public start() {
        this.connector.start()
    }

    public stop() {
        this.connector.stop()
    }

    /**
     * 404 - if not logged in console.log(err["response"]["statusCode"])
     * error - if necessary data was not returned by LCU
     */
    public fetchCurrentSummoner(): Promise<PlayerInfo> {
        return this.currentSummonerApi.getLolSummonerV1CurrentSummoner().then((response) => {
            if (!response.body.accountId || !response.body.displayName) {
                throw Error("Unknown accountId or displayName: "+ JSON.stringify(response.body));
            }
            const displayName = response.body.displayName
            const accountId = response.body.accountId
            return this.platformConfigApi.getLolPlatformConfigV1NamespacesByNs(this.LOGIN_NS).then((response) => {
                return  {
                    playerName: displayName,
                    accountId: accountId,
                    platformId: response.body["platformId"].toLowerCase()
                }
            })
        })
    }

    private configureApis(){ 
        const auth = new HttpBasicAuth();
        auth.username = this.lcuData.username
        auth.password = this.lcuData.password

        const path = "https://127.0.0.1:" + this.lcuData.port + ""
        this.currentSummonerApi.setDefaultAuthentication(auth)
        this.currentSummonerApi.basePath = path;

        this.platformConfigApi.setDefaultAuthentication(auth)
        this.platformConfigApi.basePath = path
    }

    private connectToWS(): Promise<void> {
        if (this.lcuData) {
            return new Promise((resolve, reject) => {

                console.log("Connecting to websocket at "+ `wss://riot:${this.lcuData.password}@127.0.0.1:${this.lcuData.port}/`)
                this.ws = new WebSocket(`wss://riot:${this.lcuData.password}@127.0.0.1:${this.lcuData.port}/`, "wamp");
            
                this.ws.on('error', (err) => {
                    console.log("err", err);
                    if (err["code"] ==  "ECONNREFUSED") {
                        console.log("WS1", err);
                        this.connectToWS().then(() => resolve()).catch((err) => reject(err));
                    } else {
                        console.log("WS2", err);
                        reject(err);
                    }
                });
                
                this.ws.on('message', (msg) => {
                    // TODO emit message based on end point
                    msg = JSON.parse(msg.toString())[2]
//                    console.log(JSON.stringify(msg))

                    if (this.listener) {
                        if (msg["eventType"] == "Update" && msg["uri"] == "/lol-summoner/v1/current-summoner" && msg["data"]["accountId"]) {
                            console.log("user logged in");
                            this.listener.onUserLogin()
                        } else if (msg["uri"] == "/lol-gameflow/v1/session" && msg["data"]["phase"] == "EndOfGame") {
                            this.listener.onGameEnd(msg["data"]["gameData"]["gameId"])
                        } else if (msg["uri"] == "/lol-champ-select/v1/session" && msg["eventType"] == "Update") {
                            // find champ and skin id
                            const localCellId = msg["data"]["localPlayerCellId"]
                            const cell = msg["data"]["myTeam"].filter(c => c["cellId"] == localCellId)[0]
                            console.log("Changed champ/skin: ", cell["championId"], cell["selectedSkinId"])
                            this.listener.onChampAndSkinChanged(cell["championId"], cell["selectedSkinId"]);
                        }
                    }
                });
                
                this.ws.on('open', () => {
                    console.log("WS open");
                    if (!this.ws) {
                        return;
                    }
                    // 5 is probably subscribe https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15
                    for (const event of this.subscribeEvents) {
                        console.log("Subscribing for event " + event);
                        this.ws.send('[5, \"' + event + '\"]');
                    }
                    console.log("resolving!")
                    resolve();
                });
            })            
        } else {
            return Promise.reject(new Error("You may only call connectToWS if lcuData is set!"));
        }
    }

}