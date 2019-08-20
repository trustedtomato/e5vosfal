const { Schema, model } = require('mongoose');

const validVotes = [-1, 1];

const Vote = new Schema({
  value: {
    type: Number,
    validate: {
      validator: (x) => validVotes.includes(x),
    },
  },
});

module.exports = model('Vote', Vote);
