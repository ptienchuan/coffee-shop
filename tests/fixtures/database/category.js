const mongoose = require('mongoose')
const Category = require('../../../src/models/category')

const _id = mongoose.Types.ObjectId()
const defaultCategory = {
	_id,
	name: 'COFFEE'
}

const categoryOne = {
	_id: mongoose.Types.ObjectId(),
	name: 'TEA'
}

const setupDatabase = async () => {
	await Category.deleteMany()
	await new Category(defaultCategory).save()
	await new Category(categoryOne).save()
}

module.exports = {
	defaultCategory,
	categoryOne,
	setupDatabase
}