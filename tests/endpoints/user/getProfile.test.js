require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const { defaultUser, setupDatabase } = require('../../fixtures/database')

const defaultUserToken = defaultUser.tokens[0].token

beforeAll(setupDatabase)

describe('When get profile:', () => {
	test('Should get my profile successfully', async () => {
		const response = await request(app)
			.get('/users/me')
			.set('Authorization', `Bearer ${defaultUserToken}`)
			.expect(200)

		// assert the response data is right
		expect(response.body).toMatchObject({
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

	test('Should not get my profile if unauthenticated', async () => {
		await request(app)
			.get('/users/me')
			.expect(401)
	})
})