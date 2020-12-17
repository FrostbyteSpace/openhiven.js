const Collection = require('../djs-collection');

module.exports = class Category {
  constructor(client, data) {
    this.id = data.id;
    this.position = data.position;
    this.rooms = new Collection();
    this.house = data.house || client.houses.get(data.house_id);
    this.client = client;

    if (data.resource_pointers) {
      for (let p of data.resource_pointers) {
        if (p.resource_type === 'room') {
          this.rooms.set(p.resource_id, this.house.rooms.get(p.resource_id));
          this.house.rooms.get(p.resource_id).category = this;
        }
      }
    }
  }

  get empty() {
    return (!this.rooms.size);
  }

  async delete(force=false) {
    if (!this.empty) {
      if (!force) throw new Error('Please empty the category before deleting, or force delete it.');
      for (let r of this.rooms.array()) { await r.delete() }''
    }
    let res = await this.client.axios.delete(`/houses/${this.house.id}/entities/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      this.house.categories.delete(this.id);
      delete this;
      return true;
    }
    return false;
  }
}
