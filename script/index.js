const { client } = require('./db')
const express = require('express')
const app = express()
require('dotenv').config()

const init = async () => {
    await client.connect()
    console.log('connected');
    const port = process.env.PORT
    app.listen(port, console.log(`listening on port ${port}`))
}

init()