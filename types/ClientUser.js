const User = require('./User.js');
const Message = require('./Message.js');
const Collection = require('../djs-collection');

module.exports = class ClientUser extends User {
  constructor(client, data={user:{}}) {
    super(client, data.user);

    this.relationships = new Collection();
    if (data.relationships) {
      for (let r in data.relationships) {
        let relationship = new User(client, data.relationships[r].user);
        relationship.relationship_type = data.relationships[r].type;
        this.relationships.set(r, relationship);
      }
    }
  }


  get friends() { return this.relationships.filter(r => r.relationship_type===3)}
  get blocked() { return this.relationships.filter(r => r.relationship_type===5)}
  get restricted() { return this.relationships.filter(r => r.relationship_type===4)}
  get friend_requests() { return this.relationships.filter(r => [1,2].includes(r.relationship_type))}

  async edit(data) {
    const res = await this.client.axios.patch(`/users/@me`, data);
    if (res.data.success) {
      super._update(res.data.data);
      return this;
    }
    return false;
  }

  async update() {
    const res = await this.client.axios.get(`/users/@me`);
    if (res.data.success) {
      super._update(res.data.data);
      return this;
    }
    return false;
  }

  async mentions() {
    const res = await this.client.axios.get(`/streams/@me/mentions`);
    if (res.data.success) {
      const mentions = [];
      for (let m of res.data.data) {
        mentions.push(new Message(this.client, m));
      }
      return mentions;
    }
    return false;
  }
}
