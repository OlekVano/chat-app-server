//Environmental variables
require('dotenv').config()

//Express
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json());

//Options needed so the browser doesn't get mad and refuse to send the request
const corsOptions = {
  //origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Server for both websocket and API
const server = require('http').createServer(app);
const port = process.env.PORT

//Websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server:server });

const handle_wss =  require('./websocket')
handle_wss(wss)

//API
const roomsRouter = require('./routes/rooms')
app.use('/rooms', roomsRouter)

//For testing
app.get('/test', cors(corsOptions), (req, res) => {
  console.log('Hello')
  res.status(200).send('Hello World!')
})

server.listen(port, () => console.log(`Lisening on port ${port}`))