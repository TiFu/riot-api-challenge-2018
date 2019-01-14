import { app, BrowserWindow, Menu, Tray} from 'electron'

let window: BrowserWindow;
// otherwise the tray disappears after init app...
let tray = null;

// TODO: add option to quit
function initApp() {
    window = new BrowserWindow({ icon: "./assets/logo.jpg", show: false })
    window.once('ready-to-show', () => {
        window.maximize();
        window.show()
    })
    window.loadFile("index.html");

    window.on("close", (event) => {
        event.preventDefault()
        window.hide()
    })

    tray = new Tray("./images/icon.png")  
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', click: exitElectron },
      ])

    tray.prependListener("click", showWindow);
    tray.setContextMenu(contextMenu)
}
function exitElectron() {
    console.log("Exitting electron!");
    app.exit()
}

function showWindow() {
    window.show();
}

app.on("ready", initApp);