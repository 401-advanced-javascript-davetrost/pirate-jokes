const router = require('express').Router();
const User = require('../models/user');

router
  .get('/favorites', ({ user }, res, next) => {
    User.findById(user.id)
      .populate('favorites', 'joke')
      .lean()
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .put('/favorites/:jokeId', ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $addToSet: {
        favorites: params.jokeId
      }
    })
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .delete('/favorites/:jokeId', ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $pull: {
        favorites: params.jokeId
      }
    })
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

; /*end of router*/

module.exports = router;