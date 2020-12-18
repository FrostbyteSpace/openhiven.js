const BaseRoom = require('./BaseRoom.js');
const Collection = require('../djs-collection');
const User = require('./User.js');
const Member = require('./Member.js');

module.exports = class HouseRoom extends BaseRoom {
  constructor(client, data) {
    super(client, data);
    this.name = data.name;
    this.description = data.description;
    this.recipients = new Collection();

    if (this.recipients) {
      for (let r in data.recipients) {
        let recipient = new User(client, data.recipients[r]);
        this.recipients.set(r, recipient);
      }
    }
  }

  async call() {
    let res = await this.client.axios.post(`/rooms/${this.id}/call`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async declineCall() {
    let res = await this.client.axios.post(`/rooms/${this.id}/call/decline`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async addUser(user) {
    if (user instanceof User || user instanceof Member) user = user.id;
    let res = await this.client.axios.put(`/rooms/${this.id}/recipients/${user}`);
  }

  async leave() {
    let res = await this.client.axios.delete(`/users/@me/rooms/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }
}
