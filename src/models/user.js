const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_PRIVATE_KEY, JWT_EXPIRE, ENCRYPT_ROUND } = require('../constants')

const schema = new mongoose.Schema({
	account: {
		type: String,
		required: true,
		maxlength: 30,
		minlength: 5,
		lowercase: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		maxlength: 50,
		lowercase: true,
		trim: true,
		unique: true,
		validate: function (value) {
			if (!validator.isEmail(value)) {
				throw new Error("The email is invalid")
			}
		}
	},
	name: {
		type: String,
		maxlength: 30,
		trim: true,
		default: ''
	},
	avatar: {
		source: Buffer,
		mimeType: String
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
	closed: {
		type: Boolean,
		default: false
	},
	closedDate: {
		type: Date
	}
}, {
	timestamps: true
})

schema.virtual('dishes', {
	ref: 'Dish',
	localField: '_id',
	foreignField: 'owner'
})

// Override method toJSON of model instance to hide private fields when stringify model instance
schema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.avatar
	delete userObject.tokens
	delete userObject.closed

	return userObject
}

schema.methods.close = function () {
	const user = this

	user.closed = true
	user.tokens = []
	user.closedDate = new Date()

	user.save()
	return user
}

schema.methods.generateToken = async function () {
	try {
		const user = this
		const token = await jwt.sign({ _id: user._id }, JWT_PRIVATE_KEY, { expiresIn: JWT_EXPIRE })

		user.tokens = user.tokens.concat({ token })
		await user.save()

		return token
	} catch (e) {
		throw new Error("Account or password is invalid")
	}
}

schema.statics.findByCredentials = async function (account, password) {
	const user = await this.findOne({ account })
	if (!user) {
		throw new Error("Account or password is invalid")
	}

	const isValid = await bcrypt.compare(password, user.password)
	if (!isValid) {
		throw new Error("Account or password is invalid")
	}
	else if (user.closed) {
		throw new Error("This account have been closed")
	}

	return user
}

schema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, ENCRYPT_ROUND )
		user.tokens = []
	}

	next()
})

module.exports = mongoose.model('User', schema)