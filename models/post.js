const { Document, EmbeddedDocument } = require('marpat');
const slug = require('slug');

class Comment extends EmbeddedDocument {
  constructor() {
    super();
  }
};

module.exports = class Post extends Document {
  constructor() {
    super();

    this.urlSlug = { type: String, required: true, unique: true };
    this.summary = { type: String, required: true };
    this.content = { type: String };
    this.comments = { type: [Comment], default: [] };
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
};