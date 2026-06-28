const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

server.listen(3000, () => {
    console.log("Server 3000 portunda çalışıyor");
});

// Oyun nesneleri

const CANVAS_H = 500;
const PADDLE_H = 100;

let player1Y = 100;
let player2Y = 100;

let slots = {
    oyuncu1:null,
    oyuncu2:null,
    izleyici1:null,
    izleyici2:null
}

let ball = {
    x: 400,
    y: 250,
    vx: 3.5,
    vy: 3.5
};

let score1 = 0;
let score2 = 0;
let player1Name = "";
let player2Name = "";
let gameStart = false;

// Topun bastan baslamasi

function resetBall() {
    ball.x = 400;
    ball.y = 250;
    ball.vx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3.5 * (Math.random() > 0.5 ? 1 : -1);
}

// Oyun hareketleri

setInterval(() => {
    if (gameStart) {
    


    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 0 || ball.y >= 480) {
        ball.vy *= -1;
    }

    if (
        ball.x <= 40 &&
        ball.y >= player1Y &&
        ball.y <= player1Y + PADDLE_H
    ) {
        ball.x = 40;
        ball.vx *= -1;
    }

    if (
        ball.x >= 740 &&
        ball.y >= player2Y &&
        ball.y <= player2Y + PADDLE_H
    ) {
        ball.x = 740;
        ball.vx *= -1;
    }

    if (ball.x < 0) {
        score2++;
        resetBall();
    }

    if (ball.x > 800) {
        score1++;
        resetBall();
    }}

    // Verilerin cliente yollanmasi
    const state = JSON.stringify({
        type: "state",
        player1Y,
        player2Y,
        ball,
        score1,
        score2,
        player1Name,
        player2Name,
        gameStart
    });

    Object.values(slots).forEach(client => {
        if (client && client.readyState === WebSocket.OPEN) {
        client.send(state);
    }
    });

}, 16);

// Baglanti

wss.on("connection", (ws) => {

    let playerID = null;

if (!slots.oyuncu1) playerID = "oyuncu1";
else if (!slots.oyuncu2) playerID = "oyuncu2";
else if (!slots.izleyici1) playerID = "izleyici1";
else if (!slots.izleyici2) playerID = "izleyici2";
else {
    ws.close();
    return;
}

    slots[playerID] = ws;
    ws.playerID = playerID;

    console.log(playerID + " bağlandı");

    ws.on("message", (msg) => {

        const data = JSON.parse(msg);
        if (data.type === "join") {
            

   
     if (ws.playerID === "oyuncu1") player1Name = data.name;
    if (ws.playerID === "oyuncu2") player2Name = data.name;

    if (player1Name && player2Name) {
        gameStart = true;
        console.log("Oyun başladı");
    }

    return;
}

        if (ws.playerID === "oyuncu1") {
            player1Y += data.direction * 15;
            player1Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, player1Y));
        }

        if (ws.playerID === "oyuncu2") {
            player2Y += data.direction * 15;
            player2Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, player2Y));
        }
    });

    ws.on("close", () => {
         if (slots[ws.playerID] === ws) {
        slots[ws.playerID] = null;
    }

    console.log(ws.playerID + " ayrıldı");
    });
});