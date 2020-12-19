# TODO
## Endpoints
when they're checked that just means they're implemented in easyhiven.js, people who just wanna use the list can disregard them >wO

### houses
- [x] POST /houses | creates a house | d: { name: string, icon: base64? }
- [x] DELETE /houses/:id | deletes a house
- [x] PATCH /houses/:id | edit a house | d: { name: string, icon: base64 }
- [x] POST /houses/:id/entities | adds an entity (only category so far) | d: { name: string, type: int{1: 'category''}}
- [x] DELETE /houses/:id/entities/:id | deletes a category, has to be empty

- [x] POST /houses/:id/invites | creates an invite | d: { max_uses: int, max_age: int }
- [x] GET /invites/:code | fetches an invite
- [x] POST /invites/:code | uses an invite | d: { }

### rooms
- [x] POST /houses/:id/rooms | creates a room | d: { name: string, parent_entity_id?(category/house): string }
- [x] DELETE /houses/:id/rooms/:id | deletes a room
- [x] POST /rooms/:id/typing | starts typing in a room | d: { }
- [x] POST /rooms/:id/call | start a call | d: { }
- [x] POST /rooms/:id/call/decline | decline a call | d: { }
- [x] PUT /rooms/:id/recipients/:id | adds a user to a group DM
- [x] DELETE /rooms/:id/recipients/:id | removes a user from a group DM
- [ ] PATCH /rooms/:id/default-permissions | changes default permissions for a room | d: { allow: bitfield, deny: bitfield }
- [x] PATCH /rooms/:id | edits a room | d: { name: string }

### messages
- [x] POST /rooms/:id/media_messages | creates an attachment message | d: form { file: named file }
- [x] POST /rooms/:id/messages | creates a text message | d: { content: string}
- [x] DELETE /rooms/:id/messages/:id | deletes a message
- [x] PATCH /rooms/:id/messages/:id | edits a message | d: { content: string }
- [ ] GET /rooms/:id/messages | gets messages from a room | d: ?before=id
- [x] DELETE /houses/:id/rooms/:id/messages/:id | deletes a house message, (obsolete imo, you can use /rooms/:id/messages/:id)
- [x] POST /rooms/:id/messages/:id/ack | mark as read, probably | d: { }

### users
- [x] GET /users/:username | gets an account
- [x] GET /relationships/:id/mutual-friends | gets your mutual friends with an account

### \@me
- [x] PATCH /users/@me | edits your account | d: { bio: string, name: string, icon: base64?, header: base64?, location: string, website: string }
- [x] GET /users/@me | gets your account
- [x] GET /streams/@me/mentions | gets your mentions
- [ ] GET /streams/@me/feed | gets your feed
- [x] POST /users/@me/rooms | adds a DM room | d: { recipient: string }
- [x] POST /users/@me/rooms | adds a group DM room | d: { recipients: string[] }
- [x] DELETE /users/@me/houses/:id | leaves a house
- [x] DELETE /users/@me/rooms/:id | leaves a group DM
- [x] DELETE /relationships/@me/friends/:id | unfriends someone
- [ ] GET /relationships/@me/friends | get your friends
- [x] POST /relationships/@me/friend-requests | sends a friend request to someone | d: { user_id: string }
- [x] DELETE /relationships/@me/friend-requests/:id | cancels a friend request
- [ ] GET /relationships/@me/friend-requests | get your current friend requests
- [x] PUT /relationships/@me/blocked/:id | blocks a user
- [x] DELETE /relationships/@me/blocked/:id | unblocks a user
- [x] PUT relationships/@me/restricted/:id | restricts a user
- [x] DELETE relationships/@me/restricted/:id | unrestricts a user?
- [x] PUT /users/@me/settings/room_overrides/:id | changes room settings | d: { notification_preference: int }

## Websocket Events
a list of all websocket events

- [x] [after connecting](#after-connecting)
- [x] [INIT_STATE](#init_state)
- [x] [HOUSE_JOIN](#house_join)
- [ ] [HOUSE_MEMBERS_CHUNK](#house_members_chunk)
- [x] [TYPING_START](#typing_start)
- [x] [MESSAGE_CREATE](#message_create)
- [x] [MESSAGE_UPDATE](#message_update)
- [x] [MESSAGE_DELETE](#message_delete)
- [x] [ROOM_CREATE](#room_create)
- [x] [ROOM_UPDATE](#room_update)
- [x] [ROOM_DELETE](#room_delete)
- [ ] [HOUSE_ENTITIES_UPDATE](#house_entities_update)
- [ ] [HOUSE_MEMBER_UPDATE](#house_member_update)
- [ ] [USER_UPDATE](#user_update)
- [ ] [RELATIONSHIP_UPDATE](#relationship_update)
- [ ] [PRESENCE_UPDATE](#presence_update)
- [ ] [HOUSE_DOWN](#house_down)
- [ ] [HOUSE_UPDATE](#house_update)


### after connecting
```
op: 1
d: {
  hbt_int: 30000
}
```

### INIT_STATE
```
op: 0
d: {
  user: {
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string
  },
  settings: {
    user_id: string,
    theme: null,
    room_overrides: {
      id: { notification_preference: int }
    },
    onboarded: unknown,
    enable_desktop_notifications: unknown
  },
  relationships: {
    id: {
      user_id: string,
      user: {
        username: string,
        user_flags: string,
        name: string,
        id: string,
        icon: string,
        header: string,
        presence: string
      },
      type: int,
      last_updated_at: string
    }
  },
  read_state: {
    id: {
      message_id: string,
      mention_count: int
    },
  },
  private_rooms: room[]
  presences: {
    id: {
      username: string,
      user_flags: string,
      name: string,
      id: string,
      icon: string,
      header: string,
      presence: string
    }
  },
  house_memberships: {
    id: {
      user_id: string,
      user: {
        username: string,
        user_flags: string,
        name: string,
        id: string,
        icon: string,
        header: string,
        presence: string
      },
      roles: array,
      last_permission_update: string,
      joined_at: string,
      house_id: string
    }
  },
  house_ids: string[]
}
```

### HOUSE_JOIN
```
op: 0
d: {
  rooms: room[{
    type: int,
    recipients: null
    position: int,
    permission_overrides: bits,
    owner_id: string,
    name: string,
    last_message_id: string,
    id: string,
    house_id: string,
    emoji: object,
    description: string,
    default_permission_override: int
  }],
  roles: role[{
    position: int,
    name: string,
    level: int,
    id: string,
    deny: bits,
    color: string,
    allow: bits
  }],
  owner_id: string,
  name: string,
  members: [{
    user_id: string,
    user: {
      username: string,
      user_flags: string,
      name: string,
      id: string,
      icon: string,
      header: string,
      presence: string
    },
    roles: array,
    last_permission_update: string,
    joined_at: string,
    house_id: string
  }],
  id: string,
  icon: string,
  entities: [{
    type: int,
    resource_pointers: [{
      resource_type: string,
      resource_id: string
    }],
    position: int,
    name: string,
    id: string
  }],
  default_permissions: int,
  banner: string
}
```

### HOUSE_MEMBERS_CHUNK
```
op: 0
d: {
  members: {
    id: {
      user_id: string,
      user: {
        username: string,
        user_flags: string,
        name: string,
        id: string,
        icon: string,
        header: string,
        presence: string
      },
      roles: array,
      last_permission_update: string,
      joined_at: string,
      house_id: string
    }
  },
  house_id: string
}
```

### TYPING_START
```
op: 0
d: {
  timestamp: int,
  room_id: string,
  house_id: string,
  author_id: string
}
```

### MESSAGE_CREATE
```
op: 0
d: {
  timestamp: int,
  room_id: string,
  mentions: [{
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string,
    bot: boolean
  }],
  member: {
    user_id: string,
    user: {
      username: string,
      user_flags: string,
      name: string,
      id: string,
      icon: string,
      header: string,
      presence: string
    },
    roles: array,
    last_permission_update: string,
    joined_at: string,
    house_id: string
  },
  id: string,
  house_id: string,
  exploding_age: int,
  exploding: boolean,
  device_id: string,
  content: string,
  bucket: int,
  author_id: string,
  author: {
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string
  }
  attachment: {
    media_url: string,
    filename: string,
    dimensions: {
      width: int,
      type: string,
      height: int
    }
  }
}
```

### MESSAGE_UPDATE
```
op: 0
d: {
  type: int,
  timestamp: string,
  room_id: string,
  metadata: unknown,
  mentions: [{
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string
  }],
  id: string,
  house_id: string,
  exploding_age: int,
  exploding: boolean,
  embed: object,
  edited_at: string,
  device_id: string,
  content: string,
  bucket: int,
  author_id: string,
  attachment: {
    media_url: string,
    filename: string,
    dimensions: {
      width: int,
      type: string,
      height: int
    }
  }
}
```

### MESSAGE_DELETE
```
op: 0
d: {
  room_id: string,
  message_id: string,
  house_id: string
}
```

### ROOM_CREATE
```
op: 0
d: {
  type: int,
  position: int,
  name: string,
  id: string,
  house_id: string
}
```

### ROOM_UPDATE
```
op: 0
d: {
  type: int,
  position: int,
  name: string,
  id: string,
  house_id: string,
  emoji: object,
  description: string
}
```

### ROOM_DELETE
```
op: 0
d: {
  id: '191527742867501935',
  house_id: '182410583881021247'
}
```

### HOUSE_ENTITIES_UPDATE
```
op: 0
d: {
  house_id: '182410583881021247',
  entities: [{
    type: int,
    resource_pointers: [{
      resource_type: string,
      resource_id: string
    }],
    position: int,
    name: string,
    id: string
  }]
}
```

### HOUSE_MEMBER_UPDATE
```
op: 0
d: {
  user_id: string,
  user: {
    website: string,
    username: string,
    user_flags: int,
    name: string,
    location: string,
    id: string,
    icon: string,
    header: string,
    email_verified: boolean,
    bot: boolean,
    bio: string
  },
  roles: object[],
  presence: string,
  last_permission_update: unknown,
  joined_at: string,
  id: string,
  house_id: string
}
```

### USER_UPDATE
```
op: 0
d: {
  website: string,
  username: string,
  user_flags: int,
  name: string,
  location: string,
  id: string,
  icon: string,
  header: string,
  email_verified: boolean,
  bot: boolean,
  bio: string
}
```

### RELATIONSHIP_UPDATE
```
op: 0
d: {
  user: {
    website: string,
    username: string,
    user_flags: int,
    name: string,
    location: string,
    id: string,
    icon: string,
    bio: string
  },
  type: int,
  recipient_id: string,
  id: string
}
```

### PRESENCE_UPDATE
```
op: 0
d: {
  username: string,
  user_flags: string,
  name: string,
  id: string,
  icon: string,
  header: string,
  presence: string
}
```

### HOUSE_DOWN
```
op: 0
d: {
  unavailable: boolean,
  house_id: string
}
```

### HOUSE_LEAVE
```
op: 0
d: {
  id: string,
  house_id: string
}
```

### HOUSE_MEMBER_JOIN
```
op: 0
d: {
  user: {
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string
  },
  roles: [],
  joined_at: string,
  house_id: string
}

```

### HOUSE_MEMBER_LEAVE
```
op: 0
d: {
  user: {
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string
  },
  roles: [],
  presence: string,
  joined_at: string,
  house_id: string
}
```

### HOUSE_UPDATE
```
op: 0
d: {
  type: int,
  roles: [{
    position: int,
    name: string,
    level: int,
    id: string,
    deny: int,
    color: string,
    allow: int
  }],
  owner_id: string,
  name: string,
  id: string,
  icon: string,
  house_id: string,
  entities: [{
    type: int,
    resource_pointers: [{
      resource_type: string,
      resource_id: string
    }],
    position: int,
    name: string,
    id: string
  }],
  default_permissions: int,
  banner: unknown
}
```


## Websocket Data (WIP)
list of websocket data you can send

### Selecting a room
returns... nothing? lol
```
{"op":4,"d":{"id":"191544281301778432"}}
```


## Permissions
all the permission bits in a row, I will probably make a class for this at some point;
- SEND_MESSAGES = 1 << 0,
- READ_MESSAGES = 1 << 1,
- ADMINISTRATOR = 1 << 2,
- MODERATE_ROOM = 1 << 3,
- EVICT_MEMBERS = 1 << 4,
- KICK_MEMBERS = 1 << 5,
- ATTACH_MEDIA = 1 << 6,
- MANAGE_ROLES = 1 << 7,
- MANAGE_BILLING = 1 << 8,
- MANAGE_BOTS = 1 << 9,
- MANAGE_INTEGRATIONS = 1 << 10,
- MANAGE_ROOMS = 1 << 11,
- START_PORTAL = 1 << 12,
- STREAM_TO_PORTAL = 1 << 13,
- TAKEOVER_PORTAL = 1 << 14,
- POST_TO_FEED = 1 << 15,
- MANAGE_USER_OVERRIDES = 1 << 16,
- CREATE_INVITES = 1 << 17,
- MANAGE_INVITES = 1 << 18

## Future Updates
- roles
- members

## Data Structures

### user
```
{
  username: string,
  user_flags: string,
  name: string,
  id: string,
  icon: string,
  header: string,
  presence: string
}
```

### room
```
{
  type: int,
  recipients: [{
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string
  }],
  position: int,
  permission_overrides: bits,
  owner_id: string,
  name: string,
  last_message_id: string,
  id: string,
  house_id: string,
  emoji: object,
  description: string,
  default_permission_override: int
}
```

### member
```
{
  user_id: string,
  user: {
    username: string,
    user_flags: string,
    name: string,
    id: string,
    icon: string,
    header: string,
    presence: string
  },
  roles: array,
  last_permission_update: string,
  joined_at: string,
  house_id: string
}
```

### role
```
{
  position: int,
  name: string,
  level: int,
  id: string,
  deny: int,
  color: string,
  allow: int
}
```

### entity
```
{
  type: int,
  resource_pointers: [{
    resource_type: string,
    resource_id: string
  }],
  position: int,
  name: string,
  id: string
}
```

## Type Integer Meanings
- relationships.type: { 1: 'outgoing request', 2: 'incoming request', 3: 'friends', 4: 'restricted', 5: 'blocked' }
- notification_preference: { 0: 'all', 1: 'mentions', 2: 'none' }
- room types { 0: 'House', 1: 'DM', 2: 'Group'}

## Secret Chat Stuff
```
{"op":9,"d":{"recipient":""}}
{"op":8,"d":{"public_key":"-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"}}
{"op":10,"d":{"secret_chat_id":"","encrypted_content":"content"}}

REQUEST_PUBLIC_KEY
{
  "requester_resource_id": "",
  "request_type": "secret_chat_init"
}

SECRET_CHAT_CREATE
{
  "type": 3,
  "status": "AWAITING_PUBLIC_KEYS",
  "recipients": [
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    },
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    }
  ],
  "public_keys": {},
  "id": ""
}

GENERATE_KEYS
{
  "success": true,
  "type": "GENERATE_KEYS",
  "idempotency": 18288,
  "result": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"
}

SECRET_CHAT_UPDATE
{
  "type": 3,
  "status": "READY",
  "recipients": [
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    },
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    }
  ],
  "public_keys": {
    "": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----",
    "": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"
  },
  "id": ""
}

{"op":8,"d":{"public_key":"-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"}}

REQUEST_PUBLIC KEY
{
  "requester_resource_id": "",
  "request_type": "secret_chat_init"
}

GENERATE_KEYS
{
  "success": true,
  "type": "GENERATE_KEYS",
  "idempotency": 29702,
  "result": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"
}

SECRET_CHAT_UPDATE
{
  "type": 3,
  "status": "READY",
  "recipients": [
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    },
    {
      "username": "",
      "user_flags": "",
      "name": "",
      "id": "",
      "icon": "",
      "header": ""
    }
  ],
  "public_keys": {
    "": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----",
    "": "-----BEGIN PUBLIC KEY-----KEY-----END PUBLIC KEY-----"
  },
  "id": ""
}



ENCRYPT
{
  success: true,
  type: "ENCRYPT",
  idempotency: 78671,
  result: ""
}

MESSAGE_CREATE
{
  "timestamp": ,
  "room_id": "",
  "recipient_ids": [
    "",
    ""
  ],
  "mentions": [],
  "id": "",
  "encrypted": true,
  "content": "",
  "author_id": "",
  "author": {
    "username": "",
    "user_flags": "",
    "name": "",
    "id": "",
    "icon": "",
    "header": ""
  }
}
```
