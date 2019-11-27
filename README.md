# Dish management api

## Packages
- **express**: to create a server
- **mongoose**: to interactive with database MongoDB
- **jsonwebtoken**: to authenticate user
- **bcryptjs**: to encrypt user's password
- **validator**: to validate data
- **multer**: to upload file
- **sharp**: to handle image
- **dotenv**: to handle environment
- **jest**: to test

## Install
**1. Clone the source code by git HTTPS:**

	`https://github.com/ptienchuan/dish-management-api.git`

**2. Install packages:**

	Run command:

	`$ npm install`

**3. Setup environment:**

	- For `development`:
		- Clone file `.env-template` to the same directory and rename to `.env`
		- By default, the project will run on port `3000` and will use the database with database name is `coffee-shop`

	- For `testing`:
		- Clone file `.env-template` to the same directory and rename to `test.env`
		- By default, project will use the database with database name is `coffee-shop-test` for testing

**4. Run project:**

- For `development`:

	`$ npm start`
	
	or
	
	`$ npm run dev` *this command will watch every change of the source to restart the server automatically*

- For `testing`:

	`$ npm run test`


## Documents:

Read more from the document of the project in:

`./wiki/USER_ENDPOINTS.md`

`./wiki/DISH_ENDPOINTS.md`

`./wiki/CATEGORY_ENDPOINTS.md`
