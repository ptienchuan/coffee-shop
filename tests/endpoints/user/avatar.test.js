require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const User = require('../../../src/models/user')
const { defaultUser, userOne, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should upload avatar successfully', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.attach('file', 'tests/fixtures/img/robot-eve.jpg')
		.expect(200)

	// assert the image actually save to database
	const user = await User.findById(defaultUser._id)
	expect(user.avatar.mimeType).toBe('image/jpeg')
	expect(user.avatar.source).toEqual(expect.any(Buffer))
})

test('Should not upload avatar when unauthenticated', async () => {
	await request(app)
		.post('/users/me/avatar')
		.expect(401)
})

test('Should upload avater fail when the file too large', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.attach('file', 'tests/fixtures/img/picture_2.5Mb.jpg')
		.expect(400)
})

test('Should upload avater fail when the file extension invalid', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.attach('file', 'tests/fixtures/img/giphy.gif')
		.expect(400)

	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.attach('file', 'tests/fixtures/img/excel.xlsx')
		.expect(400)
})

test('Should serve the avatar', async () => {
	await request(app)
		.get('/users/me/avatar')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect('Content-Type', 'image/jpeg')
		.expect(200)
})

test('Should not serve the avatar when unauthenticated', async () => {
	await request(app)
		.get('/users/me/avatar')
		.expect(401)
})

test('Should not get the avatar of the user do not upload yet', async () => {
	await request(app)
		.get('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(404)
})