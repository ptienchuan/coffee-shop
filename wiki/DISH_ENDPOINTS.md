# Endpoint list:
| | Method | Url | Required Auth | Purpose |
| :-: | :- | :- | :-: | :- |
| 1 | POST | /dishes | ✅ | [Create a dish](#create)
| 2 | GET | /dishes | ✅ | [Get dishes list](#get-list)
| 3 | GET | /dishes/:id | ✅ | [Get a dish](#get)
| 4 | PUT | /dishes/:id | ✅ | [Update a dish](#update)
| 5 | POST | /dishes/:id/image | ✅ | [Upload dish image](#upload)
| 6 | GET | /dishes/:id/image | ✅ | [Serve dish image](#serve-image)
| 7 | DELETE | /dishes | ✅ | [Delete a dish](#delete)

# <br>Endpoint documents:

## <a name="create"></a>1. Create a dish:

## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /dishes

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
| category | String | | Default is *undefined*<br>The category that the dish belong to<br>The value is *id* of the category

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



## <br><br><a name="get-list"></a>2. Get dishes list:

## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /dishes

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Parameters:*

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String |  | Find by name
| key | String |  | Find by name or description that like the value
| minPrice | Number | | Find all dishes that have price are greater than or equal to the value
| maxPrice | Number | | Find all dishes that have price are less than or equal to the value
| published | Boolean | | Find by published
| category | String | | Find by category id
| limit | Number | | Limit of dishes will be returned
| skip | Number | | Number of dishes will be skipped
| sortBy | String | | The value has a format like this:<br>sortBy=&lt;field&gt;:&lt;asc/desc&gt;<br>The case of ASC sorting, the syntax can like this:<br>sortBy=&lt;field&gt;<br>The fields are allowed sorting:<br>```name```<br>```price```<br>```published```<br>```category```<br>```createdAt```<br>```updatedAt```


## **Response:**
#### *Success:*
	Status: 200
	Body: <Array>
	[
		<Object>
	]

#### *Error:*
	Status: 400 - When query field is invalid
	Body: <Object> error message

	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404 - There has no dish is found

	Status: 500



## <br><br><a name="get"></a>3. Get a dish:

## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /dishes/:id

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>


## **Response:**
#### *Success:*
	Status: 200
	Body:  <Object>

#### *Error:*
	Status: 401 - when token is expired

	Status: 403 - when the user has been closed
	Body: <Object> message error

	Status: 404 - There has no dish is found

	Status: 500



## <br><br><a name="update"></a>4. Update a dish:

## **Request:**
#### *Endpoint:*
	Method: PUT
	Url: /dishes/:id

#### *Headers:*
	Content-Type: application/json
	Authorization: Bearer <token>

#### *Body:*
The body is a json:

| Key | Type | Required | Description
| :- | :- | :-: | :-
| name | String | | Max length is 50 digits
| description | String | | Max length is 300 digits
| price | Number | | Max length is 7 digits.<br>Min value is 0
| published | Boolean | |
| category | String | | The category that the dish belong to<br>The value is *id* of the category

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

	Status: 404 - When the dish can't be found



## <br><br><a name="upload"></a>5. Upload dish image:

## **Request:**
#### *Endpoint:*
	Method: POST
	Url: /dishes/:id/image

#### *Headers:*
	Content-Type: multipart/form-data
	Authorization: Bearer <token>

#### *Body:*

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



## <br><br><a name="serve-image"></a>6. Serve dish image:

## **Request:**
#### *Endpoint:*
	Method: GET
	Url: /dishes/:id/image

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

	Status: 404 - when image of the dish can't be found



## <br><br><a name="delete"></a>7. Delete a dish:

## **Request:**
#### *Endpoint:*
	Method: DELETE
	Url: /dishes/:id

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

	Status: 404 - when the dish can't be found

	Status: 500