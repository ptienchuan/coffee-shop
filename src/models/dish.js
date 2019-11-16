const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
		trim: true
	},
	nameLower: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		maxlength: 300,
		trim: true,
		default: ''
	},
	price: {
		type: Number,
		maxlength: 7,
		trim: true,
		min: 0,
		default: 0
	},
	image: {
		source: Buffer,
		mimeType: String
	},
	published: {
		type: Boolean,
		default: true
	},
	owner: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	category: {
		type: ObjectId,
		ref: 'Category'
	}
}, {
	timestamps: true
})

schema.methods.toJSON = function() {
	const dish = this.toObject()

	delete dish.nameLower
	delete dish.image
	delete dish.owner

	return dish
}

schema.pre('save', function() {
	this.nameLower = this.name.toLowerCase()
})

module.exports = new mongoose.model('Dish', schema)