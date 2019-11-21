# Endpoint list:
| | Method | Url | Required Auth | Purpose |
| :-: | :- | :- | :-: | :- |
| 1 | POST | /categories | ✅ | [Create a category](#create)
| 2 | GET | /categories | ✅ | [Get category list](#get-list)
| 3 | GET | /categories/:id | ✅ | [Get a category](#get)
| 4 | PUT | /categories/:id | ✅ | [Update a category](#update)
| 5 | DELETE | /categories/:id | ✅ | [Delete a category](#delete)
| 6 | POST | /categories/:id/dishes | ✅ | [Create a dish for the category](#create-dish)

# <br>Endpoint documents:

## <a name="create"></a>1. Create a category:

## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /categories

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Body:*
The body is a json:

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String | ✅ | Max length is 50 digits

## **Response:**
#### *Success:*
	Status: 201
	Body: <Object>

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error



## <br><br><a name="get-list"></a>2. Get categories list:

## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /categories

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Parameters:*

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String |  | Find by name
| full | Boolean |  | **The case of *true*:**<br>All of dishes belong to the category will be retrieved beside the category data<br>**The case of *false* or isn't setted:**<br>Only category data will be retrieved
| publishedDishes | Boolean |  | **Only Parameter.full is true**
| limit | Number | | Limit of categories will be returned
| skip | Number | | Number of categories will be skipped
| sortBy | String | | - The value has a format like this:<br>sortBy=&lt;field&gt;:&lt;asc/desc&gt;<br>- The case of ASC sorting, the syntax can like this:<br>sortBy=&lt;field&gt;<br>- The fields are allowed to sort: <br>```name```<br>```createdAt```<br>```updatedAt```


## **Response:**
#### *Success:*
	Status: 200
	Body: <Array>
	[
		<Object>
		{
			... all fields of category,
			dishes: <Array> - This field is exist when Parameter.full is true
		}
	]

#### *Error:*
	Status: 400 - When query field is invalid
	Body: <Object> error message

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404 - There has no category is found

	Status: 500



## <br><br><a name="get"></a>3. Get a category:

## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /categories/:id

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200
	Body:  <Object> - The object has a property is dishes that contain all dishes is published of the category

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404 - There has no category is found

	Status: 500



## <br><br><a name="update"></a>4. Update a category:

## **Request:**
#### *Endpoint:*
	Method: PUT
	Url: /categories/:id

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Body:*
The body is a json:

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String | | Max length is 50 digits

## **Response:**
#### *Success:*
	Status: 200
	Body: <Object>

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404 - When the category can't be found



## <br><br><a name="delete"></a>5. Delete a category:

## **Request:**
#### *Endpoint:*
	Method: DELETE
	Url: /categories/:id

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

	Status: 404 - when the category can't be found

	Status: 500



## <a name="create-dish"></a>6. Create a dish for the category:

## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /categories/:id/dishes

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Body:*
The body is a json:

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String | ✅ | Max length is 50 digits
| description | String | | Default is empty string.<br>Max length is 300 digits
| price | Number | | Default is 0.<br>Max length is 7 digits.<br>Min value is 0
| published | Boolean | | Default is *true*

## **Response:**
#### *Success:*
	Status: 201
	Body: <Object>

#### *Error:*
	Status: 400
	Body: <Object> error content

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error