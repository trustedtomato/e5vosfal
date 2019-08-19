const { EmbeddedDocument } = require('marpat');

module.exports = class Comment extends EmbeddedDocument {
  constructor() {
    super();

    this.content = { type: String, required: true };
    this.ratings = [Rating];
  }
};