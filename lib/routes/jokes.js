const router = require('express').Router();
const Joke = require('../models/joke');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    Joke.create(req.body)
      .then(joke => res.json(joke))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Joke.find()
      .lean()
      .select('joke')
      .then(jokes => res.json(jokes))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Joke.findById(req.params.id)
      .lean()
      .select('joke owner')
      .then(joke => res.json(joke))
      .catch(next);
  })
  .put('/:id', ({ params, body, user }, res, next) => {
    const query = {
      _id: params.id,
      owner: user.id
    };
    Joke.updateOne(query, body)
      .then(joke => res.json(joke))
      .catch(next);
  })
  .delete('/:id', ({ params, user }, res, next) => {
    const query = {
      _id: params.id,
      owner: user.id
    };
    Joke.findOneAndRemove(query)
      .then(joke => res.json(joke))
      .catch(next);
  })
;


module.exports = router;