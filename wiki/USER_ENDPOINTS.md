# Endpoint list:
|  | Method | Url | Required Auth | Purpose |
| :-: | :- | :- | :-: | :- |
| 1 | POST | /users |  | [Create a user](#create)
| 2 | POST | /users/login |  | [Login user](#login)
| 3 | GET | /users/me | ✅ | [Get profile of user](#get-profile)
| 4 | PUT | /users/me | ✅ | [Update profile of user](#update-profile)
| 5 | POST | /users/logout | ✅ | [Logout user](#logout)
| 6 | POST | /users/logoutAll | ✅ | [Logout user from all divices](#logout-all)
| 7 | POST | /users/me/avatar | ✅ | [Upload avatar image of user](#upload-avatar)
| 8 | GET | /users/me/avatar | ✅ | [Serve avatar image of user](#serve-avatar)
| 9 | POST | /users/close | ✅ | [Close user's account](#close)

# <br>Endpoint documents:

## <a name="create"></a>1. Create a user:

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
| email | ✅ | Max length is 50 digits
| password | ✅
| name | | Default is empty string. Max length is 30 digits


## **Response:**
#### *Success:*
	Status: 201
	Body:
		{
			newUser: <Object>
			token: <String>
		}

#### *Error:*
	Status: 400
	Body: <Object> error content



## <br><br><a name="login"></a>2. Login user:

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
| email | ✅
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


## <br><br><a name="get-profile"></a>3. Get profile of user:

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


## <br><br><a name="update-profile"></a>4. Update profile of user:

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


## <br><br><a name="logout"></a>5. Logout user:

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


## <br><br><a name="logout-all"></a>6. Logout user from all devices:

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


## <br><br><a name="upload-avatar"></a>7. Upload avatar image of user:

## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /users/me/avatar

#### *Headers:*
	Content-Type: multipart/form-data
	Authorization: Bearer <token>

#### *Body:*

| Key | Required | Description
| :- | :-: | :-
| file | ✅ | A file upload with extension is jpg/jpeg/png. Max file size is 2Mb.<br>*The image will be resized to 200x200 pixel after uploaded.*


## **Response:**
#### *Success:*
	Status: 200

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error


## <br><br><a name="serve-avatar"></a>8. Serve avatar image of user:

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


## <br><br><a name="close"></a>9. Close user account:

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