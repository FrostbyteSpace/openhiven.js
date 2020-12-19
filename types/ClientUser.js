const User = require('./User.js');
const Member = require('./Member.js');
const Message = require('./Message.js');
const Collection = require('../djs-collection');

module.exports = class ClientUser extends User {
  constructor(client, data={user:{}}) {
    super(client, data.user);

    this.relationships = new Collection();
    if (data.relationships) {
      for (let r in data.relationships) {
        let relationship = new User(client, data.relationships[r].user);
        relationship.relationshipType = data.relationships[r].type;
        this.relationships.set(r, relationship);
      }
    }
  }


  get friends() { return this.relationships.filter(r => r.relationship_type===3)}
  get blocked() { return this.relationships.filter(r => r.relationship_type===5)}
  get restricted() { return this.relationships.filter(r => r.relationship_type===4)}
  get friendRequests() { return this.relationships.filter(r => [1,2].includes(r.relationshipType))}

  async edit(data) {
    const res = await this.client.axios.patch(`/users/@me`, data);
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

  _updateRelationship(data) {
    const relationship = this.relationships.get(data.user.id) || new User(this.client, data.user);
    this.relationships.set(relationship.id, relationship);
    relationship.relationshipType = data.type;
    return relationship;
  }
}
