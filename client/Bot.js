const Client = require('./Client.js');
const Command = require('../lib/Command.js');
const Util = require('../lib/Util.js');

const Collection = require('../djs-collection');
const fs = require('fs');
const Path = require('path');

module.exports = class Bot extends Client {
  constructor(options) {

    super(options)

    this.prefix = options.prefix;
    this.owner = options.owner;

    if (options.commands) {
      this._commands = new Collection();
      this._loadCommands(options.commands);
    }

    this.onMessage = options.on_message || this._OnMessage;
    this.onInit = options.on_init || this._OnInit;

    this.on('message', message => {
      message.client = this;
      this.onMessage(message);
    });
    this.once('init', async () => {
      if (this.options.type == 'user') this.owner = this.user;
      if (typeof this.owner == 'string') this.owner = this.users.resolve(this.owner);
      this.onInit();
    });
  }



  _loadCommands(commands) {
    if (commands instanceof Command) {
      this._commands.set(commands.name, commands);
    }
    else if (typeof commands == 'array') {
      for (command of commands) {
        this._loadCommands(command);
      }
    }
    else if (typeof commands == 'string') {
      let path = (Path.isAbsolute(commands) ? commands : Path.join(process.cwd(), commands));
      if (!fs.existsSync(path)) return;
      var files = fs.readdirSync(path);
      for (var file of files) {
        file = Path.join(path, file);
        if (fs.lstatSync(file).isFile()) {
          this._log(`loading ${file}`.gray);
          var command = require(file);
          this._commands.set(command.name, command);
        }
      }
    }
    else {
      var e = new Error('options.commands can only be a string or a EasyHiven.Command, or an array of either of those.');
      e.name = 'TypeError';
      return e;
    }
  }



  get commands() {
    return this._commands;
  }
  set commands(command) {
    this._loadCommands(command);
  }



  async _OnInit() {
    this._log('ready!'.brightGreen);
  }



  async _OnMessage(message) {
    const prefixRegex = new RegExp(`^(<@!?${this.user.id}>|${Util.EscapeRegex(this.prefix)})\\s*`);
  	if (!prefixRegex.test(message.content)) return;
  	let [, prefix] = message.content.match(prefixRegex);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this._commands.get(commandName) || this._commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
      let res = await command.execute(message, args);
      if (typeof res == 'string') message.room.send(res);
    } catch (e) {
      console.log(e);
    }
  }



  static Selfbot = class Selfbot extends Bot {
    constructor(options) {
      options.type = 'user';
      super(options);
    }
  }
}