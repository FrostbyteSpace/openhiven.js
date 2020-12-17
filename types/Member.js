const User = require('./User.js');
const Collection = require('../djs-collection');

module.exports = class Member {
  constructor(client, data={}) {
    this.id = data.user_id;
    this.roles = new Collection();
    this.presence = data.presence;
    this.joined = data.joined_at;
    this.user = new User(client, data.user);
    this.house = data.house || client.houses.get(data.house_id);
    this.client = client;

    if (data.roles) {
      for (let r of data.roles) {
        this.roles.set(r.id, this.house.roles.get(r.id));
      }
    }
  }

  // _update (data) {
  //   for (let r of this.roles.array()) {
  //     if (!data.roles.has(r.id)) this.roles.delete(r.id);
  //   }
  //   for (let r of data.roles) {
  //     if (!this.roles.has(r.id)) this.roles.set(r.id, this.house.roles.get(r.id));
  //   }
  //   this.presence = data.presence;
  // }
}
