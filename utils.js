const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const db = require('./db_connection')
const ObjectId = require('mongodb').ObjectId;

const validateRoom = async ({ id, password }) => {
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

module.exports = {
    validateRoom
}