import LCUConnector from 'lcu-connector';
import WebSocket from 'ws';
import { app, BrowserWindow, Menu, Tray} from 'electron'

let window: BrowserWindow;
// otherwise the tray disappears after init app...
let tray = null;

function initApp() {
    window = new BrowserWindow({ width: 800, height: 600 })
    window.loadFile("index.html");

    window.on("close", (event) => {
        event.preventDefault()
        window.hide()
    })

    tray = new Tray("./images/icon.png")  
    tray.prependListener("click", showWindow);

}

function showWindow() {
    window.show();
}

app.on("ready", initApp);


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connector = new LCUConnector();
connector.on("connect", (data) => {
    if (!data) {
        return;
    }
    let ws = new WebSocket(`wss://riot:${data.password}@127.0.0.1:${data.port}/`, "wamp");
      
    ws.on('error', (err) => {
    console.log(err);
    });
    
    ws.on('message', (msg) => {
    console.log(msg);
    });
    
    ws.on('open', () => {
    // 5 is probably subscribe https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15
    ws.send('[5, "OnJsonApiEvent_lol-summoner_v1_current-summoner"]');
    });
})
// TODO: detect summoner login (either )
connector.start();