const Collection = require('../djs-collection');
const User = require('./User.js');
const Member = require('./Member.js');
const Message = require('./Message.js');
const FormData = require('form-data');

module.exports = class Room {
  constructor(client, data={}) {
    this.id = data.id;
    this.type = data.type;
    if (data.default_permission_override !== null) this.permission = data.default_permission_override;
    if (data.permission_overrides !== null) this.permissions = data.permission_overrides;
    this.last_message = data.last_message_id;
    this.client = client;
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

  async settings(options) {
    let res = await this.client.axios.put(`/users/@me/settings/room_overrides/${this.id}`, {
      notification_preference: options.notifications,
    });
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  _update(data) {
    if (data.default_permission_override !== null) this.defaultPermissions = data.default_permission_override;
    if (data.permission_overrides !== null) this.permissions = data.permission_overrides;
    this.last_message = data.last_message_id;
    
    return this;
  }
}
