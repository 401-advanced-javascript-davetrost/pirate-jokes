# pirate-jokes (aka: the ARRDB)

## Models

### `User`
Represents a user account, enables signup/signin, hashes passwords, provides and validates user tokens. 
- Has a `favorites` list with `ObjectId` references to Jokes documents

### `Joke`
A collection of pirate-themed jokes. 
- Has an `owner` property that is an `ObjectId` reference to a `User` document

## Routes

### `auth`
This is a standard `auth` router, based on the material from lecture
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/verify`

### `me`
This is the route for user-specific data, in the case of this project, it is for a user's favorited pirate jokes
- `GET /api/me/favorites`
  - Populate favorites on user model
  - Return favorites property as response
- `PUT /api/me/favorites/:id`
  - "Add to Set" id to user favorites
  - Return new favorites array from user model
- `DELETE /api/me/favorites/:id`
  - "Pull" id from user favorites
  - Return new favorites array from user model

### `jokes`
A router with CRUD for pirate jokes
- `POST /api/jokes`
  - Add the authenticated user's id as the `owner` property
- `PUT and DELETE` `/api/jokes/:id`
  - Only the `owner` of the joke is authorized to put or delete. The user's authenticated id must match the owner field.
- `GET /api/jokes`
  - List of all jokes, any authenticated user can access.
