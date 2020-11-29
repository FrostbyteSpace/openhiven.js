const { EventEmitter } = require('events');
const Websocket = require('./Websocket.js');
const Axios = require('axios');
const Collection = require('../djs-collection');
const FormData = require('form-data');

const ClientUser = require('../types/ClientUser.js');
const House = require('../types/House.js');
const Member = require('../types/Member.js');
const Message = require('../types/Message.js');
const Room = require('../types/Room.js');
const User = require('../types/User.js');
const Invite = require('../types/Invite.js');

APIURL = 'https://api.hiven.io/v1/';

module.exports = class Client extends EventEmitter {
  constructor(options={}) {
    super();

    this.options = options;
    this.token = options.token;
    this.logging = options.logging;
    this.type = options.type;

    this.ws = new Websocket();
    this.axios = new Axios.create({
      baseURL: APIURL
    });

    this.users = new Collection();
    this.rooms = new Collection();
    this.houses = new Collection();
    this.messages = new Collection();
  }



  async connect(token) {
    this.token = token || this.token;
    this.token = (this.type === 'bot' ? `Bot ${this.token}`: this.token);

    this.axios.defaults.headers.common['Authorization'] = this.token;
    this.axios.interceptors.request.use(config => {
      if (config.data instanceof FormData) {
        Object.assign(config.headers, config.data.getHeaders());
      }
      return config;
    });

    await this.ws.connect();
    await this.ws.send({ op: 2, d: { token: this.token } });



    this.ws.on('data', async (body) => {
      const { e, d } = body;
      this.emit('RAW', body);

      switch (e) {
        case 'INIT_STATE': {
          this.user = new ClientUser(this, d.user);
          for (let room of d.private_rooms) {
            this.rooms.set(room.id, new Room(this, room));
          }
          return this.emit('init', d);
        }
        case 'ROOM_CREATE': {
          let house = this.houses.get(d.house_id);
          let room = new Room(this, d);
          if (house) house.rooms.set(room.id, room);
          this.rooms.set(room.id, room);
          return this.emit('room_create', room);
        }
        case 'ROOM_UPDATE': {
          //change room stuffs
          return this.emit('room_update', d);
        }
        case 'ROOM_DELETE': {
          let house = this.houses.get(d.house_id);
          if (house) house.rooms.delete(d.id);
          this.rooms.delete(d.id);
          return this.emit('room_delete', d);
        }
        case 'MESSAGE_CREATE': {
          let message = new Message(this, d);
          this.messages.set(d.id, message);
          //maybe add messages to rooms and perhaps houses?
          return this.emit('message', message);
        }
        case 'MESSAGE_UPDATE': {
          let message = this.messages.get(d.id);
          message.content = d.content;
          message.last_edit = d.edited_at;
          return this.emit('message_update', d);
        }
        case 'MESSAGE_DELETE': {
          this.messages.delete(d.id);
          // delete message in other places if they get added
          return this.emit('message_delete', d);
        }
        case 'TYPING_START': {
          return this.emit('typing_start', d);
        }
        case 'HOUSE_JOIN': {
          let house = new House(this, d)
          this.houses.set(house.id, house);
          return this.emit('house_join', house);
        }
        case 'HOUSE_MEMBER_JOIN': {
          let member = new Member(this, d);
          let house = this.houses.get(d.house_id);
          if (house) house.members.set(member.id, member);
          if (!this.users.has(member.id)) this.users.set(member.id, member.user);
          return this.emit('house_member_join', member);
        }
        case 'HOUSE_MEMBER_LEAVE': {
          let house = this.houses.get(d.house_id);
          if (house) house.members.delete(d.user_id);
          return this.emit('house_member_leave', d);
        }
        case 'CALL_CREATE': {
          return this.emit('call_create', d);
        }
        default: {
          break;
        }
      }
    });
    return this;
  }



  async createHouse(name, icon) {
    if (!name) throw new Error('Can\'t create a house without a name!');
    let res = await this.axios.post(`/houses`, {
      name: name,
      icon: icon || null
    });
    if (res.data.success) {
      let house = new House(client, res.data.data);
      this.houses.set(house.id, house);
      return house;
    }
    return false;
  }

  async createDM(recipients) {
    if (typeof recipients === 'string') {
      let data = { recipient: recipients }
    } else if (typeof recipients === 'array') {
      let data = { recipients: recipients }
    } else {
      throw new TypeError('Recipients must be a string or an array');
    }
    let res = await this.axios.post(`/users/@me/rooms`, data);
    if (res.data.success) {
      let room = new Room(this, res.data.data);
      this.rooms.set(room.id, room);
      return room;
    }
    return false;
  }

  async fetchInvite(code) {
    let res = await this.axios.get(`/invites/${code}`);
    if (res.data.succes) {
      return new Invite(this, res.data.data);
    }
    return false;
  }

  async fetchUser(name) {
    let res = await this.axios.get(`/users/${name}`);
    if (res.data.success) {
      let user = new User(this, res.data.data);
      this.users.set(user.id, user);
      return user;
    }
    return false;
  }



  _log(msg) {
    if (this.logging) return console.log(msg);
  }
}
