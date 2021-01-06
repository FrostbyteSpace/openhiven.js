const Client = require('./Client.js');
const Command = require('../lib/Command.js');

const XRegExp = require('xregexp');
const Collection = require('../djs-collection');
const fs = require('fs');
const Path = require('path');

module.exports = class Bot extends Client {
  constructor(options) {
    options.type = options.type || 'bot';
    super(options);

    this.createTime = Date.now();

    this.prefix = options.prefix;
    this.owner = options.owner;

    if (options.commands) {
      this._commands = new Collection();
      this._loadCommands(options.commands);
    }

    this.onMessage = options.on_message || Bot._OnMessage;
    this.onInit = options.on_init || Bot._OnInit;

    this.on('message', message => {
      message.client = this;
      this.onMessage(message);
    });
    this.once('init', async () => {
      if (this.options.type == 'user') this.owner = this.user;
      if (typeof this.owner == 'string') this.owner = this.users.resolve(this.owner);
      this.onInit(this);
    });
  }



  _loadCommands(commands) {
    switch (commands.constructor) {
      case Command:
        this._commands.set(commands.name, commands);
        break;
      case Array:
        for (command of commands) {
          this._loadCommands(command);
        }
        break;
      case String:
        const path = (Path.isAbsolute(commands) ? commands : Path.join(process.cwd(), commands));
        if (!fs.existsSync(path)) return;
        var files = fs.readdirSync(path);
        for (var file of files) {
          file = Path.join(path, file);
          if (fs.lstatSync(file).isFile()) {
            try {
              const command = require(file);
              this._commands.set(command.name, command);
              this._log(`loaded ${command.name}`.brightGreen, 1);
            } catch (e) {
              this._log(`failed loading ${file}!`.brightRed, 1);
              this._log(e, 2);
            }
          }
        }
        break;
      default:
        var e = new Error('options.commands can only be a string or a OpenHiven.Command, or an array of those.');
    }
  }



  get commands() {
    return this._commands;
  }
  set commands(command) {
    this._loadCommands(command);
  }



  static async _OnInit() {
    const file = await (async () => fs.readFileSync(Path.join(__dirname, '../hiven.ascii'), 'utf8'))();
    this.connectTime = Date.now() - this.createTime;
    this._log(`${file.white}Connected in ${(this.connectTime+'ms').brightGreen}`, 1);
  }



  static async _OnMessage(message) {
    const prefixRegex = XRegExp(`^(<@!?${this.user.id}>|${XRegExp.escape(this.prefix)})\\s*`);
  	if (!prefixRegex.test(message.content)) return;
  	const [, prefix] = message.content.match(prefixRegex);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this._commands.get(commandName) || this._commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
      const res = await command.execute(message, args);
      if (typeof res == 'string') message.room.send(res);
    } catch (e) {
      this._log(`An error occured trying to execute command '${command.name}'`, 1);
      this._log(e, 2);
    }
  }



  static Selfbot = class Selfbot extends Bot {
    constructor(options) {
      options.type = 'user';
      super(options);
    }
  }
}
