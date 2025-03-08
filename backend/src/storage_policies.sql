-- Enable RLS for storage.buckets
alter table storage.buckets enable row level security;

-- Create policies for storage.buckets
create policy "Enable bucket creation for authenticated users"
  on storage.buckets for insert
  to authenticated
  with check (true);

create policy "Enable bucket access for authenticated users"
  on storage.buckets for select
  to authenticated
  using (true);

-- Enable RLS for storage.objects
alter table storage.objects enable row level security;

-- Create policies for storage.objects
create policy "Enable object creation for authenticated users"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-content');

create policy "Enable object access for authenticated users"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blog-content');

create policy "Enable object update for authenticated users"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-content')
  with check (bucket_id = 'blog-content');

create policy "Enable object delete for authenticated users"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-content');