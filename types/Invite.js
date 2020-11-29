module.exports = class Invite {
  constructor(client, data) {
    this.code = code;
    this.created_at = data.created_at;
    this.max_age = data.max_age;
    this.max_uses = data.max_uses;
    this.house = data.house || client.houses.get(data.house_id) || null;
    this.creator = this.house.members.get(data.creator);
    this.client = client;
  }
}
