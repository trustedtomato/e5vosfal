const { EmbeddedDocument } = require('marpat');

module.exports = class Rating extends EmbeddedDocument {
  constructor() {
    super();

    this.value = {
      type: Number,
      choices: [-1, 1]
    };
  }
}