//Environmental variables
require('dotenv').config()

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const db = require('./db_connection')
const ObjectId = require('mongodb').ObjectId;

var rooms = []
var clients = []

const validateRoom = async ({ id, password }) => {
	console.log('validate')
	const collection = db.collection('test')
	var room = await collection.findOne({_id: new ObjectId(id)})
	if (room === null) {
		return false
	}

	const [salt, key] = room.password.split(':')
	const hashedBuffer = scryptSync(password, salt, 64)

	const keyBuffer = Buffer.from(key, 'hex')
	const match = timingSafeEqual(hashedBuffer, keyBuffer);

	return match
}

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
		console.log('received')
		console.log(msg)

		try {
			console.log('Try')
			const json = JSON.parse(msg)
			console.log(json)
			if ('rooms' in json) {
				console.log('rooms')
				for (var i = 0; i < json.rooms.length; i++) {
					if (await validateRoom(json.rooms[i])) {
						const id = json.rooms[i].id
						try {
							rooms[id].clients.push(client)
						}
						catch {
							rooms[id].clients = [client]
						}
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

const connect = () => {

}

module.exports = handle_wss