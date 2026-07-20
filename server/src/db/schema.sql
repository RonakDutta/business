-- ===========================================================================
-- Business 4.0 — database schema
--
-- Idempotent: every statement is CREATE ... IF NOT EXISTS, so running the
-- migration repeatedly is safe. `npm run db:migrate` executes this file.
--
-- Modelled straight off what the frontend already renders:
--   events        the fortnightly meetups (client/src/data/events.js)
--   users         accounts behind login/signup (AuthContext)
--   rsvps         who's attending which meetup (RsvpContext)
--   saved_events  the "saved" tab (SavedEventsContext, today localStorage)
--   photos        the gallery, per event
--   team_members  the organisers (client/src/data/team.js)
--   payments      UPI entry-fee proofs (client/src/data/payment.js)
--   venues        the meetup location (client/src/data/venue.js)
--   subscribers   the footer newsletter
--   contact_messages  the contact form (today a mailto)
-- ===========================================================================

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---- Users -----------------------------------------------------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'member' check (role in ('member', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---- Venues (one active venue for now; table supports more) -----------------
create table if not exists venues (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  short_name    text,
  address       text,
  city          text,
  gate          text,
  entry_note    text,
  metro         jsonb,          -- { station, exit, walk, walkTo }
  helpline      text,
  helpline_note text,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---- Events (meetups) ------------------------------------------------------
-- One meetup per calendar date, matching the frontend where the date is the id.
-- Status (upcoming / past / cancelled) is derived from event_date + cancelled
-- at read time, not stored — the same rule the client uses.
create table if not exists events (
  id                uuid primary key default gen_random_uuid(),
  event_date        date not null unique,
  title             text not null default 'Business4.0 Meetup (Entry Fee Applicable)',
  entry_fee         integer not null default 150,
  description       text[],          -- paragraphs
  image_url         text,
  image_public_id   text,            -- cloudinary handle, for deletes
  attendee_count    integer not null default 0,
  cancelled         boolean not null default false,
  venue_id          uuid references venues(id) on delete set null,
  location_override jsonb,           -- optional per-event location
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists events_event_date_idx on events (event_date);

-- ---- RSVPs -----------------------------------------------------------------
create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  event_id    uuid not null references events(id) on delete cascade,
  status      text not null default 'going' check (status in ('going', 'cancelled')),
  payment_ref text,
  created_at  timestamptz not null default now(),
  unique (user_id, event_id)
);
create index if not exists rsvps_event_id_idx on rsvps (event_id);

-- ---- Saved events ("saved" tab) --------------------------------------------
create table if not exists saved_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  event_id   uuid not null references events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ---- Gallery photos --------------------------------------------------------
create table if not exists photos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  url        text not null,
  public_id  text,            -- cloudinary handle, for deletes
  alt        text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists photos_event_id_idx on photos (event_id);

-- ---- Team (organisers) -----------------------------------------------------
create table if not exists team_members (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  role            text not null default 'Organiser',
  image_url       text,
  image_public_id text,
  linkedin_url    text,
  position        integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ---- Payments (entry-fee proofs) -------------------------------------------
create table if not exists payments (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid references events(id) on delete set null,
  user_id          uuid references users(id) on delete set null,
  payer_name       text,
  payer_email      text,
  payment_ref      text,
  amount           integer,
  proof_url        text,          -- cloudinary
  proof_public_id  text,
  status           text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at       timestamptz not null default now()
);
create index if not exists payments_event_id_idx on payments (event_id);

-- ---- Newsletter subscribers ------------------------------------------------
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ---- Contact messages ------------------------------------------------------
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  topic      text,
  message    text not null,
  created_at timestamptz not null default now()
);
