-- Tara: initial schema.
-- Run once on a fresh Supabase project (SQL Editor).
--
-- Every table gets Row Level Security enabled and NO policies yet, so nothing
-- is readable or writable until the next migration adds exactly what we allow.

begin;

-- Accounts ------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 1 and 40),
  created_at timestamptz not null default now()
);

-- Trips and who can access them ----------------------------------------------

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  destination text not null
    check (char_length(btrim(destination)) between 1 and 120),
  start_date date not null,
  end_date date not null,
  description text not null default ''
    check (char_length(description) <= 1000),
  cover_image text not null default ''
    check (
      cover_image = ''
      or (cover_image ~* '^https?://' and char_length(cover_image) <= 500)
    ),
  status text not null default 'planning'
    check (status in ('planning', 'upcoming', 'ongoing', 'completed', 'archived')),
  traveler_count integer not null default 1 check (traveler_count >= 1),
  estimated_budget_per_person numeric(12, 2) not null default 0
    check (estimated_budget_per_person >= 0),
  created_at timestamptz not null default now(),
  check (start_date <= end_date)
);

-- Who may open a trip. The owner is added automatically in the next migration.
create table public.trip_members (
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

-- People named on a trip, used for splitting expenses. A friend can be listed
-- without having an account, so user_id is optional.
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  -- Lets other tables prove a participant belongs to the same trip.
  unique (id, trip_id)
);

-- Names are unique within a trip, ignoring case and surrounding spaces.
create unique index participants_trip_name_key
  on public.participants (trip_id, lower(btrim(name)));
-- One participant per account per trip.
create unique index participants_trip_user_key
  on public.participants (trip_id, user_id) where user_id is not null;

-- Itinerary -------------------------------------------------------------------

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  activity_date date not null,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  location_name text not null default ''
    check (char_length(location_name) <= 120),
  start_time time not null,
  end_time time, -- null means no end time
  description text not null default ''
    check (char_length(description) <= 1000),
  estimated_cost numeric(12, 2) not null default 0 check (estimated_cost >= 0),
  category text not null
    check (category in (
      'transportation', 'food', 'accommodation', 'sightseeing',
      'adventure', 'shopping', 'free-time', 'other'
    )),
  notes text not null default '' check (char_length(notes) <= 1000),
  url text not null default ''
    check (url = '' or (url ~* '^https?://' and char_length(url) <= 500)),
  completed boolean not null default false,
  -- The app currently uses array order. A database needs an explicit order.
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (end_time is null or end_time > start_time)
);

-- Budget ----------------------------------------------------------------------

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  category text not null
    check (category in (
      'transportation', 'accommodation', 'food', 'activities',
      'shopping', 'emergency', 'other'
    )),
  amount numeric(12, 2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

-- Expenses and how they are shared -------------------------------------------

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null
    check (category in (
      'transportation', 'accommodation', 'food', 'activities',
      'shopping', 'emergency', 'other'
    )),
  expense_date date not null,
  paid_by uuid not null,
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  unique (id, trip_id),
  -- The payer must be a participant of the same trip. This is left as NO
  -- ACTION on purpose: a participant who paid can't be deleted, but deleting
  -- the whole trip still works.
  foreign key (paid_by, trip_id)
    references public.participants (id, trip_id)
);

-- One row per person sharing an expense. amount is null for an equal split,
-- or that person's exact share for a custom split.
create table public.expense_shares (
  expense_id uuid not null,
  participant_id uuid not null,
  trip_id uuid not null references public.trips (id) on delete cascade,
  amount numeric(12, 2) check (amount is null or amount > 0),
  primary key (expense_id, participant_id),
  foreign key (expense_id, trip_id)
    references public.expenses (id, trip_id) on delete cascade,
  foreign key (participant_id, trip_id)
    references public.participants (id, trip_id)
);

-- Packing list ----------------------------------------------------------------

create table public.packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  category text not null
    check (category in ('essentials', 'clothing', 'personal', 'equipment')),
  packed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Polls (every poll belongs to a trip) ----------------------------------------

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  created_by uuid default auth.uid()
    references auth.users (id) on delete set null,
  question text not null check (char_length(btrim(question)) between 1 and 120),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls (id) on delete cascade,
  label text not null check (char_length(btrim(label)) between 1 and 60),
  sort_order integer not null default 0,
  unique (id, poll_id)
);

create unique index poll_options_poll_label_key
  on public.poll_options (poll_id, lower(btrim(label)));

-- One vote per account per poll. Changing a vote updates option_id.
create table public.votes (
  poll_id uuid not null references public.polls (id) on delete cascade,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  option_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id),
  -- The option must belong to the same poll.
  foreign key (option_id, poll_id)
    references public.poll_options (id, poll_id) on delete cascade
);

-- Invites ---------------------------------------------------------------------

create table public.trip_invites (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  code text not null unique default replace(gen_random_uuid()::text, '-', ''),
  created_by uuid default auth.uid()
    references auth.users (id) on delete set null,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

-- Indexes (Postgres does not index foreign keys automatically) -----------------

create index trip_members_user_id_idx on public.trip_members (user_id);
create index activities_trip_day_idx
  on public.activities (trip_id, activity_date, sort_order);
create index budget_items_trip_id_idx on public.budget_items (trip_id);
create index expenses_trip_date_idx on public.expenses (trip_id, expense_date);
create index expenses_paid_by_idx on public.expenses (paid_by, trip_id);
create index expense_shares_participant_idx
  on public.expense_shares (participant_id, trip_id);
create index packing_items_trip_id_idx on public.packing_items (trip_id);
create index polls_trip_id_idx on public.polls (trip_id);
create index votes_option_idx on public.votes (option_id, poll_id);
create index trip_invites_trip_id_idx on public.trip_invites (trip_id);

-- Lock everything down: RLS on, no access for logged-out users, table access
-- for signed-in users. With RLS on and no policies, nothing is visible yet.

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'profiles', 'trips', 'trip_members', 'participants', 'activities',
    'budget_items', 'expenses', 'expense_shares', 'packing_items',
    'polls', 'poll_options', 'votes', 'trip_invites'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('revoke all on table public.%I from anon', tbl);
    execute format(
      'grant select, insert, update, delete on table public.%I to authenticated',
      tbl
    );
  end loop;
end
$$;

commit;
