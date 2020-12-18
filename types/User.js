module.exports = class User {
  constructor(client, data={}) {
    this.client = client;
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.userFlags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.emailVerified = data.email_verified;
    this.relationship_type = 0;
  }


  async mutuals() {
    const res = await this.client.axios.get(`/relationships/${this.id}/mutual-friends`);
    if (res.data.success) {
      const mutuals = [];
      for (let m of res.data.data) {
        mutuals.push(new User(this.client, m));
      }
      return mutuals;
    }
    return false;
  }


  _update(data) {
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.userFlags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.emailVerified = data.email_verified;
  }
}
