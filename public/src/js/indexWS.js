let history = [];
let curVal = [];
let dragging = false;
let lastX;
let marginLeft = 0;
let counter = 0;

const ws = new WebSocket('ws:127.0.0.1:3000/ws');

ws.onopen = () => {
    ws.send('Client connected');
}

ws.onmessage = event => {
    if (event.data.length > 35) {
        history = JSON.parse(event.data);
        console.log(history);
    } else {
        curVal.push(JSON.parse(event.data));
        console.log(event.data);
    }
}

ws.onclose = () => {
    console.log('closed');
}


setInterval(drawCanvas, 1000);
setInterval(drawSVG, 1000);

function drawCanvas() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    context.beginPath();
    context.strokeStyle = 'red';
    for (let i = 0, j = 0; j < curVal.length - 1; i += 30, j++) {
        context.lineTo(i, (+curVal[j].value) * 2.5);
    }
    context.stroke();
}

function drawSVG() {
    const polyLine = document.getElementById('line');
    let pointsNew = polyLine.getAttribute('points');
    console.log(pointsNew);
    polyLine.setAttribute('points', pointsNew += `${counter},${(curVal[curVal.length-1].value)*2.5} `);
    counter++;
}

myCanvas.addEventListener('mousedown', function (e) {
    let evt = e || event;
    dragging = true;
    lastX = evt.clientX;
    e.preventDefault();
}, false);

window.addEventListener('mousemove', function (e) {
    let evt = e || event;
    if (dragging) {
        let delta = evt.clientX - lastX;
        lastX = evt.clientX;
        marginLeft += delta;
        myCanvas.style.marginLeft = marginLeft + "px";
    }
    e.preventDefault();
}, false);

window.addEventListener('mouseup', function () {
    dragging = false;
}, false);
