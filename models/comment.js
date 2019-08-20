const { Schema, model } = require('mongoose');
const Vote = require('./vote');

const Comment = new Schema({
  content: { type: String, required: true },
  votes: { type: [{ type: Schema.Types.ObjectId, ref: Vote }], default: [] },
});

Comment.virtual('rating').get(function getRating() {
  this.populate('votes');
  return this.votes.reduce((rating, vote) => rating + vote.value, 0);
});

module.exports = model('Comment', Comment);
