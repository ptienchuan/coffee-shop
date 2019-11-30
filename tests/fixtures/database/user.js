const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../../src/models/user')

const _id = mongoose.Types.ObjectId()
const token = jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY)
const defaultUser = {
	_id,
	email: 'chuan@default.com',
	password: '123456',
	name: 'Chuan',
	tokens: [{
		token
	}]
}

const closedUser = {
	email: 'chuan.closed@default.com',
	password: '123456',
	name: 'Chuan Closed',
	closed: true
}

const userOneId = mongoose.Types.ObjectId()
const userOne = {
	_id: userOneId,
	email: 'chuan.one@default.com',
	password: '123456',
	name: 'Chuan One',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId, seq: 1 }, process.env.JWT_PRIVATE_KEY)
		},
		{
			token: jwt.sign({ _id: userOneId, seq: 2 }, process.env.JWT_PRIVATE_KEY)
		},
	]
}

const setupDatabase = async () => {
	await User.deleteMany()
	await new User(defaultUser).save()
	await new User(closedUser).save()
	await new User(userOne).save()
}

module.exports = {
	defaultUser,
	closedUser,
	userOne,
	setupDatabase
}