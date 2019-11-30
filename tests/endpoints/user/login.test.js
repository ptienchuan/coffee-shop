require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { defaultUser, closedUser, setupDatabase } = require('../../fixtures/database')

const defaultUserId = defaultUser._id

beforeAll(setupDatabase)

test('Should login successfully', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: 'chuan@default.com',
			password: '123456'
		})
		.expect(200)

	// assert the response contain a token
	expect(response.body.token.length).toBeGreaterThan(1)

	// assert the response token exist in database
	const user = await User.findById(defaultUserId)
	expect(user.tokens[1].token).toBe(response.body.token)

	// assert the response user data same as database
	expect(user).toMatchObject({
		email: 'chuan@default.com',
		name: 'Chuan',
	})

	// assert all of private fields have hidden
	expect(response.body.password).toBeUndefined()
	expect(response.body.avatar).toBeUndefined()
	expect(response.body.tokens).toBeUndefined()
	expect(response.body.closed).toBeUndefined()
	expect(response.body.closedDate).toBeUndefined()
})

test('Should login fail by invalid email or password', async () => {
	// assert login fail when password is wrong
	let res = await request(app)
		.post('/users/login')
		.send({
			email: 'chuan@default.com',
			password: '123456__'
		})
		.expect(400)
	expect(res.body.error).toBe('Email or password is invalid')

	// assert login fail when email wrong
	res = await request(app)
		.post('/users/login')
		.send({
			email: 'chuan@default.com.vn',
			password: '123456'
		})
		.expect(400)
	expect(res.body.error).toBe('Email or password is invalid')

	// assert login fail when email and password is empty
	res = await request(app)
		.post('/users/login')
		.send({
			email: '',
			password: ''
		})
		.expect(400)
	expect(res.body.error).toBe('Email or password is invalid')

	// assert login fail when email and password is undefined
	res = await request(app)
		.post('/users/login')
		.expect(400)
	expect(res.body.error).toBe('Email or password is invalid')
})

test('Should login fail by the account has been closed', async () => {
	const res = await request(app)
		.post('/users/login')
		.send({
			email: closedUser.email,
			password: closedUser.password
		})
		.expect(400)
	expect(res.body.error).toBe('This account has been closed')
})
