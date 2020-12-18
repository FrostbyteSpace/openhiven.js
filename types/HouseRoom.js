const BaseRoom = require('./BaseRoom.js');

module.exports = class HouseRoom extends BaseRoom {
  constructor(client, data) {
    super(client, data);
    this.name = data.name;
    this.emoji = data.emoji;
    this.description = data.description;
    this.position = data.position;
    this.house = data.house || client.houses.get(data.house_id);
  }

  async edit(name) {
    let res = await this.client.axios.patch(`/rooms/${this.id}`, {
      name: name,
    });
    if (res.data.success) {
      this.name = name;
    }
    return false;
  }

  async delete() {
    let res = await this.client.axios.delete(`/houses/${this.house.id}/rooms/${this.id}`);
    if ([ 200, 204 ].includes(res.status)) {
      return true;
    }
    return false;
  }
}
