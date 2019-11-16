require('./config')
const express = require('express')
const dishRouter = require('./routers/dish')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/users', userRouter)
app.use('/dishes', dishRouter)
app.use('/categories', categoryRouter)

app.all('*', (req, res) => {
	res.status(404).send()
})

app.listen(port, () => {
	console.log('Server is started on port ' + port)
})