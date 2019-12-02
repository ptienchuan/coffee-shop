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

const categoryTwo = {
	_id: mongoose.Types.ObjectId(),
	name: 'WINE'
}

const categoryThree = {
	_id: mongoose.Types.ObjectId(),
	name: 'MILK'
}

const setupDatabase = async () => {
	await Category.deleteMany()
	await new Category(defaultCategory).save()
	await new Category(categoryOne).save()
	await new Category(categoryTwo).save()
	await new Category(categoryThree).save()
}

module.exports = {
	defaultCategory,
	categoryOne,
	categoryTwo,
	categoryThree,
	setupDatabase
}