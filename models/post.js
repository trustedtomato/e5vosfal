const { Document } = require('marpat');

module.exports = class Post extends Document {
  constructor () {
    super();

    this.slug = { type: String, required: true };
    this.summary = { type: String, required: true };
    this.content = { type: String, required: true };
  }
};