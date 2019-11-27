const mongoose = require('mongoose')

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/coffee-shop"

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})