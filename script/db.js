const pg = require('pg')
const client = new pg.Client(process.env.DB_NAME)
require('dotenv').config()

module.exports = {
    client
}