create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text,
  model text,
  year int,
  mileage int,
  price int,
  fuel text,
  gearbox text,
  engine text,
  nct text,
  tax text,
  vin text,
  location text,
  description text,
  phone text,
  image_url text,
  status text default 'available',
  created_at timestamptz default now()
);

alter table cars enable row level security;

drop policy if exists "Public can read cars" on cars;
create policy "Public can read cars"
on cars for select
using (true);

drop policy if exists "Anyone can insert cars for MVP" on cars;
create policy "Anyone can insert cars for MVP"
on cars for insert
with check (true);

drop policy if exists "Anyone can update cars for MVP" on cars;
create policy "Anyone can update cars for MVP"
on cars for update
using (true);

drop policy if exists "Anyone can delete cars for MVP" on cars;
create policy "Anyone can delete cars for MVP"
on cars for delete
using (true);
