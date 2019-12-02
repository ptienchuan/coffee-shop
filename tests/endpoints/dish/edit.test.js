require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Dish = require('../../../src/models/dish')
const { defaultDish, defaultUser, userOne, categoryOne, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

test('Should update a dish successfully', async () => {
	const dishId = defaultDish._id.toString()
	await request(app)
		.put(`/dishes/${dishId}`)
		.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
		.send({
			name: 'Espresso 1A',
			description: 'Italian coffee type 1',
			price: 30000,
			published: false,
			category: categoryOne._id.toString(),
		})
		.expect(200)
	// assert the data actually updated
	const dish = await Dish.findById(dishId)
	expect(dish).toMatchObject({
		name: 'Espresso 1A',
		description: 'Italian coffee type 1',
		price: 30000,
		published: false,
		category: categoryOne._id,
		nameLower: 'espresso 1a',
		owner: defaultUser._id
	})
})

test('Should not update when unauthenticated', async () => {
	await request(app)
		.put(`/dishes/${defaultDish._id.toString()}`)
		.send({
			name: 'Espresso 1A',
			description: 'Italian coffee type 1',
			price: 30000,
			published: false,
			category: categoryOne._id.toString(),
		})
		.expect(401)
})

test('Should not update when edit data of another user', async () => {
	await request(app)
		.put(`/dishes/${defaultDish._id.toString()}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'Espresso 1A',
			description: 'Italian coffee type 1',
			price: 30000,
			published: false,
			category: categoryOne._id.toString(),
		})
		.expect(404)
})

describe('Should not update when the inputs is invalid:', () => {
	test('When the name is invalid', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				name: '51 chars: Lorem ipsum dolor sit amet consectetur ad',
			})
			.expect(400)
	})

	test('When the description is invalid', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				description: '301 chars: Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quos quisquam architecto, facere animi accusamus tempora labore corrupti beatae! Veniam suscipit sed distinctio, nesciunt minima veritatis quia, non, repellendus labore quasi earum amet. Saepe possimus nisi amet nemo expedita opt',
			})
			.expect(400)
	})

	test('When the price is invalid', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				price: '-1',
			})
			.expect(400)
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				price: 'abc',
			})
			.expect(400)
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				price: '10000001',
			})
			.expect(400)
	})

	test('When the published is invalid', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				published: 'test',
			})
			.expect(400)
	})

	test('When the category is invalid', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				category: 'TEA',
			})
			.expect(400)
	})

	test('When edit the fields are not allowed', async () => {
		await request(app)
			.put(`/dishes/${defaultDish._id.toString()}`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.send({
				image: 'avt',
				owner: userOne._id.toString(),
			})
			.expect(400)
	})
})