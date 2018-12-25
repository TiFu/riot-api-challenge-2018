import LCUConnector from 'lcu-connector';

import WebSocket from 'ws';
import {AchievementEventBus} from '../events';
import { PluginLolSummonerApi,PluginLolPlatformConfigApi, HttpBasicAuth } from 'lcu-api';
import {LocalPlayer} from '../models'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

interface LCUConnectionData {
    address: string
    port: number
    username: string
    password: string
    protocol: string
}

export class LCUService {
    private connector: LCUConnector;
    private lcuData: LCUConnectionData | null = null
    private ws: WebSocket | null = null
    private subscribeEvents = [
        "OnJsonApiEvent_lol-summoner_v1_current-summoner"
    ]
    private LOGIN_NS: string = "LoginDataPacket"
    private currentSummonerApi: PluginLolSummonerApi;
    private platformConfigApi: PluginLolPlatformConfigApi
    
    public constructor(private eventBus: AchievementEventBus) {
        this.connector = new LCUConnector()    
        this.currentSummonerApi = new PluginLolSummonerApi()
        this.platformConfigApi = new PluginLolPlatformConfigApi()
        this.connector.on("connect", (data) => {
            this.lcuData = data
            this.configureApis()
            this.connectToWS()
            this.eventBus.lcu_connected()
        })
        this.connector.on("disconnect", () => {
            this.eventBus.lcu_disconnected()
            this.lcuData = null
            if (this.ws)
                this.ws.close();
        })
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
    public fetchCurrentSummoner(): Promise<LocalPlayer> {
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

    private connectToWS() {
        if (this.lcuData) {
            console.log("Connecting to websocket at "+ `wss://riot:${this.lcuData.password}@127.0.0.1:${this.lcuData.port}/`)
            this.ws = new WebSocket(`wss://riot:${this.lcuData.password}@127.0.0.1:${this.lcuData.port}/`, "wamp");
        
            this.ws.on('error', (err) => {
                console.log("WS", err);
            });
            
            this.ws.on('message', (msg) => {
                // TODO emit message based on end point
                if (msg["eventType"] == "Update" && msg["uri"] == "/lol-summoner/v1/current-summoner" && msg["data"]["accountId"]) {
                    this.eventBus.user_login()
                }
            });
            
            this.ws.on('open', () => {
                if (!this.ws) {
                    return;
                }
                // 5 is probably subscribe https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15
                for (const event of this.subscribeEvents) {
                    console.log("Subscribing for event " + event);
                    this.ws.send('[5, \"' + event + '\"]');
                }
            });

        } else {
            throw new Error("You may only call connectToWS if lcuData is set!");
        }
    }

}