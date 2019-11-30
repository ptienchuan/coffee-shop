require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { defaultUser, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should close the account successfully', async () => {
	await request(app)
		.post('/users/close')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(200)

	// assert the account actually is closed in database
	const user = await User.findById(defaultUser._id)
	expect(user.closed).toBe(true)
	expect(new Date(user.closedDate).setMilliseconds(0)).toBe(new Date().setMilliseconds(0))
})

test('Should not close when unauthenticated', async () => {
	await request(app)
		.post('/users/close')
		.expect(401)
})