const { Document, EmbeddedDocument } = require('marpat');
const slug = require('slug');

class Rating extends EmbeddedDocument {
  constructor() {
    super();

    this.value = {
      type: Number,
      choices: [-1, 1]
    };
  }
}

class Comment extends EmbeddedDocument {
  constructor() {
    super();

    this.content = { type: String, required: true };
    this.ratings = [Rating];
  }
};

module.exports = class Post extends Document {
  constructor() {
    super();

    this.urlSlug = { type: String, required: true, unique: true };
    this.summary = { type: String, required: true };
    this.content = { type: String };
    this.comments = { type: [Comment], default: [] };
    this.ratings = [Rating];
  }

  static async getUrlSlug(summary) {
    const urlSlug = slug(summary).toLowerCase();
    if (!await this.findOne({ urlSlug })) {
      return urlSlug;
    }
    for (let i = 2;; i++) {
      const numberedUrlSlug = `${urlSlug}-${i}`;
      if (!await this.findOne({ urlSlug: numberedUrlSlug })) {
        return numberedUrlSlug;
      }
    }
  }

  getRating() {
    return this.ratings.reduce(
      (rating, ratingSum) => ratingSum + rating.value,
      0
    );
  }
};