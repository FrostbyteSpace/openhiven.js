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
  }
}
