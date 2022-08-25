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
  client.send('Welcome New Client!')

	handleMessage(client)
}

const handleMessage = (client) => {
	client.on('message', async (msg) => {
		try {
			const json = JSON.parse(msg)
			console.log(json)
			if ('rooms' in json) {
				var res = []
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
				if (await validateRoom(json.message.room)) {
					for (var i = 0; i < rooms[json.room._id].clients.length; i++) {
						rooms[json.room._id].clients[i].send()
					}
				}
			}
		}
		catch (err) {
			console.log(`Error: ${err}`)
		}

		console.log(rooms)
		
		/*if (message.split(' ')[0] === 'Access')
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		});*/
	});
}

const connect = () => {

}

module.exports = handle_wss