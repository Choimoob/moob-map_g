-- 게시글 테이블
create table posts (
  id uuid primary key default gen_random_uuid(),
  place_id text not null,
  nickname text not null,
  password_hash text not null,
  content text not null,
  created_at timestamptz default now()
);

-- 댓글 테이블
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  nickname text not null,
  password_hash text not null,
  content text not null,
  created_at timestamptz default now()
);

-- 인덱스
create index on posts(place_id);
create index on comments(post_id);
