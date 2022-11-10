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
        this.baseR = 0;
        this.baseX2 = 0;
        this.baseY2 = 0;
        this.size = Math.random() * 2 + 3;
        this.color = genRandomColor();
        this.density = Math.random() * 5 + 5;
        this.movingPath = 0;
        this.dx = 0;
        this.dy = 0;
        this.runBack = false;
        // this.runBack2 = false;
        this.friction = 0.99 - this.size / 200;
        this.vx = 0;
        this.vy = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.pointB = {
            x: 0,
            y: 0,
        };
        this.baseTangent = 0;
        this.c1 = {
            x: 0,
            y: 0,
            tangent: 0,
        };
        this.c2 = {
            x: 0,
            y: 0,
            tangent: 0,
        };
        this.pathRun = 0;
        this.dtangent = Math.PI / 360;
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
            this.pathRun = Math.floor(Math.random() * 2 + 1);
            this.runBack = false;
            let deltaX = mousePos.x - this.x;
            let deltaY = mousePos.y - this.y;
            let directionX;
            let directionY;
            let totalDistance = (10 / this.size) * mousePos.radius;
            let P1x = (totalDistance * -deltaX) / mouseDistance + mousePos.x;
            this.movingPath = Math.abs(P1x - this.x);
            let times = Math.random() * 0.5 + 2;
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
            if (this.runBack === false) {
                this.dx = 0;
                this.dy = 0;
                this.runBack = true;
            }
            if (this.runBack === true) {
                if (mouseDistance >= mousePos.radius) {
                    // let deltaBaseX = this.baseX - this.x;
                    // let deltaBaseY = this.baseY - this.y;
                    // let vx = deltaBaseX / 1000;
                    // let vy = deltaBaseY / 1000;
                    // this.vx += vx * this.size * Math.sin(45) * 2;
                    // this.vy += vy * this.size * Math.cos(45) * 3;
                    // this.vx *= this.friction;
                    // this.vy *= this.friction;
                    // this.dx = this.vx;
                    // this.dy = this.vy;
                    //lay diem doi xung
                    this.pointB.x = 2 * this.baseX - this.x;
                    this.pointB.y = 2 * this.baseY - this.y;
                    this.baseR = Math.sqrt(
                        (this.x - this.baseX) * (this.x - this.baseX) + (this.y - this.baseY) * (this.y - this.baseY),
                    );
                    this.baseTangent = Math.atan2(this.y - this.baseY, this.x - this.baseX);

                    // this.c2.x = 1.5 * this.baseR * Math.cos(this.baseTangent + Math.PI / 2) + this.baseX;
                    // this.c2.y = 1.5 * this.baseR * Math.sin(this.baseTangent + Math.PI / 2) + this.baseY;

                    this.c1.x = 1.5 * this.baseR * Math.cos(this.baseTangent + Math.PI / 2) + this.baseX;
                    this.c1.y = 1.5 * this.baseR * Math.sin(this.baseTangent + Math.PI / 2) + this.baseY;
                    this.c2.x = 2 * this.baseX - this.c1.x;
                    this.c2.y = 2 * this.baseY - this.c1.y;
                    this.c1.tangent = Math.atan2(this.y - this.c1.y, this.x - this.c1.x);
                    this.c1.r = Math.sqrt(
                        (this.x - this.c1.x) * (this.x - this.c1.x) + (this.y - this.c1.y) * (this.y - this.c1.y),
                    );
                    this.c2.r = this.c1.r;
                    // ctx.arc(this.c1.x, this.c1.y, 5, 0, Math.PI * 2);
                    // ctx.fill();
                    this.c2.tangent = Math.atan2(this.y - this.c2.y, this.x - this.c2.x);

                    // if (distanceToB >= 1) {
                    if (this.pathRun == 1) {
                        this.prevX = this.x;
                        this.prevY = this.y;
                        this.c1.tangent -= this.dtangent;
                        let X = this.c1.x + Math.cos(this.c1.tangent) * this.c1.r;
                        let Y = this.c1.y + Math.sin(this.c1.tangent) * this.c1.r;
                        let deltaX = (X - this.prevX) / (this.size * 10); // / 50 / (this.size / 2);
                        let deltaY = (Y - this.prevY) / (this.size * 10); // / 50 / (this.size / 2);
                        this.vx += deltaX;
                        this.vy += deltaY;
                        this.vx *= this.friction;
                        this.vy *= this.friction;
                        this.dx = this.vx;
                        this.dy = this.vy;
                    }

                    //c2(right) road
                    if (this.pathRun == 2) {
                        this.prevX = this.x;
                        this.prevY = this.y;
                        this.c2.tangent += this.dtangent;
                        let X = this.c2.x + Math.cos(this.c2.tangent) * this.c2.r;
                        let Y = this.c2.y + Math.sin(this.c2.tangent) * this.c2.r;
                        let deltaX = (X - this.prevX) / (this.size * 10); // / 50 / (this.size / 2);
                        let deltaY = (Y - this.prevY) / (this.size * 10); /// 50 / (this.size / 2);
                        this.vx += deltaX;
                        this.vy += deltaY;
                        this.vx *= this.friction;
                        this.vy *= this.friction;
                        this.dx = this.vx;
                        this.dy = this.vy;
                    }
                    // }
                }
            }
        }

        this.x += this.dx;
        this.y += this.dy;
        if (this.movingPath !== 0 && this.movingPath <= Math.abs(this.dx)) {
            this.movingPath = 0;
        } else if (this.movingPath > Math.abs(this.dx)) {
            this.movingPath -= Math.abs(this.dx);
        }
        let movingPath = this.movingPath;
        console.log({ movingPath });
        this.draw();
    }
}

const init = (datax) => {
    for (y = 0; y < canvas.height; y++) {
        for (x = 0; x < canvas.width; x++) {
            let opIndex = 3 + x * 4 + y * 4 * canvas.width;
            let r = datax[opIndex - 3];
            let g = datax[opIndex - 2];
            let b = datax[opIndex - 1];
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

////////////////////////////////////////////////////////////
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
