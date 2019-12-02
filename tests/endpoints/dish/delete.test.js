require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Dish = require('../../../src/models/dish')
const { defaultDish, defaultUser, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should delete dish successfully', async () => {
	await request(app)
		.delete(`/dishes/${defaultDish._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(200)
	// assert the data actually are deleted in database
	const dish = await Dish.findById(defaultDish._id.toString())
	expect(dish).toBeNull()
})

test('Should not delete dish when unauthenticated', async () => {
	await request(app)
		.delete(`/dishes/${defaultDish._id.toString()}`)
		.expect(401)
})

test('Should not delete the dish that do not exist', async () => {
	await request(app)
		.delete(`/dishes/${defaultDish._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(404)
})