const mongoose = require('mongoose')
const Dish = require('../../../src/models/dish')

const defaultDish = {
	_id: mongoose.Types.ObjectId(),
	name: 'Espresso',
	description: 'Italian coffee',
	price: 25000,
}

const dishOne = {
	_id: mongoose.Types.ObjectId(),
	name: 'Ice coffee',
	description: 'ice coffee',
	price: 20000,
	published: false,
}

const dishTwo = {
	_id: mongoose.Types.ObjectId(),
	name: 'Latte',
	description: 'Espresso with frothy fresh milk',
	price: 30000
}

const dishThree = {
	_id: mongoose.Types.ObjectId(),
	name: 'Capuchino',
	description: 'Espresso with frothy fresh milk and prothy condensed milk',
	price: 32000
}

const dishFour = {
	_id: mongoose.Types.ObjectId(),
	name: 'Mocha',
	price: 25000,
}

const dishFive = {
	_id: mongoose.Types.ObjectId(),
	name: 'Lemon tea',
	description: 'Tea with fresh lemon juice',
	price: 20000
}

const dishSix = {
	_id: mongoose.Types.ObjectId(),
	name: 'Ice milk coffee',
	description: 'ice milk coffee',
	price: 25000,
	published: false,
}

const setupDatabase = async () => {
	await Dish.deleteMany()
	await new Dish(defaultDish).save()
	await new Dish(dishOne).save()
	await new Dish(dishTwo).save()
	await new Dish(dishThree).save()
	await new Dish(dishFour).save()
	await new Dish(dishFive).save()
	await new Dish(dishSix).save()
}

module.exports = {
	defaultDish,
	dishOne,
	dishTwo,
	dishThree,
	dishFour,
	dishFive,
	dishSix,
	setupDatabase
}