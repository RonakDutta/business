# Business 4.0 — Backend

Express API for the Business 4.0 community site. Postgres on **Neon**, image
hosting on **Cloudinary**, stateless auth with **JWT**.

> Status: **scaffold**. The structure, schema, routes and controllers are in
> place and the server runs, but nothing here is wired to the frontend yet —
> the React app still uses its localStorage stubs. Connecting them is a later
> step.

## Stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Runtime        | Node (ESM) + Express                    |
| Database       | Neon (Postgres) via `pg`                |
| Images         | Cloudinary (`multer` memory → stream)   |
| Auth           | JWT (`jsonwebtoken`) + `bcryptjs`       |

## Getting started

```bash
cd server
npm install
cp .env.example .env      # then fill in DATABASE_URL, JWT_SECRET, CLOUDINARY_*
npm run db:migrate        # create tables (idempotent)
npm run db:seed           # default venue + first admin (from ADMIN_* vars)
npm run dev               # http://localhost:4000  (health: /api/health)
```

`/api/health` reports whether the DB and Cloudinary are reachable/configured,
so you can verify the wiring before touching anything else.

## Folder layout

```
server/
├─ .env.example            every variable the server reads, documented
└─ src/
   ├─ index.js             boots the HTTP server + graceful shutdown
   ├─ app.js               express app: middleware + route mounting
   ├─ config/
   │  ├─ env.js            reads & validates process.env (single source)
   │  ├─ db.js             Neon Postgres pool + query()/getClient()/ping()
   │  └─ cloudinary.js     Cloudinary config + uploadBuffer()/destroyAsset()
   ├─ db/
   │  ├─ schema.sql        table definitions (idempotent)
   │  ├─ migrate.js        applies schema.sql   (npm run db:migrate)
   │  └─ seed.js           default venue + admin (npm run db:seed)
   ├─ middleware/
   │  ├─ auth.js           authenticate / requireAdmin / optionalAuth
   │  ├─ upload.js         multer (in-memory) for image uploads
   │  ├─ error.js          central error handler
   │  └─ notFound.js       404 fallthrough
   ├─ utils/
   │  ├─ asyncHandler.js   async wrapper + ApiError
   │  ├─ password.js       bcrypt hash/verify
   │  └─ jwt.js            sign/verify tokens
   ├─ routes/              one router per resource, mounted in routes/index.js
   └─ controllers/         one controller per resource (request → db → json)
```

## Data model

Modelled straight off what the frontend already renders (see the referenced
files in `client/src`). Full DDL in [`src/db/schema.sql`](src/db/schema.sql).

| Table              | Purpose                                        | Frontend source                |
| ------------------ | ---------------------------------------------- | ------------------------------ |
| `users`            | accounts behind login/signup                   | `context/AuthContext.jsx`      |
| `events`           | the fortnightly meetups (one per date)         | `data/events.js`               |
| `rsvps`            | who's attending which meetup                   | `context/RsvpContext.jsx`      |
| `saved_events`     | the "Saved" tab                                | `context/SavedEventsContext`   |
| `photos`           | gallery photos, per event                      | `pages/GalleryPage.jsx`        |
| `team_members`     | the organisers                                 | `data/team.js`                 |
| `payments`         | UPI entry-fee proofs (pending/verified)        | `lib/payment-submission.js`    |
| `venues`           | the meetup location (one default)              | `data/venue.js`                |
| `subscribers`      | footer newsletter signups                      | `components/Footer.jsx`        |
| `contact_messages` | the contact form                               | `pages/Contact.jsx`            |

Event **status** (upcoming / past / cancelled) is derived from `event_date` at
read time — the same rule the client uses — not stored.

## API

All under `/api`. `(admin)` requires a Bearer token whose user has role `admin`;
`(auth)` requires any signed-in user; everything else is public.

```
GET    /api/health

POST   /api/auth/register        POST /api/auth/login        GET /api/auth/me (auth)

GET    /api/events               GET  /api/events/:id
POST   /api/events               PATCH /api/events/:id       DELETE /api/events/:id   (admin)
POST   /api/events/:id/rsvp      DELETE /api/events/:id/rsvp                          (auth)
GET    /api/events/:id/rsvps                                                          (admin)
GET    /api/events/:id/photos    POST /api/events/:id/photos                          (admin)
DELETE /api/photos/:id                                                                (admin)

GET    /api/rsvps/me                                                                  (auth)
GET    /api/saved   PUT /api/saved/:eventId   DELETE /api/saved/:eventId              (auth)

GET    /api/team                 POST/PATCH/DELETE /api/team[/:id]                     (admin)
POST   /api/payments             GET /api/payments   PATCH /api/payments/:id          (admin)
POST   /api/subscribers          GET /api/subscribers                                 (admin)
POST   /api/contact              GET /api/contact                                     (admin)
GET    /api/venue                PATCH /api/venue/:id                                 (admin)
```

Image uploads (`events`, `team`, `photos`, `payments`) are `multipart/form-data`
with the file under the field named in the route (`image` or `proof`).

## Not done yet (intentionally)

- No frontend wiring — the React contexts still use localStorage.
- No rate limiting, email sending, or refresh tokens.
- Single flat `schema.sql` rather than ordered migrations — swap in
  `node-pg-migrate` or Prisma when the schema starts changing in production.
