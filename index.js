const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;
let canvasBoundary = canvas.getBoundingClientRect();
colors = ['#FFB85F', '#FF7A5A', '#00743f', '#C0334D'];
//data
let parcsArr = [];
let numPacs = 20;
let mousePos = { x: 0, y: 0, radius: 5 };

const getMousePos = (e) => {
    let x = e.clientX - canvasBoundary.x;
    let y = e.clientY - canvasBoundary.y;
    // let x = e.x;
    // let y = e.y;
    return { x, y, radius: 70 };
};
window.addEventListener('mousemove', (e) => {
    mousePos = getMousePos(e);
});

const genRandomColor = () => {
    let index = Math.floor(Math.random() * 4);
    return colors[index];
};

class Particles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.baseX2 = 0;
        this.baseY2 = 0;
        this.size = Math.random() * 2 + 3;
        this.color = genRandomColor();
        this.density = Math.random() * 5 + 5;
        this.movingPath = 0;
        this.dx = 0;
        this.dy = 0;
        this.runBack = false;
        this.runBack2 = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    upDate() {
        let mouseDistance = Math.sqrt(
            (mousePos.x - this.x) * (mousePos.x - this.x) + (mousePos.y - this.y) * (mousePos.y - this.y),
        );

        if (mouseDistance <= mousePos.radius) {
            this.runBack = false;
            this.runback2 = false;
            let deltaX = mousePos.x - this.x;
            let deltaY = mousePos.y - this.y;
            let directionX;
            let directionY;

            let totalDistance = (10 / this.size) * mousePos.radius;
            let P1x = (totalDistance * -deltaX) / mouseDistance + mousePos.x;
            // this.baseX2 = this.baseX - (P1x - this.baseX) / 3;
            // this.baseY2 = this.baseY + (this.baseX2 - this.baseX) * (deltaY / deltaX);
            this.movingPath = Math.abs(P1x - this.x);
            let times = Math.random() * 0.5 + 1;
            let vx = this.movingPath / (times * 60);
            if (deltaX > 0) {
                directionX = vx;
            } else {
                directionX = -vx;
            }
            directionY = (deltaY / deltaX) * directionX;
            this.dx = -directionX;
            this.dy = -directionY;
        }

        if (this.movingPath <= 0) {
            this.movingPath = 0;
            let xToBase = this.baseX - this.x;
            let yToBase = this.baseY - this.y;
            let xToBase2 = this.baseX2 - this.x;
            let yToBase2 = this.baseY2 - this.y;
            if (this.runBack2 === false && this.runBack === false) {
                // console.log('set');
                this.dx = 0;
                this.dy = 0;
                //cal this.baseX2, this.baseX1
                let vectorX = this.baseX - this.x;
                let vectorY = this.baseY - this.y;
                this.baseX2 = this.x + (vectorX * 8) / 7;
                this.baseY2 = this.y + (vectorY * 8) / 7;
                this.runBack2 = true;
            }

            if (this.runBack2 === true && this.runBack === false) {
                if (mouseDistance >= mousePos.radius && (Math.abs(xToBase2) >= 0.5 || Math.abs(yToBase2) >= 0.5)) {
                    let vx = xToBase2 / 60;
                    let vy = yToBase2 / 60;
                    this.dx = vx * 2;
                    this.dy = vy * 2;
                }
            }

            if (
                Math.abs(xToBase2) < 0.5 &&
                Math.abs(yToBase2) < 0.5 &&
                this.runBack2 === true &&
                this.runBack === false
            ) {
                this.dx = 0;
                this.dy = 0;
                this.runBack2 = false;
                this.runBack = true;
            }

            if (this.runBack2 === false && this.runBack === true) {
                if (mouseDistance >= mousePos.radius && (Math.abs(xToBase) >= 0.5 || Math.abs(yToBase) >= 0.5)) {
                    let deltaBaseX = this.baseX - this.x;
                    let deltaBaseY = this.baseY - this.y;
                    let vx = deltaBaseX / 60;
                    let vy = deltaBaseY / 60;
                    this.dx = vx * 3;
                    this.dy = vy * 3;
                }
                // if (mouseDistance >= mousePos.radius && (Math.abs(xToBase) < 0.5 || Math.abs(yToBase) < 0.5)) {
                //     this.x = this.baseX;
                //     this.y = this.baseY;
                //     this.dx = 0;
                //     this.dy = 0;
                // }
            }
        }

        this.x += this.dx;
        this.y += this.dy;
        if (this.movingPath !== 0 && this.movingPath <= Math.abs(this.dx)) {
            this.movingPath = 0;
        } else if (this.movingPath > Math.abs(this.dx)) {
            this.movingPath -= Math.abs(this.dx);
        }
        this.draw();
    }
}

const init = (datax) => {
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x < canvas.width; x++) {
            let opIndex = 3 + x * 4 + y * 4 * canvas.width;
            let r = datax[opIndex - 3];
            let g = datax[opIndex - 2];
            b = datax[opIndex - 1];
            let index2 = (opIndex - 3) / 4;
            if ((r !== 0 || g !== 0 || b !== 0) && index2 % 100 == 1) {
                parcsArr.push(new Particles(x, y));
            }
        }
    }
};

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    parcsArr.forEach((element) => {
        element.upDate();
    });
    requestAnimationFrame(drawGame);
};
ctx.fillStyle = 'green';
ctx.font = '250px serif';
ctx.fillText('Pokemon', 100, 300);
ctx.fill();
requestAnimationFrame(drawGame);
let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
let data = img.data;
init(data);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;
});

// let checkedParcs = [];
// let remainingParcs = [];
// ctx.arc(mousePos.x, mousePos.y, mousePos.radius, 0, Math.PI * 2);
// ctx.stroke();
// parcsArr.forEach((element) => {
//     // element.draw();
//     // element.draw();
//     element.upDate();
// });
// parcsArr.forEach((parc) => {
//     checkedParcs.push(parc);
//     remainingParcs = parcsArr.filter((ele) => !checkedParcs.includes(ele));
//     remainingParcs.forEach((remainParc) => {
//         //cal distance/
//         let distance = Math.sqrt(
//             (parc.x - remainParc.x) * (parc.x - remainParc.x) + (parc.y - remainParc.y) * (parc.y - remainParc.y),
//         );
//         if (distance < 50) {
//             ctx.strokeStyle = 'red';
//             ctx.beginPath();
//             ctx.moveTo(parc.x, parc.y);
//             ctx.lineTo(remainParc.x, remainParc.y);
//             ctx.stroke();
//             ctx.closePath();
//         }
//         //connect
//     });
// });
