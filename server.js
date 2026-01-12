const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let waitingUser = null;

wss.on("connection", ws => {
    ws.partner = null;

    if (waitingUser) {
        ws.partner = waitingUser;
        waitingUser.partner = ws;

        ws.send(JSON.stringify({ type: "matched" }));
        waitingUser.send(JSON.stringify({ type: "matched" }));

        waitingUser = null;
    } else {
        waitingUser = ws;
        ws.send(JSON.stringify({ type: "waiting" }));
    }

    ws.on("message", msg => {
        if (ws.partner) {
            ws.partner.send(msg.toString());
        }
    });

    ws.on("close", () => {
        if (ws.partner) {
            ws.partner.send(JSON.stringify({ type: "disconnect" }));
            ws.partner.partner = null;
        }
        if (waitingUser === ws) waitingUser = null;
    });
});

server.listen(3000, () => {
    console.log("Oh Eagle running on http://localhost:3000");
});
