# TODO <!-- omit in toc -->

Looking for the documentation that used to be here? [hiven.docs](https://github.com/FrostbyteSpace/hiven.docs)!

## NAV
- [NAV](#nav)
- [Endpoints](#endpoints)
- [Future Updates](#future-updates)
- [Websocket Events](#websocket-events)
- [Websocket Data](#websocket-data)
- [Secret Chat Stuff](#secret-chat-stuff)

## Endpoints
### houses
- [x] POST /houses
- [x] DELETE /houses/:id
- [x] PATCH /houses/:id
- [x] POST /houses/:id/entities
- [x] DELETE /houses/:id/entities/:id

- [x] POST /houses/:id/invites
- [x] GET /invites/:code
- [x] POST /invites/:code

### rooms
- [x] POST /houses/:id/rooms
- [x] DELETE /houses/:id/rooms/:id
- [x] POST /rooms/:id/typing
- [x] POST /rooms/:id/call
- [x] POST /rooms/:id/call/decline
- [x] PUT /rooms/:id/recipients/:id
- [x] DELETE /rooms/:id/recipients/:id
- [ ] PATCH /rooms/:id/default-permissions
- [x] PATCH /rooms/:id

### messages
- [x] POST /rooms/:id/media_messages
- [x] POST /rooms/:id/messages
- [x] DELETE /rooms/:id/messages/:id
- [x] PATCH /rooms/:id/messages/:id
- [ ] GET /rooms/:id/messages
- [x] DELETE /houses/:id/rooms/:id/messages/:id
- [x] POST /rooms/:id/messages/:id/ack

### users
- [x] GET /users/:username
- [x] GET /relationships/:id/mutual-friends

### \@me
- [x] PATCH /users/@me
- [x] GET /users/@me
- [x] GET /streams/@me/mentions
- [ ] GET /streams/@me/feed
- [x] POST /users/@me/rooms
- [x] POST /users/@me/rooms
- [x] DELETE /users/@me/houses/:id
- [x] DELETE /users/@me/rooms/:id
- [x] DELETE /relationships/@me/friends/:id
- [ ] GET /relationships/@me/friends
- [x] POST /relationships/@me/friend-requests
- [x] DELETE /relationships/@me/friend-requests/:id
- [ ] GET /relationships/@me/friend-requests
- [x] PUT /relationships/@me/blocked/:id
- [x] DELETE /relationships/@me/blocked/:id
- [x] PUT relationships/@me/restricted/:id
- [x] DELETE relationships/@me/restricted/:id
- [x] PUT /users/@me/settings/room_overrides/:id


## Future Updates
- roles
- members

## Websocket Events

- [x] after connecting
- [x] INIT_STATE
- [x] HOUSE_JOIN
- [ ] HOUSE_MEMBERS_CHUNK
- [x] TYPING_START
- [x] MESSAGE_CREATE
- [x] MESSAGE_UPDATE
- [x] MESSAGE_DELETE
- [x] ROOM_CREATE
- [x] ROOM_UPDATE
- [x] ROOM_DELETE
- [x] HOUSE_ENTITIES_UPDATE
- [ ] HOUSE_MEMBER_UPDATE
- [ ] USER_UPDATE
- [x] RELATIONSHIP_UPDATE
- [ ] PRESENCE_UPDATE
- [x] HOUSE_DOWN
- [x] HOUSE_UPDATE

## Websocket Data

- [x] [Ping](#ping)
- [x] [Init](#init)
- [ ] [Request Presence Updates](#request-presence-updates)
- [ ] [Request House Members](#request-house-members)
- [ ] [Select A Room](#select-a-room)


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
