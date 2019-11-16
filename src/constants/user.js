module.exports = {
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "taste-coffee",
	JWT_EXPIRE: '7 days',
	ENCRYPT_ROUND: parseInt(process.env.ENCRYPT_ROUND) || 8,
	USER_MAX_AVATAR_SIZE: 2	//Mb
}