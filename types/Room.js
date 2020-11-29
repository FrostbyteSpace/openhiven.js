const Collection = require('../djs-collection');
const User = require('./User.js');
const Member = require('./member.js');
const Message = require('./Message.js');
const FormData = require('form-data');

module.exports = class Room {
  constructor(client, data={}) {
    this.id = data.id;
    this.type = data.type;
    if (data.name !== null) this.name = data.name;
    if (data.emoji !== null) this.emoji = data.emoji;
    if (data.description !== null) this.description = data.description;
    if (data.position !== null) this.position = data.position;
    if (data.owner_id !== null) this.owner = data.owner_id;
    if (data.recipients !== null) this.recipients = new Collection();
    if (data.house_id !== null) this.house = data.house || client.houses.get(data.house_id);
    if (data.default_permission_override !== null) this.permission = data.default_permission_override;
    if (data.permission_overrides !== null) this.permissions = data.permission_overrides;
    this.last_message = data.last_message_id;
    this.client = client;

    if (this.recipients) {
      for (let r in data.recipients) {
        let rec = data.recipients[r];
        let recipient = client.users.get(r) || new User(client, rec);
        this.recipients.set(r, recipient);
      }
    }
  }



  async send(content) {
    let res = await this.client.axios.post(`/rooms/${this.id}/messages`, {
      content: content
    });
    if (res.data.success) {
      let message = new Message(this.client, res.data.data);
      this.client.messages.set(message.id, message);
      return message;
    }
    return false;
  }

  async file(file, name) {
    let form = new FormData();
    form.append('file', file, name);
    let res = await this.client.axios.post(`/rooms/${this.id}/media_messages`, form);
    if (res.data.success) {
      let message = new Message(this.client, res.data.data);
      this.client.messages.set(message.id, message);
      return message;
    }
    return false;
  }

  async type() {
    let res = await this.client.axios.post(`/rooms/${this.id}/typing`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
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

  async delete() {
    if (!this.house) throw new Error('Can\'t delete direct rooms.');
    let res = await this.client.axios.delete(`/houses/${this.house.id}/rooms/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async leave() {
    if (this.house) throw new Error('Can\'t leave a house room.');
    let res = await this.client.axios.delete(`/users/@me/rooms/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }
}
