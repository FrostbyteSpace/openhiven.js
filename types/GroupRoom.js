const BaseRoom = require('./BaseRoom.js');
const Collection = require('../djs-collection');
const User = require('./User.js');

module.exports = class HouseRoom extends BaseRoom {
  constructor(client, data) {
    super(client, data);
    this.name = data.name;
    this.description = data.description;
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

  async add(user) {
    if (user instanceof User) user = user.id;
    const res = await this.client.axios.put(`/rooms/${this.id}/recipients/${user}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async remove(user) {
    if (user instanceof User) user = user.id;
    const res = await this.client.axios.delete(`/rooms/${this.id}/recipients/${user}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async edit(name) {
    const res = await this.client.axios.patch(`/rooms/${this.id}`, {
      name: name,
    });
    if (res.data.success) {
      this.name = name;
    }
    return false;
  }

  async leave() {
    const res = await this.client.axios.delete(`/users/@me/rooms/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  _update(data) {
    this.name = data.name;
    this.description = data.description;

    if (data.recipients) {
      const recipients = new Collection();
      for (let r in data.recipients) {
        const recipient = this.recipients.get(r) || new User(this.client, data.recipients[r]);
        recipients.set(r, recipient);
      }
      this.recipients = recipients;
    }

    return this;
  }
}
