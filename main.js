const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let clockWindow = null;
let timerWindow = null;

function createClockWindow() {
    clockWindow = new BrowserWindow({
        width: 400,
        height: 500,
        minWidth: 300,
        minHeight: 400,
        resizable: true,
        alwaysOnTop: false,
        autoHideMenuBar: true,
        title: "Tim's Clock",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    clockWindow.loadFile('index.html');

    // Handle external links
    clockWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    clockWindow.on('closed', () => {
        clockWindow = null;
    });

    return clockWindow;
}

function createTimerWindow() {
    timerWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 500,
        resizable: true,
        fullscreenable: true,
        autoHideMenuBar: true,
        title: "Tim's Break Timer",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    timerWindow.loadFile('timer.html');

    // Handle external links
    timerWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    timerWindow.on('closed', () => {
        timerWindow = null;
    });

    return timerWindow;
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Clock Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        if (!clockWindow) createClockWindow();
                        else clockWindow.focus();
                    }
                },
                {
                    label: 'New Timer Window',
                    accelerator: 'CmdOrCtrl+T',
                    click: () => {
                        if (!timerWindow) createTimerWindow();
                        else timerWindow.focus();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Clock Always On Top',
                    type: 'checkbox',
                    checked: false,
                    click: (menuItem) => {
                        if (clockWindow) {
                            clockWindow.setAlwaysOnTop(menuItem.checked);
                        }
                    }
                },
                {
                    label: 'Timer Always On Top',
                    type: 'checkbox',
                    checked: false,
                    click: (menuItem) => {
                        if (timerWindow) {
                            timerWindow.setAlwaysOnTop(menuItem.checked);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Timer Fullscreen',
                    accelerator: 'F11',
                    click: () => {
                        if (timerWindow) {
                            timerWindow.setFullScreen(!timerWindow.isFullScreen());
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Minimize All',
                    accelerator: 'CmdOrCtrl+M',
                    click: () => {
                        if (clockWindow) clockWindow.minimize();
                        if (timerWindow) timerWindow.minimize();
                    }
                },
                {
                    label: 'Close All Windows',
                    accelerator: 'CmdOrCtrl+Shift+W',
                    click: () => {
                        if (clockWindow) clockWindow.close();
                        if (timerWindow) timerWindow.close();
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Visit TechTrainerTim.com',
                    click: () => {
                        shell.openExternal('https://techtrainertim.com');
                    }
                },
                {
                    label: 'About',
                    click: () => {
                        const aboutWindow = new BrowserWindow({
                            width: 400,
                            height: 300,
                            resizable: false,
                            minimizable: false,
                            maximizable: false,
                            autoHideMenuBar: true,
                            title: 'About',
                            parent: clockWindow || timerWindow,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: false,
                                contextIsolation: true
                            }
                        });
                        
                        aboutWindow.loadURL(`data:text/html,
                            <html>
                                <head>
                                    <style>
                                        body { 
                                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui; 
                                            text-align: center; 
                                            padding: 40px; 
                                            background: #f5f5f5; 
                                        }
                                        h1 { color: #2196f3; margin-bottom: 20px; }
                                        p { margin: 10px 0; }
                                    </style>
                                </head>
                                <body>
                                    <h1>Tim's Clock & Timer</h1>
                                    <p>Version 1.0.0</p>
                                    <p>Minimal clock and break timer for teaching and presentations</p>
                                    <br>
                                    <p><a href="https://techtrainertim.com" onclick="require('electron').shell.openExternal(this.href); return false;">TechTrainerTim.com</a></p>
                                </body>
                            </html>
                        `);
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createMenu();
    
    // Create both windows on startup
    createClockWindow();
    createTimerWindow();
    
    // Position windows side by side if possible
    if (clockWindow && timerWindow) {
        const clockBounds = clockWindow.getBounds();
        timerWindow.setPosition(clockBounds.x + clockBounds.width + 20, clockBounds.y);
    }
    
    app.on('activate', () => {
        // On macOS, re-create windows when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createClockWindow();
            createTimerWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // On macOS, keep app running even when all windows are closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle protocol for development
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('electron-fiddle');
}