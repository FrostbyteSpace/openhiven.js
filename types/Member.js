const User = require('./User.js');
const Collection = require('../djs-collection');

module.exports = class Member {
  constructor(client, data={}) {
    this.id = data.user_id;
    this.roles = new Collection();
    this.presence = data.presence;
    this.joined = data.joined_at;
    this.user = client.users.get(data.user.id) || new User(client, data.user);
    this.house = data.house || client.houses.get(data.house_id);
    this.client = client;

    if (data.roles) {
      for (let r of data.roles) {
        this.roles.set(r.id, this.house.roles.get(r.id));
      }
    }
  }
}
