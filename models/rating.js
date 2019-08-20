const { Schema, model } = require('mongoose');
const Vote = require('./vote');

const Rating = new Schema({
  votes: { type: [{ type: Schema.Types.ObjectId, ref: Vote }], default: [] },
});

Rating.virtual('value').get((rating, vote) => rating + vote.value, 0);

module.exports = model('Rating', Rating);
