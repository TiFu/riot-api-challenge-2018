import { app, BrowserWindow, Menu, Tray} from 'electron'

let window: BrowserWindow;
// otherwise the tray disappears after init app...
let tray = null;

// TODO: add option to quit
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