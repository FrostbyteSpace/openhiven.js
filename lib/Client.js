const Hiven = require('hiven');

module.exports = class Client extends Hiven.Client {
  constructor(options={}) {
    super(options);

    this.token = options.token;
  }

  login(token) {
    token = token || this.token;
    super.connect(token).catch(error => this._log(error));
  }

  _log(msg) {
    if (this.logging) return console.log(msg);
  }
}
