const express = require('express')
const Category = require('../models/category')
const Dish = require('../models/dish')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
	const newCategory = new Category({
		...req.body,
		owner: req.user._id
	})

	try {
		await newCategory.save()
		res.status(201).send(newCategory)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get('/', auth, async (req, res) => {
	let willGetDishes = false
	let dishMatch = { owner: req.user._id }
	let conditions = { owner: req.user._id }
	let limit, skip
	let sort = { updatedAt: -1 }	//default sorting is updatedAt desc

	try {
		// query for dish
		if (req.query.full) {
			willGetDishes = req.query.full.toLowerCase() === 'true'
			if (req.query.publishedDishes) {
				dishMatch.published = req.query.publishedDishes.toLowerCase() === 'true'
			}
		}

		// query for category
		if (req.query.name) {
			conditions.nameLower = { $regex: '.*' + req.query.name.toLowerCase() + '.*' }
		}

		// query for paginate: /categories?limit=10&skip=10
		if (req.query.limit) {
			limit = parseInt(req.query.limit)
		}
		if (req.query.skip) {
			skip = parseInt(req.query.skip)
		}

		// query for sort: /categories?sortBy=createdAt:desc
		if (req.query.sortBy) {
			const allowFields = ['name', 'createdAt', 'updatedAt']
			const sortInfo = req.query.sortBy.split(':')
			if (!allowFields.includes(sortInfo[0])) {
				throw new Error
			}

			sort = {}
			sort[sortInfo[0]] = (sortInfo[1] && sortInfo[1].toLowerCase() === 'desc') ? -1 : 1
		}
	} catch (e) {
		return res.status(400).send({ error: "The query is invalid" })
	}

	try {
		const categories = await Category.find(conditions, null, {
			limit,
			skip,
			sort
		})

		if (!categories || categories.length === 0) {
			return res.status(404).send()
		}

		if (willGetDishes) {
			for (let category of categories) {
				await category.populate({
					path: 'dishes',
					match: dishMatch
				}).execPopulate()
			}
		}

		res.send(categories)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/:id', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const category = await Category.findOne({ _id, owner: req.user._id })

		if (!category) {
			return res.status(404).send()
		}

		await category.populate({
			path: 'dishes',
			match: { published: true }
		}).execPopulate()

		res.send(category)
	} catch (e) {
		res.status(500).send()
	}
})

router.put('/:id', auth, async (req, res) => {
	const _id = req.params.id
	const updateFields = Object.keys(req.body)
	const allowFields = ['name']
	const isValidFields = updateFields.every((field) => allowFields.includes(field))

	if (!isValidFields) {
		return res.status(400).send({ error: 'Posted data contains invalid field' })
	}

	try {
		const category = await Category.findOne({ _id, owner: req.user._id })
		if (!category) {
			return res.status(404).send()
		}

		updateFields.forEach((field) => category[field] = req.body[field])
		await category.save()

		res.send(category)
	} catch (e) {
		res.status(400).send(e)
	}

})

router.delete('/:id', auth, async (req, res) => {
	const _id = req.params.id
	const { includeDishes } = req.query

	try {
		const conditons = { _id, owner: req.user._id }
		let category = await Category.findOne(conditons)

		if (!category) {
			return res.status(404).send()
		}

		if (includeDishes === 'true') {
			// delete the category and all of it's dishes
			await category.remove()
		} else {
			// delete the category, all of it's dishes won't belong to any category
			category = await Category.findOneAndDelete(conditons)
		}

		res.send(category)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.post('/:id/dishes', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const newDish = new Dish({
			...req.body,
			owner: req.user._id,
			category: _id
		})

		await newDish.save()
		res.status(201).send(newDish)
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = router