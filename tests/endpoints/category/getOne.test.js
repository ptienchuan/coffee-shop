require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const { defaultCategory, dishSix, defaultUser, userOne, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should fetch a category', async () => {
	let res = await request(app)
		.get(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.expect(200)
	expect(res.body).toMatchObject({
		name: 'COFFEE'
	})
	expect(res.body.dishes).toBeUndefined()

	res = await request(app)
		.get(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.query({
			full: true
		})
		.expect(200)
	expect(res.body).toMatchObject({
		name: 'COFFEE'
	})
	expect(res.body.dishes).toHaveLength(5)

	res = await request(app)
		.get(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.query({
			full: true,
			publishedDishes: false
		})
		.expect(200)
	expect(res.body).toMatchObject({
		name: 'COFFEE'
	})
	expect(res.body.dishes).toHaveLength(1)
	expect(res.body.dishes[0]._id).toBe(dishSix._id.toString())
})

test('Should not fetch category when unauthenticated', async () => {
	await request(app)
		.get(`/categories/${defaultCategory._id.toString()}`)
		.expect(401)
})

test('Should not fetch category when fetch a category of another user', async () => {
	await request(app)
		.get(`/categories/${defaultCategory._id.toString()}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(404)
})