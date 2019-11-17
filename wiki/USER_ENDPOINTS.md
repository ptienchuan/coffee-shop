# Endpoint list:
|  | Method | Url | Required Auth | Purpose |
| :-: | :- | :- | :-: | :- |
| 1 | POST | /users |  | Create a user
| 2 | POST | /users/login |  | Login user
| 3 | GET | /users/me | ✅ | Get profile of user
| 4 | PUT | /users/me | ✅ | Update profile of user
| 5 | POST | /users/logout | ✅ | Logout user
| 6 | POST | /users/logoutAll | ✅ | Logout user from all divices
| 7 | POST | /users/me/avatar | ✅ | Upload avatar image of user
| 8 | GET | /users/me/avatar | ✅ | Serve avatar image of user
| 9 | POST | /users/close | ✅ | Close user's account

# Endpoint documents:

## <br>1. Create a user:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users

#### *Headers:*
	Content-Type: application/json

#### *Body:*
The body is a json:
| Key | Required | Description
| :- | :-: | :-
| account | ✅ | Min length is 5 digits, max length is 30 digits
| password | ✅
| email | ✅ | Max length is 50 digits
| name | | Default is empty string. Max length is 30 digits


## **Response:**
#### *Success:*
	Status: 200
	Body:
		{
			newUser: <Object>
			token: <String>
		}

#### *Error:*
	Status: 400
	Body: <Object> error content



## <br><br>2. Login user:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/login

#### *Headers:*
	Content-Type: application/json

#### *Body:*
The body is a json:
| Key | Required | Description
| :- | :-: | :-
| account | ✅
| password | ✅


## **Response:**
#### *Success:*
	Status: 200
	Body:
		{
			user: <Object>
			token: <String>
		}

#### *Error:*
	Status: 400
	Body: <Object> error content


## <br><br>3. Get profile of user:
---
## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /users/me

#### *Headers:*
	Content-Type: application/jso
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200
	Body: <Object> user info

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error


## <br><br>4. Update profile of user:
---
## **Request:**
#### *Endpoint:*
	Method: PUT
	Url: /users/me

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Body:*
The body is a json:
| Key | Required | Description
| :- | :-: | :-
| password |
| email | | Max length is 50 digits
| name | | Max length is 30 digits


## **Response:**
#### *Success:*
	Status: 200
	Body: <Object> user data after updated

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error


## <br><br>5. Logout user:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/logout

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 500


## <br><br>6. Logout user from all devices:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/logoutAll

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 500


## <br><br>7. Upload avatar image of user:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/me/avatar

#### *Headers:*
	Content-Type: multipart/form-data
	Authorization: Bearer <token>

#### *Body:*
The body is a json:
| Key | Required | Description
| :- | :-: | :-
| file | ✅ | A file upload with extension is jpg/jpeg/png. Max file size is 2Mb


## **Response:**
#### *Success:*
	Status: 200

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error


## <br><br>8. Serve avatar image of user:
---
## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /users/me/avatar

#### *Headers:*
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200
	The response is a image

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404


## <br><br>9. Close user account:
---
## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/close

#### *Headers:*
	Authorization: Bearer <token>

## **Response:**
#### *Success:*
	Status: 200
	Body: <Object>

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 500