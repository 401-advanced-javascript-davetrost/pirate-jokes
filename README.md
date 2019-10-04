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

## Ensure Role Middleware

### New `Cat Joke` Model
A collection of pirate-cat-themed jokes. 

### Ensure Admin Middleware
This middlware checks the payload.roles and if includes an 'admin' role, the route continues (call next), otherwise the middleware sends an error (statusCode and error message). This middleware is used downstream from ensureAuth so it can read the user payload from req.

### Creation of the first admin
A bootstrap script (npm run nake:admin) uses the user model to directly add the admin role to a provided user id. 

### Changes to Auth Routes
- `PUT /api/auth/users/:id/roles/:role`
  - Add role to user of :id. 
  - User must be an admin to call this route
- `DELETE /api/auth/users/:id/roles/:role`
  - Remove role from user of :id
  - User must be an admin to call this route
  - Disallow a user from removing their own admin role.
- `GET /api/auth/users`
  - User must be an admin to call this route
  - Return _id, email, and roles of all users
- `POST /api/auth/signup`
  - The signup route is modified to ignore any roles properties that are included with the request

### New routes for Cat (Pirate) Jokes
- `POST /api/catjokes`
  - Only a user with an admin role is authorized to post.
- `PUT and DELETE` `/api/catjokes/:id`
  - Only a user with an admin role is authorized to put or delete.
- `GET /api/catjokes`
  - List of all cat-pirate jokes, any authenticated user can access.

### STRETCH: 
Use a sub-router


