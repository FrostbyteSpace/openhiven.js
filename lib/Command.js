const Collection = require('discord.js').Collection;

module.exports = class Command {
  constructor(name, func) {
    this.name = name;
    this.func = func;

    this._cooldowns = new Collection();
  }

  get ownerOnly() {
    this._ownerOnly = true;
    return this;
  }
  get houseOnly() {
    this._houseOnly = true;
    return this;
  }
  // get nsfw() {
  //   this._nsfw = true;
  //   return this;
  // }
  // permissions(perms) {
  //   this._permissions = new Discord.Permissions(perms).freeze();
  //   return this;
  // }
  cooldown(time) {
    this._cooldown = time*1000;
    return this;
  }

  async execute(message, args) {
    if (this._ownerOnly && message.author.id !== message.client.owner.id) return;
    if (this._houseOnly && !message.house) return 'This command can only be used in a house.';
    //if (this._nsfw && message.guild && !message.channel.nsfw) return message.channel.send(Client.Util.Embed(message.client, 'NSFW', 'This command can only be used in an NSFW channel.'));
    // if (this._permissions && message.guild && !message.member.hasPermission(this._permissions)) {
    //   var missing = this._permissions.remove(message.member.permissions).toArray().join('\`\n\`');
    //   message.channel.send(Client.Util.Embed(message.client, 'Missing permissions!', `\`${missing}\``));
    // }
    var timestamp = this._cooldowns.get(message.author.id);
    if (timestamp && Date.now() < timestamp + this._cooldown) {
    	var timeLeft = (timestamp + this._cooldown - Date.now());
    	return `Please wait ${(timeLeft/1000).toFixed(2)}s before using \`${this.name}\` again.`;
    }

    try {
      this._cooldowns.set(message.author.id, Date.now());
      setTimeout(()=>{this._cooldowns.delete(message.author.id)}, this._cooldown)
      return await this.func(message, args);
    } catch (e) {
      throw e;
    }
  }
}
