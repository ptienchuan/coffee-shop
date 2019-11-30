require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const { defaultUser, userOne, defaultDish, defaultCategory, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should fetch a dish successfully', async () => {
	const defautId = defaultDish._id.toString()
	const res = await request(app)
		.get(`/dishes/${defautId}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(200)
	// assert the response data is right
	expect(res.body._id).toBe(defautId)

	// assert the private fields have been hidden
	expect(res.body.owner).toBeUndefined()
	expect(res.body.image).toBeUndefined()
	expect(res.body.lowerName).toBeUndefined()

	// assert acquisition category data
	expect(res.body.category).toMatchObject({
		_id: defaultCategory._id.toString(),
		name: defaultCategory.name,
	})
	expect(res.body.category.owner).toBeUndefined()
})

test('Should not fetch when unauthenticated', async () => {
	await request(app)
		.get(`/dishes/${defaultDish._id.toString()}`)
		.expect(401)
})

test('Should not fetch dish of other user', async () => {
	await request(app)
		.get(`/dishes/${defaultDish._id.toString()}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(404)
})