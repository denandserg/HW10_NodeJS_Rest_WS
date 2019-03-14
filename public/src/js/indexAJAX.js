let history = [];
let curVal = [];
let dragging = false;
let lastX;
let marginLeft = 0;
let counter = 0;

window.onload = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/history", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                history = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send();

    xhr.open("GET", "http://localhost:3000/api/current", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                curVal.push(JSON.parse(xhr.responseText));
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send();
    setInterval(getCurrentValues,1000);
    setInterval(drawCanvas, 1000);
    setInterval(drawSVG, 1000);

};

function getCurrentValues() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/current", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                curVal.push(JSON.parse(xhr.responseText));
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send();
}

function drawCanvas() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    context.beginPath();
    context.strokeStyle = 'red';
    for (let i = 0, j = 0; j < curVal.length - 1; i += 20, j++) {
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
