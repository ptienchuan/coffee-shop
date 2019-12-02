require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Category = require('../../../src/models/category')
const { defaultCategory, defaultUser, userOne, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should update category successfully', async () => {
	await request(app)
		.put(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: 'COFFEEs',
		})
		.expect(200)
	// assert the data actually updated
	const category = await Category.findById(defaultCategory._id)
	expect(category).toMatchObject({
		name: 'COFFEEs',
		nameLower: 'coffees',
		owner: defaultUser._id
	})
})

test('Should not update category when unauthenticated', async () => {
	await request(app)
		.put(`/categories/${defaultCategory._id.toString()}`)
		.send({
			name: 'dummy'
		})
		.expect(401)
})

test('Should not update category when the input is invalid', async () => {
	await request(app)
		.put(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: '51 chars : Lorem ipsum dolor sit amet, consectetur.'
		})
		.expect(400)

	await request(app)
		.put(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			owner: userOne._id.toString()
		})
		.expect(400)
})

test('Should not update category when update the category of another user', async () => {
	await request(app)
		.put(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'DUMMY'
		})
		.expect(404)
})