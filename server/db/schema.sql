create extension if not exists "pgcrypto";

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'member' check (role in ('member', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists venues (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  short_name    text,
  address       text,
  city          text,
  gate          text,
  entry_note    text,
  metro         jsonb,
  helpline      text,
  helpline_note text,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists events (
  id                uuid primary key default gen_random_uuid(),
  event_date        date not null unique,
  title             text not null default 'Business4.0 Meetup (Entry Fee Applicable)',
  entry_fee         integer not null default 150,
  description       text[],
  image_url         text,
  image_public_id   text,
  attendee_count    integer not null default 0,
  cancelled         boolean not null default false,
  venue_id          uuid references venues(id) on delete set null,
  location_override jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists events_event_date_idx on events (event_date);

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

create table if not exists saved_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  event_id   uuid not null references events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists photos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  url        text not null,
  public_id  text,
  alt        text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists photos_event_id_idx on photos (event_id);

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

create table if not exists payments (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid references events(id) on delete set null,
  user_id          uuid references users(id) on delete set null,
  payer_name       text,
  payer_email      text,
  payment_ref      text,
  amount           integer,
  proof_url        text,
  proof_public_id  text,
  status           text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at       timestamptz not null default now()
);
create index if not exists payments_event_id_idx on payments (event_id);

create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_event_id_idx on comments (event_id, created_at desc);

create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  topic      text,
  message    text not null,
  created_at timestamptz not null default now()
);
