const User = require('./User.js');
const Attachment = require('./Attachment.js')
const Collection = require('../djs-collection');

module.exports = class Message {
  constructor(client, data={}) {
    this.id = data.id;
    this.content = data.content;
    this.room = client.rooms.get(data.room_id);
    this.author = client.users.get(data.author_id);
    this.mentions = new Collection();
    if (data.attachment) this.attachment = new Attachment(client, data.attachment);
    if (data.house_id) this.house = client.houses.get(data.house_id);
    if (data.member && this.house) this.member = this.house.members.get(data.member.user_id);
    this.timestamp = data.timestamp;
    this.client = client;

    for (let m in data.mentions) {
      let mention = (this.house ? this.house.members.get(m) : null) || client.users.get(m) || new User(client, data.mentions[m]);
      this.mentions.set(m, mention);
    }
  }


  async edit(content) {
    let res = await this.client.axios.patch(`/rooms/${this.room.id}/messages/${this.id}`, {
      content: content
    });
    if (res.data.success) {
      this.content = content;
      return this;
    }
    return false;
  }

  async read() {
    let res = await this.client.axios.post(`/rooms/${this.room.id}/messages/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async delete() {
    let res = await this.client.axios.delete(`/rooms/${this.room.id}/messages/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }
}
