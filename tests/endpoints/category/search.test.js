require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const { defaultUser, defaultCategory, categoryTwo, categoryThree, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

describe('Should search some categories:', () => {
	test('When search without condition', async () => {
		const res = await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		expect(res.body).toHaveLength(3)
		for (const category of res.body) {
			// assert the private fields have been hidden
			expect(category.owner).toBeUndefined()
			expect(category.nameLower).toBeUndefined()
			// assert dish is not acquired
			expect(category.dishes).toBeUndefined()
		}
	})

	test('When search by name', async () => {
		const res = await request(app)
			.get('/categories')
			.query({
				name: 'coffee'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		expect(res.body).toHaveLength(1)
		for (const category of res.body) {
			// assert the private fields have been hidden
			expect(category.owner).toBeUndefined()
			expect(category.nameLower).toBeUndefined()
			// assert the data is right
			expect(category).toMatchObject({ name: 'COFFEE' })
			// assert dish is not acquired
			expect(category.dishes).toBeUndefined()
		}
	})

	test('When search with full-flag and publishedDishes-flag', async () => {
		let res = await request(app)
			.get('/categories')
			.query({
				name: 'coffee',
				full: true,
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		expect(res.body).toHaveLength(1)
		// assert the private fields have been hidden
		expect(res.body[0].owner).toBeUndefined()
		expect(res.body[0].nameLower).toBeUndefined()
		// assert the data is right
		expect(res.body[0]).toMatchObject({ name: 'COFFEE' })
		// assert the dish is acquired
		expect(res.body[0].dishes).toHaveLength(5)

		res = await request(app)
			.get('/categories')
			.query({
				name: 'coffee',
				full: true,
				publishedDishes: false
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		expect(res.body).toHaveLength(1)
		// assert the private fields have been hidden
		expect(res.body[0].owner).toBeUndefined()
		expect(res.body[0].nameLower).toBeUndefined()
		// assert the data is right
		expect(res.body[0]).toMatchObject({ name: 'COFFEE' })
		// assert the dish is acquired
		expect(res.body[0].dishes).toHaveLength(1)
		expect(res.body[0].dishes[0]).toMatchObject({
			name: 'Ice milk coffee',
			description: 'ice milk coffee',
			price: 25000,
			published: false,
		})
	})

	test('When search with pagination and sorting', async () => {
		let res = await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.query({
				limit: 2,
				skip: 1,
				sortBy: 'createdAt:asc'
			})
			.expect(200)
		expect(res.body).toHaveLength(2)
		expect(res.body[0]._id).toBe(categoryTwo._id.toHexString())
		expect(res.body[1]._id).toBe(categoryThree._id.toHexString())

		res = await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.query({
				limit: 2,
				skip: 1,
				sortBy: 'createdAt:desc'
			})
			.expect(200)
		expect(res.body).toHaveLength(2)
		expect(res.body[0]._id).toBe(categoryTwo._id.toHexString())
		expect(res.body[1]._id).toBe(defaultCategory._id.toHexString())
	})
})

describe('Should search no category:', () => {
	test('When unauthenticated', async () => {
		await request(app)
			.get('/categories')
			.expect(401)
	})

	test('When have no category match the condition', async () => {
		await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.query({ name: 'noodle' })
			.expect(404)
	})

	test('When paginate out of range', async () => {
		await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.query({
				limit: 2,
				skip: 3
			})
			.expect(404)
	})

	test('When fetch data of another user', async () => {
		await request(app)
			.get('/categories')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.query({ name: 'tea' })
			.expect(404)
	})
})