const express = require('express')
const multer = require('multer')
const Dish = require('../models/dish')
const auth = require('../middlewares/auth')
const { DISH_MAX_IMAGE_SIZE } = require('../constants')
const router = express.Router()

router.post('/', auth, async (req, res) => {
	const newDish = new Dish({
		...req.body,
		owner: req.user._id
	})

	try {
		await newDish.save()
		res.status(201).send(newDish)
	} catch (e) {
		res.status(400).send(e)
	}
})

// GET	/dishes?published=true			-> search by published
// GET	/dishes?category=aceoinef	  -> search by category
// GET	/dishes?name=coffee				-> search like by name
// GET	/dishes?key=coffee				  -> search like by description or name
// GET	/dishes?minPrice=1000		   -> search by price
// GET	/dishes?maxPrice=50000		 -> search by price
router.get('/', auth, async (req, res) => {
	let conditions = { owner: req.user._id }
	let limit, skip
	let sort = { updatedAt: -1 }	//default sorting is updatedAt desc

	try {
		// query to filter
		if (req.query.published) {
			conditions.published = req.query.published.toLowerCase() === 'true'
		}
		if (req.query.category) {
			conditions.category = req.query.category
		}
		if (req.query.name) {
			conditions.nameLower = { $regex: '.*' + req.query.name.toLowerCase() + '.*' }
		}
		if (req.query.key) {
			conditions.$or = [
				{ nameLower: { $regex: '.*' + req.query.key.toLowerCase() + '.*' } },
				{ description: { $regex: '.*' + req.query.key + '.*' } }
			]
		}
		if (req.query.minPrice) {
			conditions.price = { $gte: parseInt(req.query.minPrice) }
		}
		if (req.query.maxPrice) {
			if (conditions.price) {
				conditions.price.$lte = parseInt(req.query.maxPrice)
			} else {
				conditions.price = { $lte: parseInt(req.query.maxPrice) }
			}
		}

		// query to paginate: /dishes?limit=10&skip=10
		if (req.query.limit) {
			limit = parseInt(req.query.limit)
		}
		if (req.query.skip) {
			skip = parseInt(req.query.skip)
		}

		// query to sort: /dishes?sortBy=price:desc
		if (req.query.sortBy) {
			sortInfo = req.query.sortBy.split(':')
			sort = {}
			sort[sortInfo[0]] = (sortInfo[1] && sortInfo[1].toLowerCase() === 'desc') ? -1 : 1
		}
	} catch (e) {
		return res.status(400).send({ error: "The query field is invalid" })
	}

	try {
		const dishes = await Dish.find(conditions, null, {
			limit,
			skip,
			sort
		})

		if (!dishes || dishes.length === 0) {
			return res.status(404).send()
		}

		res.send(dishes)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get('/:id', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const dish = await Dish.findOne({ _id, owner: req.user._id })

		if (!dish) {
			return res.status(404).send()
		}

		await dish.populate('category', 'name').populate('owner', 'name').execPopulate()

		res.send(dish)
	} catch (e) {
		res.status(500).send()
	}
})

router.put('/:id', auth, async (req, res) => {
	const _id = req.params.id
	const inputFields = Object.keys(req.body)
	const allowFields = ['name', 'description', 'price', 'published', 'category']
	const isValidFields = inputFields.every((field) => allowFields.includes(field))

	if (!isValidFields) {
		return res.status(400).send({ error: "Posted data contains invalid field" })
	}

	try {
		const dish = await Dish.findOne({ _id, owner: req.user._id })
		if (!dish) {
			return res.status(404).send()
		}

		inputFields.forEach((field) => dish[field] = req.body[field])
		await dish.save()

		res.send(dish)
	} catch (e) {
		res.status(400).send(e)
	}
})

const upload = multer({
	limits: {
		fileSize: DISH_MAX_IMAGE_SIZE * 1024 * 1024
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('You can only upload a image'))
		}
		cb(null, true)
	}
})
router.post('/:id/image', auth, upload.single('file'), async (req, res) => {
	const _id = req.params.id
	try {
		const dish = await Dish.findOne({ _id, owner: req.user._id })

		if (!dish) {
			return res.status(404).send()
		}

		dish.image = {
			source: req.file.buffer,
			mimeType: req.file.mimetype
		}

		await dish.save()
		res.send()
	} catch (e) {
		res.status(500).send(e.message)
	}
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message })
})

router.get('/:id/image', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const dish = await Dish.findOne({ _id, owner: req.user._id })
		if (!dish || !dish.image) {
			throw new Error()
		}

		res.set('Content-Type', dish.image.mimeType)
		res.send(dish.image.source)
	} catch (e) {
		res.status(404).send()
	}
})

router.delete('/:id', auth, async (req, res) => {
	const _id = req.params.id

	try {
		const dish = await Dish.findOne({ _id, owner: req.user._id })

		if (!dish) {
			return res.status(400).send()
		}

		await dish.remove()
		res.send(dish)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router