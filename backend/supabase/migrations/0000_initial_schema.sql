-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable pgvector for face embeddings
create extension if not exists vector;

-- 1. Profiles (Manages Auth & Roles)
-- Links to Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null check (role in ('admin', 'teacher', 'student')),
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- 2. Faculties (Departments)
create table faculties (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- 3. Batches
create table batches (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid references faculties(id) on delete cascade not null,
  name text not null
);

-- 4. Sections
create table sections (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references batches(id) on delete cascade not null,
  name text not null
);

-- 5. Subjects
-- Note: schema.sql linked subjects to sections. Keeping this strict hierarchy.
create table subjects (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade not null,
  name text not null,
  code text -- Added from mockData (code)
);

-- 6. Students (Academic Record)
create table students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null, -- Link to Auth
  section_id uuid references sections(id) on delete cascade not null,
  student_id text not null, -- University Student ID (Roll No)
  face_embedding vector(128),
  is_active boolean default true,
  face_registered boolean default false,
  created_at timestamptz default now() not null
);

-- 7. Teachers (Metadata)
create table teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  faculty_id uuid references faculties(id) on delete set null,
  employee_id text,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- 8. Teacher Assignments
-- Maps Teachers to Subjects
create table teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references teachers(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(teacher_id, subject_id)
);

-- 9. Routines
create table routines (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade not null,
  teacher_id uuid references teachers(id) on delete cascade not null, -- Links to teachers table
  day_of_week text not null,
  start_time time,
  end_time time,
  room_id text,
  created_at timestamptz default now() not null,
  unique(subject_id, day_of_week, start_time)
);

-- 10. Attendance Logs
create table attendance_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade not null,
  routine_id uuid references routines(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  date date not null default CURRENT_DATE,
  status text not null check (status in ('present', 'absent', 'late')),
  confidence float,
  timestamp timestamptz default now() not null
);

-- Indexes for performance
create index idx_profiles_role on profiles(role);
create index idx_students_section on students(section_id);
create index idx_routines_teacher on routines(teacher_id);
create index idx_attendance_student on attendance_logs(student_id);
create index idx_attendance_date on attendance_logs(date);
create index idx_attendance_subject on attendance_logs(subject_id);
