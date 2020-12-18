module.exports = class User {
  constructor(client, data={}) {
    this.client = client;
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.userFlags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.emailVerified = data.email_verified;
    this.relationship_type = 0;
  }


  async mutuals() {
    const res = await this.client.axios.get(`/relationships/${this.id}/mutual-friends`);
    if (res.data.success) {
      const mutuals = [];
      for (let m of res.data.data) {
        mutuals.push(new User(this.client, m));
      }
      return mutuals;
    }
    return false;
  }

  async unfriend() {
    if (!this.client.user.friends.has(this.id)) return;
    const res = await this.client.axios.delete(`/relationships/@me/friends/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async friend() {
    const res = await this.client.axios.post(`/relationships/@me/friend-requests`, {
      user_id: this.id,
    });
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async block() {
    const res = await this.client.axios.put(`/relationships/@me/blocked/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async unblock() {
    const res = await this.client.axios.delete(`/relationships/@me/blocked/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async restrict() {
    const res = await this.client.axios.put(`/relationships/@me/restricted/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async unrestrict() {
    const res = await this.client.axios.delete(`/relationships/@me/restricted/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }

  async cancel() {
    if (!this.client.user.friends.has(this.id)) return;
    const res = await this.client.axios.delete(`/relationships/@me/friend-requests/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }


  _update(data) {
    this.username = data.username;
    this.name = data.name;
    this.icon = data.icon;
    this.header = data.header;
    this.bot = data.bot;
    this.userFlags = data.user_flags;
    this.bio = data.bio;
    this.website = data.website;
    this.location = data.location;
    this.emailVerified = data.email_verified;
  }
}
