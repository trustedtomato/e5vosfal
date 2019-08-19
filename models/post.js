const { Document } = require('marpat');
const slug = require('slug');

module.exports = class Post extends Document {
  constructor() {
    super();

    this.urlSlug = { type: String, required: true, unique: true };
    this.summary = { type: String, required: true };
    this.content = { type: String, required: true };
  }
  static getUrlSlug(summary) {
    const postSlug = slug(summary).toLowerCase();
    if (posts([
      R.has(postSlug),
      R.not
    ])) {
      return postSlug;
    }
    for (let i = 2;; i++) {
      const numberedPostSlug = `${postSlug}-${i}`;
      if (posts([
        R.has(numberedPostSlug),
        R.not
      ])) {
        return numberedPostSlug;
      }
    }
  } 
};