require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { defaultUser, userOne, setupDatabase } = require('../../fixtures/database')

const defaultUserToken = defaultUser.tokens[0].token
const defaultUserId = defaultUser._id

beforeAll(setupDatabase)

test('Should logout successfully', async () => {
	await request(app)
		.post('/users/logout')
		.set('Authorization', `Bearer ${defaultUserToken}`)
		.expect(200)

	// assert the token has been removed in database
	const user = await User.findById(defaultUserId)
	expect(user.tokens).toHaveLength(0)
})

test('Should not logout when unauthenticated', async () => {
	await request(app)
		.post('/users/logout')
		.expect(401)
})

test('Should logout on all devices successfully', async () => {
	await request(app)
		.post('/users/logoutAll')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200)

	// assert all of tokens has been removed in database
	const user = await User.findById(userOne._id)
	expect(user.tokens).toHaveLength(0)
})

test('Should not logout on all devices when unauthenticated', async () => {
	await request(app)
		.post('/users/logoutAll')
		.expect(401)
})