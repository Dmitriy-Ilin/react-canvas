const express = require('express');
const app = express();
const Wsserver = require('express-ws')(app);
const aWss = Wsserver.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
    console.log('Подключение установлено');
    ws.send(JSON.stringify({message: 'Успешное подключение'}));
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection': 
                connectionHandler(ws, msg);
                break;
            case 'draw':
                broadcastConnection(ws, msg);
                break;
        }
    })
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg));
        }
    })
}

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '');
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'Загружено'})
    } catch (error) {
        console.log(error);
        return res.status(500).json('error');
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64');
        res.json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json('error');
    }
})

app.listen(PORT, () => {
    console.log('server started on port ' + PORT);
})
