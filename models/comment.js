const { EmbeddedDocument } = require('marpat');
const Rating = require('./rating');

module.exports = class Comment extends EmbeddedDocument {
  constructor() {
    super();

    this.content = { type: String, required: true };
    this.ratings = [Rating];
  }
};