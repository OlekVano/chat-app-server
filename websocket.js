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

	handleMessage(client)
}

const handleMessage = (client) => {
	client.on('message', async (msg) => {
		try {
			const json = JSON.parse(msg)
			if ('rooms' in json) {
				console.log('Join')
				for (var i = 0; i < json.rooms.length; i++) {
					if (await validateRoom(json.rooms[i])) {
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
		
		/*if (message.split(' ')[0] === 'Access')
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		});*/
	});
}

module.exports = handle_wss