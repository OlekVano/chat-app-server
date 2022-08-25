const MongoClient = require('mongodb').MongoClient

var db

const connection = async () => {
	const client = new MongoClient(process.env.DATABASE_URL)
  db = client.db('test')
  await db.command({ ping: 1})
  console.log("Connected successfully to the database");
}

connection()

module.exports = db