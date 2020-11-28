# TODO
## Endpoints
leaving this here for the future btw

### houses
- [ ] POST /houses | creates a house | d: { name: string, icon: base64? }
- [ ] DELETE /houses/:id | deletes a house
- [ ] PATCH /houses/:id | edit a house | d: { name: string, icon: base64 }
- [ ] POST /houses/:id/entities | adds a category(only one so far) | d: { name: string, type: int{1: 'category''}}
- [ ] DELETE /houses/:id/entities/:id | deletes a category, has to be empty

- [ ] POST /houses/:id/invites | creates an invite | d: { max_uses: int, max_age: int }
- [ ] GET /invites/:code | fetches an invite
- [ ] POST /invites/:code | uses an invite | d: { }

### rooms
- [ ] POST /houses/:id/rooms | creates a room | d: { name: string, parent_entity_id?(category/house): string }
- [ ] DELETE /houses/:id/rooms/:id | deletes a room
- [ ] POST /rooms/:id/typing | starts typing in a room | d: { }
- [ ] POST /rooms/:id/call | start a call
- [ ] POST /rooms/:id/call/decline | decline a call
- [ ] PUT /rooms/:id/recipients/:id | adds a user to a group DM

### messages
- [ ] POST /rooms/:id/media_messages | creates an attachment message | d: form { file: named file }
- [ ] POST /rooms/:id/messages | creates a text message | d: { content: string}
- [ ] DELETE /rooms/:id/messages/:id | deletes a message
- [ ] PATCH /rooms/:id/messages/:id | edits a message | d: { content: string }
- [ ] GET /rooms/:id/messages | gets messages from a room | d: ?before=id
- [ ] DELETE /houses/:id/rooms/:id/messages/:id | deletes a house message

### users
- [ ] GET /users/:id | gets an account
- [ ] GET /relationships/:id/mutual-friends | gets your mutual friends with an account

### \@me
- [ ] PATCH /users/@me | edits your account | d: { bio: string, name: string, icon: base64?, header: base64?, location: string, website: string }
- [ ] GET /users/@me | gets your account
- [ ] GET /streams/@me/mentions | gets your mentions
- [ ] GET /streams/@me/feed | gets your feed
- [ ] POST /users/@me/rooms | adds a DM room | d: { recipient: string }
- [ ] POST /users/@me/rooms | adds a group DM room | d: { recipients: string[] }
- [ ] DELETE /users/@me/houses/:id | leaves a house
- [ ] DELETE /users/@me/rooms/:id | leaves a group DM
- [ ] DELETE /relationships/@me/friends/:id | unfriends someone
- [ ] POST /relationships/@me/friend-requests | sends a friend request to someone | d: { user_id: string }
- [ ] DELETE /relationships/@me/friend-requests/:id | cancels a friend request
- [ ] PUT /relationships/@me/blocked/:id | blocks a user
- [ ] DELETE /relationships/@me/blocked/:id | unblocks a user
- [ ] PUT /users/@me/settings/room_overrides/:id | changes room settings | d: { notification_preference: int{ 0: 'all', 1: 'mentions', 2: 'none' } }

## Axios
create an Axios instance with baseUrl and default Auth header
