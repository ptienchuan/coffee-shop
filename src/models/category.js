const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	nameLower: {
		type: String,
		trim: true
	},
	owner: {
		type: ObjectId,
		required: true
	}
}, {
	timestamps: true
})

schema.virtual('dishes', {
	ref: 'Dish',
	localField: '_id',
	foreignField: 'category'
})

schema.methods.toJSON = function () {
	const category = this
	let categoryObj = category.toObject()

	// hire private fields
	delete categoryObj.owner
	delete categoryObj.nameLower

	// convert dish to object
	if (category.dishes !== undefined) {
		let { dishes=[] } = category
		categoryObj.dishes = dishes
	}

	return categoryObj
}

schema.pre('save', function() {
	this.nameLower = this.name.toLowerCase()
})

schema.pre('remove', { document: true }, async function () {
	const category = this

	// delete dishes of the category
	await category.populate('dishes').execPopulate()
	const { dishes } = category
	for (const dish of dishes) {
		await dish.remove()
	}
})

schema.post('findOneAndDelete', async function (category) {
	// update category of dishes
	await category.populate('dishes').execPopulate()
	const { dishes } = category
	for (const dish of dishes) {
		dish.category = undefined
		await dish.save()
	}
	category.dishes = []
})

module.exports = mongoose.model('Category', schema)