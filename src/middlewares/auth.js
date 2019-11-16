const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_PRIVATE_KEY } = require('../constants')

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '')
		const payload = jwt.verify(token, JWT_PRIVATE_KEY)
		const user = await User.findOne({ _id: payload._id })

		if (user.closed) {
			return res.status(403).send({ error: "This account have been closed" })
		}

		const tokens = user.tokens.map(({ token }) => token.toString())
		if (!tokens.includes(token)) {
			throw new Error()
		}

		req.user = user
		req.token = token

		next()
	} catch (e) {
		res.status(401).send()
	}
}

module.exports = auth