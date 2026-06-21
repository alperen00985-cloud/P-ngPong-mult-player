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
let score1 = 0
let score2 = 0



// oyun alanindaki nesnelerin cizimleri
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);
 
ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 20,100 );
ctx.fillStyle = "red";
    ctx.fillRect(x2, y2, 20, 100);

    ctx.fillStyle = "orange" ;
    ctx.font = "30px Arial" ;
    ctx.textAlign = "center" ;
    ctx.fillText(`${score1} | ${score2}`, canvas.width / 2 , 43)
    

    ctx.beginPath();
    ctx.arc(ballX, ballY , 20, 0, Math.PI * 2);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.closePath();
    
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
    
    }
};

function update() {
    draw();
    requestAnimationFrame(update);
}

update();

    



