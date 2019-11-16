const mongoose = require('mongoose')

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/coffee-shop"
console.log('Connecting database ...');

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}, (err) => {
	if (err) {
		return console.log("Can't connect to database!", err)
	}
	console.log('Database is connected');
})