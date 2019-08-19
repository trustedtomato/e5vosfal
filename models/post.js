const { Document } = require('marpat');

module.exports = class Post extends Document {
  constructor () {
    super();
    this.summary = String;
    this.content = String;
    
  }
};