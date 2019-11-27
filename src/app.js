const express = require('express')
const dishRouter = require('./routers/dish')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')

const app = express()

app.use(express.json())

app.use('/users', userRouter)
app.use('/dishes', dishRouter)
app.use('/categories', categoryRouter)

app.all('*', (req, res) => {
	res.status(404).send("API is running!")
})

module.exports = app