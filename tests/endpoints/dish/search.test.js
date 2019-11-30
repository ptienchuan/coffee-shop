require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const {
	defaultUser,
	defaultDish,
	dishOne,
	dishTwo,
	dishThree,
	dishFour,
	defaultCategory,
	setupDatabase
} = require('../../fixtures/database')

beforeAll(setupDatabase)

describe('Should fetch some dishes successfully:', () => {
	test('When search without condition', async () => {
		const response = await request(app)
			.get('/dishes')
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			expect(200)
		expect(response.body).toHaveLength(5)

		// assert all private fields have been hidden
		for (const dish of response.body) {
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()
		}
	})

	test('When search by published', async () => {
		const response = await request(app)
			.get('/dishes')
			.query({
				published: true
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of data are responsed is right
		expect(response.body).toHaveLength(4)

		for (const dish of response.body) {
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()

			// assert the response data have published = true
			expect(dish.published).toBe(true)
		}

		const responseTwo = await request(app)
			.get('/dishes')
			.query({
				published: false
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of data are responsed is right
		expect(responseTwo.body).toHaveLength(1)

		// assert all private fields have been hidden
		expect(responseTwo.body[0].owner).toBeUndefined()
		expect(responseTwo.body[0].image).toBeUndefined()
		expect(responseTwo.body[0].nameLower).toBeUndefined()

		// assert the response data is right
		expect(responseTwo.body[0]._id).toBe(dishOne._id.toString())
	})

	test('When search by category', async () => {
		const response = await request(app)
			.get('/dishes')
			.query({
				category: defaultCategory._id.toString()
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(response.body).toHaveLength(4)

		for (const dish of response.body) {
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()

			// assert the response data have category right
			expect(dish.category).toBe(defaultCategory._id.toString())
		}
	})

	test('When search by name', async () => {
		let response = await request(app)
			.get('/dishes')
			.query({
				name: 'esp'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			expect(200)
		// assert the number of response data is right
		expect(response.body).toHaveLength(1)
		// assert the response data is right
		expect(response.body[0]._id).toBe(defaultDish._id.toString())
		// assert all private fields have been hidden
		expect(response.body[0].owner).toBeUndefined()
		expect(response.body[0].image).toBeUndefined()
		expect(response.body[0].nameLower).toBeUndefined()

		response = await request(app)
			.get('/dishes')
			.query({
				name: 'pres'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			expect(200)
		// assert the number of response data is right
		expect(response.body).toHaveLength(1)
		// assert the response data is right
		expect(response.body[0]._id).toBe(defaultDish._id.toString())
		// assert all private fields have been hidden
		expect(response.body[0].owner).toBeUndefined()
		expect(response.body[0].image).toBeUndefined()
		expect(response.body[0].nameLower).toBeUndefined()

		response = await request(app)
			.get('/dishes')
			.query({
				name: 'sso'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			expect(200)
		// assert the number of response data is right
		expect(response.body).toHaveLength(1)
		// assert the response data is right
		expect(response.body[0]._id).toBe(defaultDish._id.toString())
		// assert all private fields have been hidden
		expect(response.body[0].owner).toBeUndefined()
		expect(response.body[0].image).toBeUndefined()
		expect(response.body[0].nameLower).toBeUndefined()
	})

	test('When search by key(name or description)', async () => {
		let res = await request(app)
			.get('/dishes')
			.query({
				key: 'Espresso'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(3)

		for (const dish of res.body) {
			expect(dish.name + dish.description).toEqual(expect.stringMatching(/\espresso|\Espresso/))
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()
		}
	})

	test('When search by price(min, max, both)', async () => {
		let res = await request(app)
			.get('/dishes')
			.query({
				minPrice: 25000
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(4)

		for (const dish of res.body) {
			// assert the response data have price greater than 25000
			expect(dish.price).toBeGreaterThanOrEqual(25000)
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()
		}

		res = await request(app)
			.get('/dishes')
			.query({
				maxPrice: 30000
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(4)

		for (const dish of res.body) {
			// assert the response data have price greater than 25000
			expect(dish.price).toBeLessThanOrEqual(30000)
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()
		}

		res = await request(app)
			.get('/dishes')
			.query({
				minPrice: 25000,
				maxPrice: 32000
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(4)

		for (const dish of res.body) {
			// assert the response data have price greater than 25000
			expect(dish.price).not.toBeLessThan(25000)
			expect(dish.price).not.toBeGreaterThan(32000)
			// assert all private fields have been hidden
			expect(dish.owner).toBeUndefined()
			expect(dish.image).toBeUndefined()
			expect(dish.nameLower).toBeUndefined()
		}
	})

	test('When search all data with pagination and sorting', async () => {
		let res = await request(app)
			.get('/dishes')
			.query({
				sortBy: 'createdAt:asc',
				limit: 3,
				skip: 1
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(3)

		// assert the data is right
		expect(res.body[0]._id).toBe(dishOne._id.toString())
		expect(res.body[2]._id).toBe(dishThree._id.toString())

		res = await request(app)
			.get('/dishes')
			.query({
				sortBy: 'createdAt:desc',
				limit: 3,
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
		// assert the number of response data is right
		expect(res.body).toHaveLength(3)

		// assert the data is right
		expect(res.body[0]._id).toBe(dishFour._id.toString())
		expect(res.body[2]._id).toBe(dishTwo._id.toString())
	})
})

describe('Should not fetch any dishes:', () => {
	test('When unauthenticated', async () => {
		await request(app)
			.get('/dishes')
			.expect(401)
	})

	test('When have no data match', async () => {
		await request(app)
			.get('/dishes')
			.query({
				name: 'Espresso',
				maxPrice: 20000
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(404)
	})

	test('When paginate out of range', async () => {
		await request(app)
			.get('/dishes')
			.query({
				limit: 5,
				skip: 5
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(404)
	})

	test('When fetch data of other user', async () => {
		await request(app)
			.get('/dishes')
			.query({
				name: 'Lemon'
			})
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(404)
	})
})