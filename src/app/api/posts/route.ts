import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

function hashPassword(pw: string) {
  return createHash("sha256").update(pw).digest("hex");
}

// GET /api/posts?place_id=xxx
export async function GET(req: NextRequest) {
  const place_id = req.nextUrl.searchParams.get("place_id");
  if (!place_id) return NextResponse.json({ error: "place_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("posts")
    .select("id, place_id, nickname, content, created_at")
    .eq("place_id", place_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/posts
export async function POST(req: NextRequest) {
  const { place_id, nickname, password, content } = await req.json();

  if (!place_id || !nickname || !password || !content) {
    return NextResponse.json({ error: "모든 필드를 입력해주세요" }, { status: 400 });
  }
  if (password.length !== 4) {
    return NextResponse.json({ error: "비밀번호는 4자리입니다" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ place_id, nickname, password_hash: hashPassword(password), content })
    .select("id, place_id, nickname, content, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE /api/posts
export async function DELETE(req: NextRequest) {
  const { id, password } = await req.json();

  const { data: post } = await supabase
    .from("posts")
    .select("password_hash")
    .eq("id", id)
    .single();

  if (!post) return NextResponse.json({ error: "게시글이 없습니다" }, { status: 404 });
  if (post.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 403 });
  }

  await supabase.from("posts").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
