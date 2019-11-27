require('./config/environment')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const defaultUser = {
	email: 'chuan@default.com',
	password: '123456',
	name: 'Chuan'
}

const closedUser = {
	email: 'chuan.closed@default.com',
	password: '123456',
	name: 'Chuan Closed',
	closed: true
}

beforeEach(async () => {
	await User.deleteMany()
	await new User(defaultUser).save()
	await new User(closedUser).save()
})

describe("Regist a user:", () => {
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

describe("Login user:", () => {
	test('Should login successfully', async () => {
		const response = await request(app).post('/users/login').send({
			email: 'chuan@default.com',
			password: '123456'
		}).expect(200)
		expect(response.body.token.length).toBeGreaterThan(1)
	})

	test('Should login fail by invalid email or password', async () => {
		// the password wrong
		let res = await request(app).post('/users/login').send({
			email: 'chuan@default.com',
			password: '123456__'
		}).expect(400)
		expect(res.body.error).toBe('Email or password is invalid')

		// the email wrong
		res = await request(app).post('/users/login').send({
			email: 'chuan@default.com.vn',
			password: '123456'
		}).expect(400)
		expect(res.body.error).toBe('Email or password is invalid')

		// the email and password is empty
		res = await request(app).post('/users/login').send({
			email: '',
			password: ''
		}).expect(400)
		expect(res.body.error).toBe('Email or password is invalid')

		// the email and password is undefined
		res = await request(app).post('/users/login').expect(400)
		expect(res.body.error).toBe('Email or password is invalid')
	})

	test('Should login fail by the account has been closed', async () => {
		const res = await request(app).post('/users/login').send({
			email: 'chuan.closed@default.com',
			password: '123456'
		}).expect(400)
		expect(res.body.error).toBe('This account has been closed')
	})
})