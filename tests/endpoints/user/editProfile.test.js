require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { defaultUser, setupDatabase } = require('../../fixtures/database')

const defaultUserToken = defaultUser.tokens[0].token
const defaultUserId = defaultUser._id

beforeAll(setupDatabase)

test('Should update profile successfully', async () => {
	await request(app)
		.put('/users/me')
		.set('Authorization', `Bearer ${defaultUserToken}`)
		.send({
			name: "Chuan PT",
			password: "654321"
		})
		.expect(200)

	// assert the data actually be updated
	const user = await User.findById(defaultUserId)
	expect(user.name).toBe('Chuan PT')
})

test('Should not update when unauthenticated', async () => {
	await request(app)
		.put('/users/me')
		.send({
			name: "Chuan PT",
			password: "654321"
		})
		.expect(401)
})

test('Should not update when trying to update private fields', async () => {
	await request(app)
		.put('/users/me')
		.set('Authorization', `Bearer ${defaultUserToken}`)
		.send({
			email: "chuanpt@localhost.com",
			closed: true
		})
		.expect(400)
})