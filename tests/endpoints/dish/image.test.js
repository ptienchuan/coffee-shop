require('../../config/environment')
const request = require('supertest')
const app = require('../../../src/app')
const Dish = require('../../../src/models/dish')
const { defaultDish, dishOne, defaultUser, setupDatabase } = require('../../fixtures/database')

beforeAll(setupDatabase)

describe('When upload image:', () => {
	test('Should upload dish image successfully', async () => {
		await request(app)
			.post(`/dishes/${defaultDish._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.attach('file', 'tests/fixtures/img/espresso.jpg')
			.expect(200)
		// assert the image actually save to database
		const dish = await Dish.findById(defaultDish._id.toString())
		expect(dish.image.source).toEqual(expect.any(Buffer))
		expect(dish.image.mimeType).toBe('image/jpeg')
	})

	test('Should not upload dish image when unauthenticated', async () => {
		await request(app)
			.post(`/dishes/${defaultDish._id.toString()}/image`)
			.expect(401)
	})

	test('Should not upload dish image when the file too large(more than 2Mb)', async () => {
		await request(app)
			.post(`/dishes/${defaultDish._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.attach('file', 'tests/fixtures/img/picture_2.5Mb.jpg')
			.expect(400)
	})

	test('Should not upload dish image when extension of the file is invalid', async () => {
		await request(app)
			.post(`/dishes/${defaultDish._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.attach('file', 'tests/fixtures/img/excel.xlsx')
			.expect(400)
		await request(app)
			.post(`/dishes/${defaultDish._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.attach('file', 'tests/fixtures/img/giphy.gif')
			.expect(400)
	})
})

describe('When serve image:', () => {
	test('Should serve dish image', async () => {
		const res = await request(app)
			.get(`/dishes/${defaultDish._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(200)
			.expect('Content-Type', 'image/jpeg')
		expect(res.body).toEqual(expect.any(Buffer))
	})

	test('Should not serve a image when unauthenticated', async () => {
		await request(app)
			.get(`/dishes/${defaultDish._id.toString()}/image`)
			.expect(401)
	})

	test('Should not serve image of the dish has not been uploaded image yet', async () => {
		await request(app)
			.get(`/dishes/${dishOne._id.toString()}/image`)
			.set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
			.expect(404)
	})
})