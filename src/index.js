require('./config/environment')

const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log('Server is started on port ' + port)
})