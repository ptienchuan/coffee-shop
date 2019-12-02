require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Dish = require('../../../src/models/dish')
const { defaultUser, defaultCategory, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should create a dish successfully', async () => {
	const response = await request(app)
		.post(`/categories/${defaultCategory._id.toString()}/dishes`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: 'Latte',
			description: 'Espresso with milk',
			price: 30000,
			image: {
				source: 'dummy',
				mimeType: 'dummy'
			},
			owner: 'dummy'
		})
		.expect(201)

	// assert the data actually regist to database
	const dish = await Dish.findById(response.body._id)
	expect(dish).not.toBeNull()
	expect(dish).toMatchObject({
		name: 'Latte',
		nameLower: 'latte',
		description: 'Espresso with milk',
		price: 30000,
		published: true,
		owner: defaultUser._id,
		category: defaultCategory._id
	})

	// assert the default image is not exist
	expect(dish.image.source).toBeUndefined()
	expect(dish.image.mimeType).toBeUndefined()

	const responseTwo = await request(app)
		.post(`/categories/${defaultCategory._id.toString()}/dishes`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: 'Mocha',
			published: false
		})
		.expect(201)

	// assert the data actually regist to database
	const dishTwo = await Dish.findById(responseTwo.body._id)
	expect(dishTwo).toMatchObject({
		name: 'Mocha',
		nameLower: 'mocha',
		description: '',
		price: 0,
		published: false,
		owner: defaultUser._id,
	})

	// assert the default image is not exist
	expect(dishTwo.image.source).toBeUndefined()
	expect(dishTwo.image.mimeType).toBeUndefined()
})

test('Should not create a dish when unauthenticated', async () => {
	await request(app)
		.post(`/categories/${defaultCategory._id.toString()}/dishes`)
		.send({
			name: "Capuchino"
		})
		.expect(401)
})

describe('Should not create a dish with invalid name/description/price/publish', () => {
	test('With invalid name', async () => {
		// the case undefined
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				price: 10000000, // 10,000,000
				description: 'dummy'
			})
			.expect(400)

		// the case with length is 51 characters
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: '51 chars : Lorem ipsum dolor sit amet, consectetur.'
			})
			.expect(400)
	})

	test('With invalid description', async () => {
		// the case with length is 301 characters
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: 'dummy',
				description: '301 chars : Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum animi aliquid eveniet nihil? Ab corporis labore temporibus eaque quasi iure necessitatibus aliquid, numquam corrupti consequatur. Incidunt eum quasi pariatur id omnis amet explicabo sunt recusandae, nesciunt accusamus persp.'
			})
			.expect(400)
	})

	test('With invalid price', async () => {
		// the case price is not a number
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: 'dummy',
				price: 'dummy'
			})
			.expect(400)

		// the case price is a negative number
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: 'dummy',
				price: '-25000'
			})
			.expect(400)

		// the case price has length more than 10,000,000
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: 'dummy',
				price: 10000001
			})
			.expect(400)
	})

	test('With invalid publish', async () => {
		// the case price is not a boolean value
		await request(app)
			.post(`/categories/${defaultCategory._id.toString()}/dishes`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: 'dummy',
				published: 'dummy'
			})
			.expect(400)
	})
})