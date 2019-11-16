const path = require('path')
const config = require('dotenv').config

config({ 
	path: path.join(__dirname, '..', '..', '.env')
})