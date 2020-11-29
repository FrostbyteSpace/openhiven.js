const WS = require('ws');
const { EventEmitter } = require('events');

URL='wss://swarm-dev.hiven.io/socket?encoding=json&compression=text_json';


module.exports = class Websocket extends EventEmitter {
  constructor() {
    super();
  }

  async connect() {
    return new Promise((resolve) => {
      let ws = new WS(URL);
      ws.on('message', async (msg) => {
        let body = JSON.parse(msg);
        if (body.op === 1 && body.d && body.d.hbt_int) {
          await this.beat(body.d.hbt_int);
        }
        this.emit('data', body);
      });
      ws.on('open', async () => {
        this.reconnectionCount = 0;

        return resolve(true);
      });
      this.ws = ws;
    });
  }

  async beat(rate) {
    this.heartbeat = setInterval(() => this.send(({ op: 3 })), rate);
  }

  async send(data) {
    if (this.ws && this.ws.readyState !== WS.OPEN) return false;
    return this.ws.send(JSON.stringify(data));
  }
}
