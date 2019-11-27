require('./config/environment')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(async () => {
	await User.deleteMany()
})

describe("Regist a user", () => {
	test('Should regist a new user and response a token', async () => {
		// regist a user successfully
		const response = await request(app).post('/users').send({
			email: 'chuan@example.com',
			password: '123456',
			name: 'Chuan'
		}).expect(201)
		// send back a token
		expect(response.body.token.length).toBeGreaterThan(1)
	})

	test('Should regist a new user with lowercase and trim email', async () => {
		const email = '     CHUAN@EXAMPLE.com   '
		const response = await request(app).post('/users').send({
			email,
			password: '123456',
			name: 'Chuan'
		}).expect(201)
		expect(response.body.newUser.email).toBe(email.toLowerCase().trim())
	})
})
