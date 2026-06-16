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



// oyun alanindaki nesnelerin cizimleri
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);
 
ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 20,100 );
ctx.fillStyle = "red";
    ctx.fillRect(x2, y2, 20, 100);

    ctx.beginPath();
    ctx.arc(ballX, ballY , 20, 0, Math.PI * 2);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.closePath();
    
}
// klavye tuslariyla paddle hareketi
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        y1 -= 20; 
    }

    if (e.key === "ArrowDown") {
        y1 += 20;
    }
    if (e.key === "w") {
        y2 -= 20;
    }

    if (e.key === "s") {
        y2 += 20;
    }
    if(y1>canvas.height - 100){
        y1 = canvas.height - 100;
    }
    if(y1<0){
        y1 = 0;
    }
    if(y2<0){
        y2 = 0;
    }
    if(y2>canvas.height - 100){
        y2 = canvas.height - 100;
    }

    
    

    draw();
});



function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // ust alt duvar carpmasi
    if (ballY - 20 < 0 || ballY + 20 > canvas.height) {
        ballSpeedY *= -1;
    }

    // sol paddle carpmasi
    if (
        ballX - 20 < x1 + 20 &&
        ballY > y1 &&
        ballY < y1 + 100
    ) {
        ballSpeedX *= -1;
      
    }

    // sag paddle carpmasi
    if (
        ballX + 20 > x2 &&
        ballY > y2 &&
        ballY < y2 + 100
    ) {
        ballSpeedX *= -1;
    }
    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = Math.random() < 0.5 ? 0.7 : -0.7;
        ballSpeedY = Math.random() < 0.5 ? 0.7 : -0.7;
       
    }
    if (ballX - 20 < 0 || ballX + 20 > canvas.width) {
        resetBall();
    }

    
    draw();
    requestAnimationFrame(update);
}
    

update();

draw();
