const { Schema, model } = require('mongoose');
const slug = require('slug');
const Comment = require('./comment');
const Vote = require('./vote');

const Post = new Schema({
  urlSlug: { type: String, unique: true },
  summary: { type: String, required: true },
  content: { type: String },
  comments: { type: [{ type: Schema.Types.ObjectId, ref: Comment }], default: [] },
  votes: { type: [{ type: Schema.Types.ObjectId, ref: Vote }], default: [] },
});

Post.virtual('rating').get(function getRating() {
  this.populate('votes');
  return this.votes.reduce((rating, vote) => rating + vote.value, 0);
});

Post.statics.getUrlSlug = async function getUrlSlug(summary) {
  const urlSlug = slug(summary).toLowerCase();
  if (!await this.findOne({ urlSlug })) {
    return urlSlug;
  }
  // eslint-disable-next-line no-constant-condition
  for (let i = 2; true; i += 1) {
    const numberedUrlSlug = `${urlSlug}-${i}`;
    // eslint-disable-next-line no-await-in-loop
    if (!await this.findOne({ urlSlug: numberedUrlSlug })) {
      return numberedUrlSlug;
    }
  }
};

module.exports = model('Post', Post);
