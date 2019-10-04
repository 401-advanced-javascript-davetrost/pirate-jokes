const mongoose = require('mongoose');
const { Schema } = mongoose;

const jokeSchema = new Schema({
  joke: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Joke', jokeSchema, 'jokes');
