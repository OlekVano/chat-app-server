//Environmental variables
require('dotenv').config()

const { validateRoom } = require('./utils')

var rooms = {}

const handle_wss = (wss) => {
  wss.on('connection', (client) => {
		handleClientConnection(client)
  });
}

const handleClientConnection = (client) => {
	console.log('A new client Connected!')

	client.on('message', async (msg) => await handleMessage(msg, client))
	client.on('close', async () => await handleClose(client))
}

const handleMessage = async (msg, client) => {
	try {
		const json = JSON.parse(msg)
		if ('rooms' in json) {
			console.log('Join')
			for (var i = 0; i < json.rooms.length; i++) {
				if (await validateRoom(json.rooms[i])) {
					console.log('Valid rooms')
					const id = json.rooms[i].id
					try {
						rooms[id].clients.push(client)
					}
					catch {
						rooms[id] = {}
						rooms[id].clients = [client]
					}
				}
			}
		}
		if ('message' in json) {
			console.log('Message')
			if (await validateRoom(json)) {
				for (var i = 0; i < rooms[json.id].clients.length; i++) {
					console.log('send')
					rooms[json.id].clients[i].send(JSON.stringify({
						from: json.from,
						message: json.message,
						id: json.id
					}))
				}
			}
		}
	}
	catch (err) {
		console.log(`Error: ${err}`)
	}
}

const handleClose = async (client) => {
	console.log('Close')
	for (var key in rooms) {
		//console.log(key)
		//console.log(client)
		//console.log(rooms[key].clients)
		if (client in rooms[key].clients) {
			//console.log('IN')
			rooms[key].clients = rooms[key].clients.filter((i) => i !== client)
		}
	}
}

module.exports = handle_wss