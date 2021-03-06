const HouseRoom = require('./HouseRoom.js');
const Member = require('./Member.js');
const Role = require('./Role.js');
const Category = require('./Category.js');
const Invite = require('./Invite.js');
const Collection = require('../djs-collection');

module.exports = class House {
  constructor(client, data={}) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.banner = data.banner;
    this.rooms = new Collection();
    this.roles = new Collection();
    // this.members = new Collection();
    this.categories = new Collection();
    this.client = client;

    if (data.roles) {
      for (let r of data.roles) {
        const role = new Role(client, {...r, house: this});
        this.roles.set(r.id, role);
      }
    }
    // if (data.members) {
    //   for (let m of data.members) {
    //     let member = new Member(client, {...m, house: this});
    //     this.members.set(member.id, member);
    //     if (!client.users.has(member.id)) client.users.set(member.id, member.user);
    //   }
    // }
    if (data.rooms) {
      for (let r of data.rooms) {
        const room = new HouseRoom(client, {...r, house: this});
        this.rooms.set(room.id, room);
      }
    }
    if (data.entities) {
      for (let e of data.entities) {
        if (e.type === 1) {
          const entity = new Category(client, {...e, house: this });
          this.categories.set(entity.id, entity);
        }
      }
    }
  }



  async createCategory(name) {
    const res = await this.client.axios.post(`/houses/${this.id}/entities`, {
      name: name,
      type: 1
    });
    if (res.data.success) {
      for (let e of res.data.data.entities) {
        if (e.resource_type === 1 && !this.categories.has(e.id)) {
          const entity = new Category(this.client, e);
          this.categories.set(e.id, entity);
          return entity;
        }
      }
    }
    return false;
  }

  async createRoom(name, parent=(this.categories.find(cat=>cat.name=='Rooms') || this.categories.first()).id ) {
    parent = (typeof parent == 'string' ? parent : parent.id);
    const res = await this.client.axios.post(`/houses/${this.id}/rooms`, {
      name: name,
      parent_entity_id: parent
    });
    if (res.data.success) {
      const room = new HouseRoom(this.client, res.data.data);
      this.rooms.set(room.id, room);
      this.client.rooms.set(room.id, room);
    }
    return false;
  }

  async createInvite(max_uses, max_age) {
    const res = await this.client.axios.post(`/houses/${this.id}/invites`, {
      max_uses: max_uses || 0,
      max_age: max_age || 0
    });
    if (res.data.success) {
      return new Invite(this.client, res.data.data);
    }
    return false;
  }

  async edit(name, icon) {
    const res = await this.client.axios.patch(`/houses/${this.id}`, {
      name: name,
      icon: icon || null
    });
    if (res.data.success) {
      this.name = name;
      return this;
    }
    return false;
  }

  async leave() {
    const res = await this.client.axios.delete(`/users/@me/houses/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      this.client.houses.delete(this.id);
      delete this;
      return true;
    }
    return false;
  }

  async delete() {
    const res = await this.client.axios.delete(`/houses/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      this.client.houses.delete(this.id);
      delete this;
      return true;
    }
    return false;
  }

  _update(data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.banner = data.banner;

    return this;
  }

  _updateEntities(data) {
    if (data.entities) {
      const categories = new Collection();
      for (let e of data.entities) {
        if (e.type === 1) {
          const entity = this.categories.get(e.id) || new Category(this.client, e);
          categories.set(entity.id, entity);
        }
      }
      this.categories = categories;
    }
    return this;
  }
}
