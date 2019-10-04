const request = require('../request');
const db = require('../db');
const { signupUser, postJokeAsUser, getFromPathAsUser } = require('../data-helpers');

describe('Jokes from the ARRRDB', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('jokes'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  it('posts a joke for this user', () => {
    return postJokeAsUser(user).then(({ body }) => {
      expect(body.owner).toBe(user._id);
      expect(body).toMatchInlineSnapshot(
        {
          _id: expect.any(String),
          owner: expect.any(String)
        },
        `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "joke": "What do you call a pirate with two eyes, two hands and two legs? - A beginner.",
              "owner": Any<String>,
            }
          `
      );
    });
  });

  it('does not get jokes if the user has a bad token', () => {
    return postJokeAsUser(user).then(() => {
      const badUser = {
        ...user,
        token: 'bad-token'
      };
      return getFromPathAsUser('/api/jokes', badUser, 401).then(({ body }) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "error": "Invalid Token",
          }
        `);
      });
    });
  });

  it('gets jokes', () => {
    return postJokeAsUser(user).then(() => {
      return getFromPathAsUser('/api/jokes', user).then(({ body }) => {
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String)
          },
          `
            Object {
              "_id": Any<String>,
              "joke": "What do you call a pirate with two eyes, two hands and two legs? - A beginner.",
            }
          `
        );
      });
    });
  });

  it('gets a joke', () => {
    return postJokeAsUser(user).then(({ body }) => {
      return getFromPathAsUser(`/api/jokes/${body._id}`, user).then(
        ({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              owner: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "joke": "What do you call a pirate with two eyes, two hands and two legs? - A beginner.",
              "owner": Any<String>,
            }
          `
          );
        }
      );
    });
  });

  it('modifies a joke', () => {
    return postJokeAsUser(user).then(({ body }) => {
      return request
        .put(`/api/jokes/${body._id}`)
        .set('Authorization', user.token)
        .send({
          joke: 'What subject are pirates best at at school? - Arrrrt.'
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              owner: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "joke": "What subject are pirates best at at school? - Arrrrt.",
              "owner": Any<String>,
            }
          `
          );
        });
    });
  });

  it('deletes a joke', () => {
    return postJokeAsUser(user).then(({ body }) => {
      return request
        .delete(`/api/jokes/${body._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              owner: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "joke": "What do you call a pirate with two eyes, two hands and two legs? - A beginner.",
              "owner": Any<String>,
            }
          `
          );
        });
    });
  });

  it('does not modify another user\'s joke', () => {
    return postJokeAsUser(user).then(({ body }) => {
      const anotherUser = {
        email: 'person@p.com',
        password: 'abc',
      };
      return signupUser(anotherUser).then(anotherUser => {
        return request
          .put(`/api/jokes/${body._id}`)
          .set('Authorization', anotherUser.token)
          .send({
            joke: 'What subject are pirates best at at school? - Arrrrt.'
          })
          .expect(200)
          .then(({ body }) => {
            expect(body).toBe(null);
          });
      });
    });
  });
  
  it('does not delete another user\'s joke', () => {
    return postJokeAsUser(user).then(({ body }) => {
      const anotherUser = {
        email: 'person@p.com',
        password: 'abc',
      };
      return signupUser(anotherUser).then(anotherUser => {
        return request
          .delete(`/api/jokes/${body._id}`)
          .set('Authorization', anotherUser.token)
          .expect(200)
          .then(({ body }) => {
            expect(body).toBe(null);
          });
      });
    });
  });

});
