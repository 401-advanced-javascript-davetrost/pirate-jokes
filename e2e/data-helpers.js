const request = require('./request');

const testUser = {
  email: 'me@me.com',
  password: 'abc'
};

function signupUser(user = testUser) {
  return request
    .post('/api/auth/signup')
    .send(user)
    .expect(200)
    .then(({ body }) => body);
}

const joke = {
  joke:
    'What do you call a pirate with two eyes, two hands and two legs? - A beginner.'
};

function postJokeAsUser(user) {
  return request
    .post('/api/jokes')
    .set('Authorization', user.token)
    .send(joke)
    .expect(200);
}

function getFromPathAsUser(path, user, status = 200) {
  return request
    .get(path)
    .set('Authorization', user.token)
    .expect(status);
}

module.exports = {
  signupUser,
  postJokeAsUser,
  getFromPathAsUser
};

