require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Category = require('../../../src/models/category')
const { defaultUser, userOne, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should create a category successfully', async () => {
	const res = await request(app)
		.post('/categories')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: 'COCKTAIL',
			owner: userOne._id.toString()
		})
		.expect(201)
	// assert the data actually save to database
	const category = await Category.findById(res.body._id)
	expect(category).toMatchObject({
		name: 'COCKTAIL',
		nameLower: 'cocktail',
		owner: defaultUser._id
	})
})

test('Should not create category when unauthenticated', async () => {
	await request(app)
		.post('/categories')
		.send({
			name: 'COCKTAIL'
		})
		.expect(401)
})

test('Should not create category when the input is invalid', async () => {
	await request(app)
		.post('/categories')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: '51 chars : Lorem ipsum dolor sit amet, consectetur.'
		})
		.expect(400)

	await request(app)
		.post('/categories')
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			owner: userOne._id.toString()
		})
		.expect(400)
})