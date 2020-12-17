module.exports = class User {
  constructor(client, data={}) {
    this.client = client;
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.user_flags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.email_verified = data.email_verified;
    this.relationship_type = 0;
  }

  _update(data) {
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.user_flags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.email_verified = data.email_verified;
  }
}
