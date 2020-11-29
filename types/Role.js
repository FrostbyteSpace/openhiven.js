module.exports = class Role {
  constructor(client, data={}) {
    this.id = data.user_id;
    this.name = data.name;
    this.color = data.color;
    this.position = data.position;
    this.level = data.level;
    this.allow = data.allow;
    this.deny = data.deny
    this.house = data.house || client.houses.get(data.house_id);
    this.client = client;
  }
}
