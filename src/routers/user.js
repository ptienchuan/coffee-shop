const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const { USER_MAX_AVATAR_SIZE } = require('../constants')
const router = express.Router()

router.post('/', async (req, res) => {
	const newUser = new User(req.body)

	try {
		await newUser.save()
		const token = await newUser.generateToken()

		res.send({ newUser, token })
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.account, req.body.password)
		const token = await user.generateToken()

		res.send({user, token})
	} catch (e) {
		res.status(400).send({ error: e.message })
	}
})

router.get('/me', auth, async (req, res) => {
	res.send(req.user)
})

router.put('/me', auth, async (req, res) => {
	const updateFields = Object.keys(req.body)
	const allowUpdateFields = ["password", "email", "name"]
	const isValidFields = updateFields.every((field) => allowUpdateFields.includes(field))

	if (!isValidFields) {
		return res.status(400).send({ error: "Posted data contains invalid field" })
	}

	try {
		updateFields.forEach(field => req.user[field] = req.body[field])
		await req.user.save()

		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/logout', auth, async (req, res) => {
	try {
		const { user, token } = req

		user.tokens = user.tokens.filter((dbToken) => dbToken.token !== token)
		await user.save()

		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

router.post('/logoutAll', auth, async (req, res) => {
	try {
		const { user } = req

		user.tokens = []
		await user.save()

		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

const upload = multer({
	limits: {
		fileSize: USER_MAX_AVATAR_SIZE * 1024 * 1024,	// The unit is Byte
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('You can only upload a image'))
		}
		cb(null, true)
	}
})
router.post('/me/avatar', auth, upload.single('file'), async (req, res) => {
	try {
		const buffer = await sharp(req.file.buffer).resize(200, 200).toBuffer()
		req.user.avatar = {
			source: buffer,
			mimeType: req.file.mimetype
		}
		await req.user.save()
		res.send()
	} catch (e) {
		res.status(500).send(e.message)
	}
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message })
})

router.get('/me/avatar', auth, (req, res) => {
	try {
		if (!req.user.avatar) {
			throw new Error()
		}

		res.set('Content-Type', req.user.avatar.mimeType)
		res.send(req.user.avatar.source)
	} catch (e) {
		res.status(404).send()
	}
})

router.post('/close', auth, async (req, res) => {
	try {
		await req.user.close()

		res.send(req.user)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router