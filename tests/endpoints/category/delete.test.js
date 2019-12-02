require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Category = require('../../../src/models/category')
const { defaultCategory, defaultUser, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should delete dish successfully', async () => {
	await request(app)
		.delete(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(200)
	// assert the data actually are deleted in database
	const category = await Category.findById(defaultCategory._id.toString())
	expect(category).toBeNull()
})

test('Should not delete dish when unauthenticated', async () => {
	await request(app)
		.delete(`/dishes/${defaultCategory._id.toString()}`)
		.expect(401)
})

test('Should not delete the dish that do not exist', async () => {
	await request(app)
		.delete(`/dishes/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(404)
})