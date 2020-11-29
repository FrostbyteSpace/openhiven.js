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
        }
      }
    }
  }

  async delete(force=false) {
    // check and ?make empty
    let res = await this.client.axios.delete(`/houses/${this.house.id}/entities/${this.id}`);
    this.house.categories.delete(this.id);
    return delete this;
  }
}
