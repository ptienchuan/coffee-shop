const dummyUser = require('./user')
const dummyCategory = require('./category')
const dummyDish = require('./dish')

// categories
dummyCategory.defaultCategory.owner = dummyUser.defaultUser._id
dummyCategory.categoryOne.owner = dummyUser.userOne._id

// dishes
dummyDish.dishOne.owner = dummyUser.defaultUser._id
dummyDish.dishOne.category = dummyCategory.categoryOne._id

dummyDish.defaultDish.owner = dummyUser.defaultUser._id
dummyDish.defaultDish.category = dummyCategory.defaultCategory._id
dummyDish.dishTwo.owner = dummyUser.defaultUser._id
dummyDish.dishTwo.category = dummyCategory.defaultCategory._id
dummyDish.dishThree.owner = dummyUser.defaultUser._id
dummyDish.dishThree.category = dummyCategory.defaultCategory._id
dummyDish.dishFour.owner = dummyUser.defaultUser._id
dummyDish.dishFour.category = dummyCategory.defaultCategory._id

dummyDish.dishFive.owner = dummyUser.userOne._id
dummyDish.dishFive.category = dummyCategory.categoryOne._id

const setupDatabase = async () => {
	await dummyUser.setupDatabase()
	await dummyCategory.setupDatabase()
	await dummyDish.setupDatabase()
}

module.exports = {
	...dummyUser,
	...dummyCategory,
	...dummyDish,
	setupDatabase
}