require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should regist a new user successfully', async () => {
	const email = '     CHUAN@EXAMPLE.com   '
	const response = await request(app)
		.post('/users')
		.send({
			email,
			password: '123456',
			name: 'Chuan'
		})
		.expect(201)

	// assert the response contain a token
	expect(response.body.token.length).toBeGreaterThan(1)
	// assert all of private fields have hidden
	expect(response.body.password).toBeUndefined()
	expect(response.body.avatar).toBeUndefined()
	expect(response.body.tokens).toBeUndefined()
	expect(response.body.closed).toBeUndefined()
	expect(response.body.closedDate).toBeUndefined()

	// assert the data exist in database
	const user = await User.findById(response.body.newUser._id)
	expect(user).toMatchObject({
		email: 'chuan@example.com',
		name: 'Chuan',
		closed: false
	})
	// assert the password isn't plain text
	expect(user.password).not.toBe('Chuan')
	// assert the response token is same as database
	expect(user.tokens[0].token).toBe(response.body.token)
})

test('Should regist fail by duplication email', async () => {
	await request(app)
		.post('/users')
		.send({
			email: 'chuan@default.com',
			password: '123456',
			name: 'Chuan'
		})
		.expect(400)
})

test('Should regist fail by email or password is empty', async () => {
	await request(app)
		.post('/users')
		.send({
			email: '',
			password: '123456',
			name: 'Chuan'
		})
		.expect(400)

	await request(app)
		.post('/users')
		.send({
			email: 'binh@default.com',
			password: '',
			name: 'Binh'
		})
		.expect(400)
})