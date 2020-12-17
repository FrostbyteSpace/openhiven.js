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

const APIURL = 'https://api.hiven.io/v1/';
const USERAGENT = 'easyHiven.js | https://github.com/FrostbyteSpace';

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
          // d: {
          //   user: user,
          //   settings: {
          //     user_id: string,
          //     theme: null,
          //     room_overrides: {
          //       id: { notification_preference: int }
          //     },
          //     onboarded: unknown,
          //     enable_desktop_notifications: unknown
          //   },
          //   relationships: {
          //     id: {
          //       user_id: string,
          //       user: user,
          //       type: int,
          //       last_updated_at: string
          //     }
          //   },
          //   read_state: {
          //     id: {
          //       message_id: string,
          //       mention_count: int
          //     },
          //   },
          //   private_rooms: room[]
          //   presences: {
          //     id: user
          //   },
          //   house_memberships: {
          //     id: member
          //   },
          //   house_ids: string[]
          // }

          this.user = new ClientUser(this, d);
          for (let room of d.private_rooms) {
            this.privateRooms.set(room.id, new Room(this, room));
          }
          return this.emit('init');
        }

        case 'ROOM_CREATE': {
          let room;
          if (d.house_id && this.houses.has(d.house_id)) {
            room = new Room(this, d);
            this.houses.get(d.house_id).rooms.set(room.id, room);
          }
          else {
            room = new Room(this, d);
            this.privateRooms.set(room.id, room);
          }
          return this.emit('room_create', room);
        }

        case 'ROOM_UPDATE': {
          let room;
          if (d.house_id && this.houses.has(d.house_id)) {
            room = this.houses.get(d.house_id).rooms.get(d.id);
            if (!room) {
              room = new Room(this, d);
              this.houses.get(d.house_id).rooms.set(room.id, room);
            }
          }
          else {
            room = this.privateRooms.get(d.id);
            if (!room) {
              room = new Room(this, d);
              this.privateRooms.set(room.id, room);
            }
          }
          room.name = d.name;
          return this.emit('room_update', room);
        }

        case 'ROOM_DELETE': {
          if (d.house_id && this.houses.has(d.house_id)) {
            this.houses.get(d.house_id).rooms.delete(d.id)
          }
          else {
            this.privateRooms.delete(d.id);
          }
          return this.emit('room_delete', d);
        }

        case 'MESSAGE_CREATE': {
          let message = new Message(this, d);
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
          message.content = d.content;
          message.last_edit = d.edited_at;
          return this.emit('message_update', message);
        }

        case 'MESSAGE_DELETE': {
          this.messages.delete(d.id);
          return this.emit('message_delete', d);
        }

        case 'TYPING_START': {
          // d: {
          //   timestamp: 1608131133,
          //   room_id: '182410585965590336',
          //   house_id: '182410583881021247',
          //   author_id: '182385886304925462'
          // }

          return this.emit('typing_start', d);
        }

        case 'HOUSE_JOIN': {
          // d: {
          //   rooms: room[],
          //   roles: role[],
          //   owner_id: string,
          //   name: string,
          //   members: member[],
          //   id: string,
          //   icon: string,
          //   entities: entity[],
          //   default_permissions: int,
          //   banner: string
          // }


          let house = new House(this, d)
          this.houses.set(house.id, house);
          return this.emit('house_join', house);
        }

        case 'HOUSE_MEMBER_JOIN': {
          // on hold until full member system update
          break;
        }

        case 'HOUSE_MEMBER_LEAVE': {
          // on hold until full member system update
          break;
        }

        case 'HOUSE_MEMBER_UPDATE': {
          // on hold until full member system update
          break;
        }

        case 'USER_UPDATE': {
          // on hold until full member system update
          break;
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



  get users() {
    // on hold until full member system update
    return;
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
    }, new Collection());
  }



  async createHouse(name, icon) {
    if (!name) throw new Error('Can\'t create a house without a name!');
    let res = await this.axios.post(`/houses`, {
      name: name,
      icon: icon || null
    });
    if (res.data.success) {
      let house = new House(this, res.data.data);
      this.houses.set(house.id, house);
      return house;
    }
    return false;
  }

  async createDM(recipients) {
    let data;
    if (typeof recipients === 'string') {
      data = { recipient: recipients }
    } else if (typeof recipients === 'array') {
      data = { recipients: recipients }
    } else {
      throw new TypeError('Recipients must be a string or an array');
    }
    let res = await this.axios.post(`/users/@me/rooms`, data);
    if (res.data.success) {
      let room = new Room(this, res.data.data);
      this.privateRooms.set(room.id, room);
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
