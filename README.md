# visitflow

A visit management app built with Next.js and MongoDB.

## Demo

- YouTube: [https://youtu.be/Si6723mTs7o](https://youtu.be/Si6723mTs7o)

## Development

### Run locally

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set the MongoDB connection string,
   database name, and a private signing secret:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017
   DATABASE_NAME=visitflow
   JWT_SECRET=replace-with-a-long-random-secret
   ```

   Point `MONGODB_URI` to a MongoDB instance available to your machine. Keep
   secrets out of source control.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The server reloads as
   you edit files.

Useful project checks:

```bash
npm run lint
npm run build
```

### Project layout

- `app/` contains the pages and API route handlers.
- `components/` contains reusable interface components.
- `stores/` contains client-side Zustand stores.
- `lib/` contains database and session helpers.
- `types/` and `utils/` contain shared types and utility functions.

## APIs

All routes are relative to the application origin. The session-based routes use the
`session` cookie, which is issued by login or sign-up and is HTTP-only.

### `POST /api/sign-up`

Creates an account and starts a session. Submit form data (not JSON):

```http
POST /api/sign-up
Content-Type: application/x-www-form-urlencoded

name=Jane+Doe&email=jane%40example.com&password=example-password
```

The name must not be blank, the email must be valid, and the password must be
8–72 characters. On success, the server sets the session cookie and redirects
with `303 See Other` to `/app`.

```json
{ "error": "Invalid name, email, or password." }
```

Invalid input returns `400`; an email already in use returns `409`.

### `POST /api/login`

Signs in with form data and sets the session cookie on success:

```http
POST /api/login
Content-Type: application/x-www-form-urlencoded

email=jane%40example.com&password=example-password
```

```json
{
  "ok": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

Missing or incorrect credentials return `401`:

```json
{ "error": "Invalid email or password." }
```

### `POST /api/logout`

Deletes the session cookie and redirects to `/` with `303 See Other`.

```http
POST /api/logout
```

### `GET /api/get-current-user`

Returns the user associated with the session cookie:

```http
GET /api/get-current-user
Cookie: session=<token>
```

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

No session returns `401` with `{ "error": "No token" }`. An invalid session
returns `401`.

### `POST /api/get-entities`

Returns one page of entities belonging to the signed-in user. `userId` in the
request body is not used; the session identifies the user.

```http
POST /api/get-entities
Content-Type: application/json
Cookie: session=<token>

{
  "page": 1,
  "limit": 10
}
```

```json
{
  "entities": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Kantor Layanan Melati",
      "normalizedName": "kantor layanan melati",
      "type": "Instansi",
      "segment": "B2G",
      "region": "Jakarta"
    }
  ]
}
```

The request expects positive `page` and `limit` values. No session returns
`401`; unexpected errors return `500`.

### `POST /api/count-entities`

Returns the number of entities belonging to the signed-in user. The session
cookie identifies the user; no request body is needed.

```http
POST /api/count-entities
Cookie: session=<token>
```

```json
{ "count": 8 }
```

No session returns `401` with `{ "error": "No token" }`; unexpected errors return
`500` with `{ "error": "Internal server error" }`.

### `POST /api/add-entity`

Creates an entity. All five fields are required:

```http
POST /api/add-entity
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "name": "Kantor Layanan Melati",
  "type": "Instansi",
  "segment": "B2G",
  "region": "Jakarta"
}
```

On success, returns `201`:

```json
{ "id": "507f1f77bcf86cd799439012" }
```

Missing fields return `400`; an entity rejected as a duplicate returns `409`.
Current implementation note: unlike the other data routes, this handler does
not verify the session cookie; it uses the `userId` supplied in the request
body.

### `POST /api/get-activities`

Returns a page of the signed-in user's activities. The body expects `page` and
`limit`.

```http
POST /api/get-activities
Content-Type: application/json
Cookie: session=<token>

{
  "page": 1,
  "limit": 10
}
```

```json
{
  "activities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "entityName": "Kantor Layanan Melati",
      "entityType": "Instansi",
      "segment": "B2G",
      "region": "Jakarta",
      "visitDate": "2026-11-11T00:00:00.000Z",
      "status": "NOT_VISITED",
      "salesName": "Jane Doe"
    }
  ]
}
```

No session returns `401`; unexpected errors return `500`.

### `POST /api/add-activity`

Creates an activity for the entity included in the request. This route requires
a session cookie; the session determines the activity owner.

```http
POST /api/add-activity
Content-Type: application/json
Cookie: session=<token>

{
  "entity": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Kantor Layanan Melati",
    "type": "Instansi",
    "segment": "B2G",
    "region": "Jakarta"
  },
  "visitDate": "2026-11-11",
  "status": "NOT_VISITED",
  "salesName": "Jane Doe",
  "updatedDate": "2026-11-11T12:00:00.000Z"
}
```

On success, returns `201`:

```json
{ "id": "507f1f77bcf86cd799439014" }
```

No session returns `401`. A failed insert or unexpected error returns `500`.
`status` is used as supplied; the handler does not validate it.

### `GET /api/filter-activities`

Returns a paginated, filtered list of the signed-in user's activities. All
query parameters are optional:

```http
GET /api/filter-activities?segment=B2G&status=NOT_VISITED&from=2026-11-01&to=2026-11-30&search=kantor&page=1&limit=10
Cookie: session=<token>
```

- `segment` and `status` match exact values (the UI uses `B2G`/`B2B` and
  `NOT_VISITED`/`VISITED`).
- `from` and `to` use `YYYY-MM-DD`; the range includes the full `to` date.
- `search` matches the beginning of the normalized entity name,
  case-insensitively.
- `page` defaults to `1`; `limit` defaults to `20` and is capped at `100`.

```json
{
  "items": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 0
}
```

Invalid dates or a `from` date later than `to` return `400`. No session returns
`401`; unexpected errors return `500`.

### `POST /api/count-activities`

Returns the number of activities belonging to the signed-in user. The session
cookie identifies the user; no request body is needed.

```http
POST /api/count-activities
Cookie: session=<token>
```

```json
{ "count": 12 }
```

No session returns `401`; unexpected errors return `500`.

### `POST /api/update-activity-status`

Updates an activity's status using its ID and the requested status:

```http
POST /api/update-activity-status
Content-Type: application/json

{
  "activityId": "507f1f77bcf86cd799439013",
  "status": "VISITED"
}
```

The handler returns `true` when an activity is modified, `false` when no
activity is modified, and `null` for an invalid activity ID. Unexpected errors
return `500` with `{ "error": "Failed to update activity status" }`. This
handler does not verify a session cookie or validate the status at runtime.
