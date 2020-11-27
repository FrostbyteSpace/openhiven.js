# TODO
## Endpoints
leaving this here for the future btw

### houses
- [ ] POST /houses | creates a house | d: { name: string, icon: base64? }
- [ ] DELETE /houses/:id | deletes a house
- [ ] DELETE /users/@me/houses/:id | leaves a house
- [ ] PATCH /houses/:id | edit a house | d: { name: string, icon: base64 }
- [ ] POST /houses/:id/entities | adds a category(only one so far) | d: { name: string, type: int{1: 'category''}}

- [ ] POST /houses/:id/invites | creates an invite | d: { max_uses: int, max_age: int }
- [ ] GET /invites/:code | fetches an invite
- [ ] POST /invites/:code | uses an invite | d: { }

### rooms
- [ ] POST /houses/:id/rooms | creates a room | d: { name: string, parent_entity_id?(category/house): string }
- [ ] DELETE /houses/:id/rooms/:id | deletes a room
- [ ] POST /rooms/:id/typing | starts typing in a room | d: { }

### messages
- [ ] POST /rooms/:id/media_messages | creates an attachment message | d: form { file: named file }
- [ ] POST /rooms/:id/messages | creates a text message | d: { content: string}
- [ ] DELETE /rooms/:id/messages/:id | deletes a message
- [ ] PATCH /rooms/:id/messages/:id | edits a message | d: { content: string }
- [ ] GET /rooms/182657092941770841/messages

### users
- [ ] GET /users/:id | gets an account
- [ ] GET /relationships/:id/mutual-friends | gets your mutual friends with an account

### \@me
- [ ] PATCH /users/@me | edits your account | d: { bio: string, name: string, icon: base64?, header: base64?, location: string, website: string }
- [ ] GET /users/@me | gets your account
- [ ] GET /streams/@me/mentions | gets your mentions
- [ ] GET /streams/@me/feed | gets your feed
