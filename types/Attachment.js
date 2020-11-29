module.exports = class Attachment {
  constructor(client, data) {
    this.filename = data.filename;
    this.url = data.media_url;
    if (data.dimensions) {
      this.dimensions = { width: data.dimensions.width, height: data.dimensions.height };
      this.type = data.dimensions.type;
    }
    this.client = client;
  }
}
