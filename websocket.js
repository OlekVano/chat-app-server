//Environmental variables
require('dotenv').config()

const { validateRoom } = require('./utils')

var rooms = {}

const handle_wss = (wss) => {
  wss.on('connection', onClientConnection);
}

const onClientConnection = (client) => {
  console.log('A new client Connected!')

  client.on('message', async (msg) => await handleMessage(msg, client))
  //client.on('close', async (msg, code) => await handleClose(client))

  client.on('close', async (msg, code) => {await handleClose(client)})
}

const handleMessage = async (msg, client) => {
  try {
    const json = JSON.parse(msg)
    if (!'action' in json) {
      console.log('No action key');
      return
    }
    if (json.action === 'roomsJoin') {
      console.log('Join')
      const roomsToJoin = json.rooms.filter(async (room) => await validateRoom(room))
      roomsToJoin.forEach(room => {
        const id = room.id
        if (id in rooms) {
          rooms[id].clients.push(client)
        }
        else {
          rooms[id] = {clients: [client]}
        }
      })
    }
    else if (json.action === 'messageSend') {
      console.log('Message')
      if (!await validateRoom(json)) return
      rooms[json.id].clients.forEach(client => {
        console.log('send')
        client.send(JSON.stringify({
          from: json.from,
          message: json.message,
          id: json.id
        }))
      })
    }
    else {
      console.log(`Invalid action: ${json.action}`)
    }
  }
  catch (err) {
    console.log(`Error: ${err}`)
  }
}

const handleClose = async (client) => {
  for (var key in rooms) {
    console.log(key)
    if (rooms[key].clients.includes(client)) {
      console.log('IS')
      rooms[key].clients = rooms[key].clients.filter((i) => i !== client)
    }
  }
  console.log(rooms)
}

module.exports = handle_wss