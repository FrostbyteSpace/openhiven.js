const BaseRoom = require('./BaseRoom.js');
const Collection = require('../djs-collection');
const User = require('./User.js');
const Member = require('./Member.js');

module.exports = class DMRoom extends BaseRoom {
  constructor(client, data) {
    super(client, data);
    this.owner = data.owner_id;
    this.recipients = new Collection();

    if (this.recipients) {
      for (let r in data.recipients) {
        const recipient = new User(client, data.recipients[r]);
        this.recipients.set(r, recipient);
      }
    }
  }

  async call() {
    const res = await this.client.axios.post(`/rooms/${this.id}/call`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async declineCall() {
    const res = await this.client.axios.post(`/rooms/${this.id}/call/decline`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async addUser(user) {
    if (user instanceof User || user instanceof Member) user = user.id;
    const res = await this.client.axios.put(`/rooms/${this.id}/recipients/${user}`);
  }
}
