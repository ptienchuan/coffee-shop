# Endpoint list:
| Method | Url | Required Auth | Purpose |
| :- | :- | :-: | :- |
| POST | /users |  | Create a user
| POST | /users/login |  | Login user
| GET | /users/me | ✅ | Get profile of user
| PUT | /users/me | ✅ | Update profile of user
| POST | /users/logout | ✅ | Logout user
| POST | /users/logoutAll | ✅ | Logout all divice of user
| POST | /users/me/avatar | ✅ | Upload avatar image of user
| GET | /users/me/avatar | ✅ | Serve avatar image of user
| POST | /users/close | ✅ | Close user's account