const { EventEmitter } = require('events');
const Websocket = require('./Websocket.js');
const Axios = require('axios');
const Collection = require('../djs-collection');
const FormData = require('form-data');

const ClientUser = require('../types/ClientUser.js');
const House = require('../types/House.js');
const Member = require('../types/Member.js');
const Message = require('../types/Message.js');
const DMRoom = require('../types/DMRoom.js');
const GroupRoom = require('../types/GroupRoom.js');
const HouseRoom = require('../types/HouseRoom.js');
const User = require('../types/User.js');
const Invite = require('../types/Invite.js');

const APIURL = 'https://api.hiven.io/v1/';
const USERAGENT = 'easyhiven.js v0.2 | https://github.com/FrostbyteSpace';

module.exports = class Client extends EventEmitter {
  constructor(options={}) {
    super();

    this.options = options;
    this.token = options.token;
    this.logging = options.logging;
    this.type = options.type;

    this.ws = new Websocket();
    this.axios = new Axios.create({
      baseURL: APIURL,
      headers: { 'User-Agent': USERAGENT }
    });

    this.messages = new Collection();
    this.houses = new Collection();
    this.privateRooms = new Collection();
  }



  async connect(token) {
    this.token = token || this.token;
    this.token = (this.type === 'bot' ? `Bot ${this.token}`: this.token);
    this.emit('debug', this.token);

    this.axios.defaults.headers.common['Authorization'] = this.token;
    this.axios.interceptors.request.use(config => {
      if (config.data instanceof FormData) {
        config.headers = {...config.headers, ...config.data.getHeaders()};
      }
      return config;
    });

    await this.ws.connect();
    await this.ws.send({ op: 2, d: { token: this.token } });



    this.ws.on('data', async (body) => {
      const { e, d } = body;
      this.emit('debug', body);

      switch (e) {
        case 'INIT_STATE': {
          this.user = new ClientUser(this, d);
          for (let room of d.private_rooms) {
            switch (room.type) {
              case 1:
                this.privateRooms.set(room.id, new DMRoom(this, room));
                break;
              case 2:
                this.privateRooms.set(room.id, new GroupRoom(this, room));
                break;
              default:
                return;
            }
          }
          return this.emit('init');
        }

        case 'ROOM_CREATE': {
          let room;
          switch (d.type) {
            case 0:
              if (!this.houses.has(d.house_id)) return;
              room = new HouseRoom(this, d);
              this.houses.get(d.house_id).rooms.set(room.id, room);
              break;
            case 1:
              room = new DMRoom(this, d);
              this.privateRooms.set(room.id, room);
              break;
            case 2:
              room = new GroupRoom(this, d);
              this.privateRooms.set(room.id, room);
              break;
            default:
              return;
          }
          return this.emit('roomCreate', room);
        }

        case 'ROOM_UPDATE': {
          let room = this.rooms.get(d.id);
          if (!room) {
            switch (d.type) {
              case 0:
                if (!this.houses.has(d.house_id)) return;
                room = new HouseRoom(this, d);
                this.houses.get(d.house_id).rooms.set(room.id, room);
                break;
              case 1:
                room = new DMRoom(this, d);
                this.privateRooms.set(room.id, room);
                break;
              case 2:
                room = new GroupRoom(this, d);
                this.privateRooms.set(room.id, room);
                break;
              default:
                return;
            }
          }
          room._update(d);
          return this.emit('roomUpdate', room);
        }

        case 'ROOM_DELETE': {
          if (this.houses.has(d.house_id)) {
            this.houses.get(d.house_id).rooms.delete(d.id);
          }
          else {
            this.privateRooms.delete(d.id);
          }
          return this.emit('roomDelete', d);
        }

        case 'MESSAGE_CREATE': {
          const message = new Message(this, d);
          this.messages.set(d.id, message);
          return this.emit('message', message);
        }

        case 'MESSAGE_UPDATE': {
          let message;
          if (this.messages.has(d.id)) {
            message = this.messages.get(d.id);
          }
          else {
            message = new Message(this, d);
            this.messages.set(message.id, message);
          }
          message._update(d);
          return this.emit('messageUpdate', message);
        }

        case 'MESSAGE_DELETE': {
          this.messages.delete(d.id);
          return this.emit('messageDelete', d);
        }

        case 'TYPING_START': {
          return this.emit('typing', d);
        }

        case 'HOUSE_JOIN': {
          const house = new House(this, d)
          this.houses.set(house.id, house);
          return this.emit('houseAdd', house);
        }

        case 'HOUSE_UPDATE': {
          let house;
          if (this.houses.has(d.id)) {
            house = this.houses.get(d.id);
          }
          else {
            house = new House(this, d);
            this.houses.set(house.id, house);
          }
          house._update(d);
          return this.emit('houseUpdate', house);
        }

        case 'HOUSE_ENTITIES_UPDATE': {
          if (!this.houses.has(d.house_id)) return;
          this.houses.get(d.house_id)._updateEntities(d);
          return this.emit('houseEntityUpdate');
        }

        case 'RELATIONSHIP_UPDATE': {
          const relationship = this.user._updateRelationship(d);
          return this.emit('relationshipUpdate', relationship);
        }

        case 'CALL_CREATE': {
          return this.emit('call', d);
        }

        case 'HOUSE_DOWN': {
          return this.emit('houseDown', d);
        }

        default: {
          break;
        }
      }
    });
    return this;
  }



  get users() {
    return new Collection(this.user.relationships);
  }

  get members() {
    // on hold until full member system update
    return;
  }

  get rooms() {
    return this.houses.reduce((rooms, house) => {
      for (let room of house.rooms.array()) {
        rooms.set(room.id, room);
      }
      return rooms;
    }, this.privateRooms);
  }



  async createHouse(name, icon) {
    if (!name) throw new Error('Can\'t create a house without a name!');
    const res = await this.axios.post(`/houses`, {
      name: name,
      icon: icon || null
    });
    if (res.data.success) {
      const house = new House(this, res.data.data);
      this.houses.set(house.id, house);
      return house;
    }
    return false;
  }

  async createDM(recipient) {
    const res = await this.axios.post(`/users/@me/rooms`, {
      recipient: recipient,
    });
    if (res.data.success) {
      const room = new DMRoom(this, res.data.data);
      this.privateRooms.set(room.id, room);
      return room;
    }
    return false;
  }

  async createGroup(recipients) {
    const res = await this.axios.post(`/users/@me/rooms`, {
      recipients: recipients,
    });
    if (res.data.success) {
      const room = new GroupRoom(this, res.data.data);
      this.privateRooms.set(room.id, room);
      return room;
    }
    return false;
  }

  async fetchInvite(code) {
    const res = await this.axios.get(`/invites/${code}`);
    if (res.data.succes) {
      return new Invite(this, res.data.data);
    }
    return false;
  }

  async fetchUser(name) {
    const res = await this.axios.get(`/users/${name}`);
    if (res.data.success) {
      const user = new User(this, res.data.data);
      this.users.set(user.id, user);
      return user;
    }
    return false;
  }



  _log(msg, level=1) {
    if (level <= this.logging) return console.log(msg);
  }
}
