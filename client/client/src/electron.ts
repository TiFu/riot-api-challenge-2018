import { app, BrowserWindow, Menu, Tray} from 'electron'

let window: BrowserWindow;
// otherwise the tray disappears after init app...
let tray = null;

// TODO: add option to quit
function initApp() {
    window = new BrowserWindow({ icon: __dirname + "/../assets/logo.png", show: false, minHeight: 1040, minWidth: 1920, maxHeight: 1080, maxWidth: 1936 })
    window.once('ready-to-show', () => {
        window.maximize();
        window.show()
    })
    window.loadFile("index.html");

    window.on("close", (event) => {
        event.preventDefault()
        window.hide()
    })

    tray = new Tray(__dirname + "/../assets/logo.png")  
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', click: exitElectron },
      ])

    tray.prependListener("click", showWindow);
    tray.setContextMenu(contextMenu)
}
function exitElectron() {
    app.exit()
}

function showWindow() {
    window.show();
}

app.on("ready", initApp);