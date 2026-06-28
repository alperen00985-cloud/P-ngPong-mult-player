const socket = new WebSocket("wss://uncut-uneatable-curvy.ngrok-free.dev");

socket.onopen = () => {
    console.log("Bağlantı kuruldu");

   
};
;


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// oyundaki nesnelerin konumlari ve hizlari
let x1 = 0;
let y1 = 100;
let x2 = canvas.width - 20;
let y2 = 300;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 0.7;
let ballSpeedY = 0.7;
let score1 = 0;
let score2 = 0;
let player1Name = "";
let player2Name = "";
let playerName = "";
let gameStart = false;

//Isim alma
document.getElementById("joinButon").onclick = () =>{
    playerName = document.getElementById("nameInput").value.trim();
    if (playerName === ""){
        alert("Isim giriniz!");
        return;
    }
    socket.send(JSON.stringify({
        type: "join",
        name: playerName
    }));
    document.getElementById("menu").style.display = "none";
}



// oyun alanindaki nesnelerin cizimleri
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);
 
ctx.fillStyle = "#fd1c03";
    ctx.fillRect(x1, y1, 20,100 );
ctx.fillStyle = "#FD1C03";
    ctx.fillRect(x2, y2, 20, 100);

    

    ctx.fillStyle = "#FF6600" ;
    ctx.font = "30px Arial" ;
    ctx.textAlign = "center" ;
    ctx.fillText(`${score1} | ${score2}`, canvas.width / 2 , 43)

    ctx.fillStyle = "#00aeff"
    ctx.font = "20px Arial"
    ctx.textAlign = "right"
    ctx.fillText(player1Name,canvas.width / 2 - 60 , 38)
    ctx.textAlign = "left"
    ctx.fillText(player2Name,canvas.width / 2 + 60 , 38)

    if (ballX && ballY) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#f507b9";
    ctx.fill();
    ctx.closePath();

}
if (!gameStart) {
    ctx.fillStyle = "#ffee00";
    ctx.font = "45px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "Oyuncular bekleniyor...",
        canvas.width / 2,
        canvas.height / 2 - 50
    );
}
    
}
// klavye tuslariyla paddle hareketi

    document.addEventListener("keydown", (e) => {

    let direction = null;

    if (e.key === "ArrowUp") direction = -1;
    if (e.key === "ArrowDown") direction = 1;

    if (direction !== null) {
        socket.send(JSON.stringify({
            type: "paddle",
            direction: direction
        }));
    }
});
    draw();
;
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);


    console.log("STATE:", data);

    if (data.type === "state") {
    y1 = data.player1Y;
    y2 = data.player2Y;
    ballX = data.ball.x;
    ballY = data.ball.y;
    score1 = data.score1;
    score2 = data.score2;
    player1Name = data.player1Name ?? "";
    player2Name = data.player2Name ?? "";
    gameStart = data.gameStart ?? false;
    
    }
};

function update() {
    draw();
    requestAnimationFrame(update);
}

update();

    



