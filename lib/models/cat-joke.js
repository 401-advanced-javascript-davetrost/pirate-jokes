const mongoose = require('mongoose');
const { Schema } = mongoose;

const catJokeSchema = new Schema({
  joke: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('CatJoke', catJokeSchema, 'catjokes');
