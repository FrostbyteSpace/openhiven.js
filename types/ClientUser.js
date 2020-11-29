const User = require('./User.js');
const Collection = require('../djs-collection');

module.exports = class ClientUser extends User {
  constructor(client, data={}, friends) {
    super(client, data);

    this.friends = new Collection();
    if (friends) {
      for (let f in friends) {
        let friend = new User(client, friends[f].data);
        client.users.set(f, friend);
        this.friends.set(f, friend);
      }
    }
  }



  async editName(name) {
    let res = await this.client.axios.patch(`/users/@me`, {
      name: name
    });
    if (res.data.success) {
      this.name = name;
      return this;
    }
    return false;
  }

  async editBio(bio) {
    let res = await this.client.axios.patch(`/users/@me`, {
      bio: bio
    });
    if (res.data.success) {
      this.bio = bio;
      return this;
    }
    return false;
  }

  async editIcon(icon) {
    let res = await this.client.axios.patch(`/users/@me`, {
      icon: icon
    });
    if (res.data.success) {
      this.icon = res.data.data.icon;
      return this;
    }
    return false;
  }

  async editHeader(header) {
    let res = await this.client.axios.patch(`/users/@me`, {
      header: header
    });
    if (res.data.success) {
      this.header = res.data.data.header;
      return this;
    }
    return false;
  }

  async editWebsite(website) {
    let res = await this.client.axios.patch(`/users/@me`, {
      website: website
    });
    if (res.data.success) {
      this.website = website;
      return this;
    }
    return false;
  }

  async editLocation(location) {
    let res = await this.client.axios.patch(`/users/@me`, {
      location: location
    });
    if (res.data.success) {
      this.location = location;
      return this;
    }
    return false;
  }

  async editAccount(data) {
    let res = await this.client.axios.patch(`/users/@me`, data);
    if (res.data.success) {
      let d = res.data.data;
      this.name = d.name;
      this.bio = d.bio;
      this.icon = d.icon;
      this.header = d.header;
      this.website = d.website;
      this.location = d.location;
      return this;
    }
    return false;
  }
}
