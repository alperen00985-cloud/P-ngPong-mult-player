;
const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(3000);

;

 const CANVAS_H = 500;
 const PADDLE_H = 100;
let player1Y = 100;
let player2Y = 100;
let players = {}
let playerCount = 0
let ball = {
    x: 400,
    y: 250,
    vx: 3.5,
    vy: 3.5
};
let score1 = 0
let score2 = 0

wss.on("connection", (ws) => {
     playerCount++ ;
     let playerID;
     if(playerCount===1) playerID = "oyuncu1"    
     if(playerCount===2) playerID = "oyuncu2" 
     
     players[playerID] = ws;

     console.log(playerID + " baglandi");

    ws.on("message", (msg) => {
        console.log("Gelen:", msg.toString());

        const data = JSON.parse(msg);

        if (playerID === "oyuncu1") {
            player1Y += data.direction * 15;

            player1Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, player1Y));
        }
        if (playerID === "oyuncu2"){
            player2Y += data.direction * 15 ;
            player2Y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, player2Y)) 
        }
       });
       function resetBall() {
    ball.x = 400;
    ball.y = 250;
    ball.vx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3.5 * (Math.random() > 0.5 ? 1 : -1);
}

    const interval = setInterval(() => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 20 || ball.y >= 480) ball.vy *= -1;

    if (ball.x <= 40 && ball.y >= player1Y && ball.y <= player1Y + PADDLE_H)
        ball.vx *= -1;

    if (ball.x >= 740 && ball.y >= player2Y && ball.y <= player2Y + PADDLE_H)
        ball.vx *= -1;

    if (ball.x < 0) {
        score2++;
        resetBall();
    }

    if (ball.x > 800) {
        score1++;
        resetBall();
    }

    Object.values(players).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "state",
                player1Y,
                player2Y,
                ball,
                score1,
                score2
            }));
        }
    });

}, 16);


    


    ws.on("close", () => {
        clearInterval(interval);
    });
});

console.log("WebSocket server 3000 portunda çalışıyor");