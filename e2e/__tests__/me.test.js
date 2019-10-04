const request = require('../request');
const db = require('../db');
const { signupUser, postJokeAsUser, favoriteJokeIdAsUser, getfavoritesAsUser, removeFavoriteJokeIdAsUser } = require('../data-helpers');

describe('User favorites  ARRRDB', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('jokes'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  let jokeId = '';
  beforeEach(() => {
    return postJokeAsUser(user).then(({ body }) => (jokeId = body._id));
  });

  it('favorites a joke for this user', () => {
    return favoriteJokeIdAsUser(jokeId, user).then(({ body }) => {
      expect(body[0]).toBe(jokeId);
    });
  });

  it('gets the user\'s favorites', () => {
    return favoriteJokeIdAsUser(jokeId, user)
      .then(() => getfavoritesAsUser(user))
      .then(({ body }) => {
        expect(body[0]).toMatchInlineSnapshot(
          `
          Object {
            "_id": "${jokeId}",
            "joke": "What do you call a pirate with two eyes, two hands and two legs? - A beginner.",
          }
        `
        );
      });
  });

  it('deletes a user favorite', () => {
    return favoriteJokeIdAsUser(jokeId, user)
      .then(() => removeFavoriteJokeIdAsUser(jokeId, user))
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});
