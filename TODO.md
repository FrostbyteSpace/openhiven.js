# TODO
## Endpoints
leaving this here for the future.
when they're checked that just means they're implemented in easyHiven.js, people who just wanna use the list can disregard them >wO

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
- [ ] PUT /rooms/:id/recipients/:id | adds a user to a group DM

### messages
- [x] POST /rooms/:id/media_messages | creates an attachment message | d: form { file: named file }
- [x] POST /rooms/:id/messages | creates a text message | d: { content: string}
- [x] DELETE /rooms/:id/messages/:id | deletes a message
- [x] PATCH /rooms/:id/messages/:id | edits a message | d: { content: string }
- [ ] GET /rooms/:id/messages | gets messages from a room | d: ?before=id
- [x] DELETE /houses/:id/rooms/:id/messages/:id | deletes a house message, (obsolete, not in easyHiven.js)
- [x] POST /rooms/:id/messages/:id/ack | mark as read, probably, ack = short for acknowledge? | d: { }

### users
- [x] GET /users/:@username | gets an account
- [ ] GET /relationships/:id/mutual-friends | gets your mutual friends with an account

### \@me
- [x] PATCH /users/@me | edits your account | d: { bio: string, name: string, icon: base64?, header: base64?, location: string, website: string }
- [ ] GET /users/@me | gets your account
- [ ] GET /streams/@me/mentions | gets your mentions
- [ ] GET /streams/@me/feed | gets your feed
- [x] POST /users/@me/rooms | adds a DM room | d: { recipient: string }
- [x] POST /users/@me/rooms | adds a group DM room | d: { recipients: string[] }
- [x] DELETE /users/@me/houses/:id | leaves a house
- [x] DELETE /users/@me/rooms/:id | leaves a group DM
- [ ] DELETE /relationships/@me/friends/:id | unfriends someone
- [ ] GET /relationships/@me/friends | get your friends
- [ ] POST /relationships/@me/friend-requests | sends a friend request to someone | d: { user_id: string }
- [ ] DELETE /relationships/@me/friend-requests/:id | cancels a friend request
- [ ] GET /relationships/@me/friend-requests | get your current friend requests
- [ ] PUT /relationships/@me/blocked/:id | blocks a user
- [ ] DELETE /relationships/@me/blocked/:id | unblocks a user
- [ ] PUT relationships/@me/restricted/:id | restricts a user
- [ ] DELETE relationships/@me/restricted/:id | unrestricts a user?
- [ ] PUT /users/@me/settings/room_overrides/:id | changes room settings | d: { notification_preference: int{ 0: 'all', 1: 'mentions', 2: 'none' } }
