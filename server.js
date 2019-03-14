const express = require('express');
const enableWs = require('express-ws');
const fs = require('fs');
const app = express();
const expressWs = enableWs(app);
const cors = require('cors');
const clients = [];
let arr = [];

app.use(cors());
app.options('*', cors());


const sendAllClientsCurrentValue = () => {
    clients.forEach(client => client.send(JSON.stringify(arr[arr.length-1])));
}

const sendAllClientsCHistory = () => {
    clients.forEach(client => client.send(JSON.stringify(arr)));
}

fs.stat('data.csv', function(err, stat) {
    if(err == null) {
        let data = fs.readFileSync("data.csv", "utf-8");
        arr = data.split("/\r/\n").map(function (str) {
            let sa = str.split(";");
            return {time : sa[0], value: sa[1]};
        });
    } else if(err.code === 'ENOENT') {
        
        fs.writeFileSync("data.csv", "");
        
    } else {
        console.log('Some other error: ', err.code);
    }
});

setInterval(generateElement,1000);

function currentTime(){
    let date = new Date();
    return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}

function getRandomInt(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateElement(){
    arr.push({time: currentTime(), value: getRandomInt()});
    if (arr.length > 1000){
        arr.shift();
    }
    let data = arr.map(function (el) {
        return el.time + ";" + el.value;
    }).join("/\r/\n");
    fs.writeFileSync("data.csv", data);
}


app.get('/api/current', (req, res) => {
    res.send(JSON.stringify(arr[arr.length-1]));
});
app.get('/api/history', (req, res) => {
    res.send(JSON.stringify(arr));
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('listening port...');
});

expressWs.getWss().on('connection', ws => {
    clients.push(ws);
    sendAllClientsCHistory();
    setInterval(sendAllClientsCurrentValue,1000);
});

app.ws('/ws',ws => {
    ws.on('message', msg => {
        console.log(msg);
    });
    ws.on('connection', () => {
        console.log('connection');
    });
    ws.on('close', () => {
        const index = clients.indexOf(ws);

        if(index > -1) {
            clients.splice(index, -1);
        }
        console.log(`removed ws index = ${index}`);
    });
});
