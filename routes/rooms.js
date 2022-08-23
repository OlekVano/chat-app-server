const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');
const express = require('express')
const router = express.Router()
const db = require('../db_connection')

router.post('/', async (req, res) => {
  try {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(req.body.password, salt, 64).toString('hex');
    req.body.password = `${salt}:${hashedPassword}`
    console.log(req.body)

    const collection = db.collection('test')
    collection.insertOne(req.body, (err, res) => {
      if (err) throw err
      console.log('Inserted')
    })
    console.log(req.body)
    res.status(200).json(req.body)
  }
  catch (err) {
    res.status(500).json({message: err})
  }
})

module.exports = router