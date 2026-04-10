import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

function hashPassword(pw: string) {
  return createHash("sha256").update(pw).digest("hex");
}

// GET /api/comments?post_id=xxx
export async function GET(req: NextRequest) {
  const post_id = req.nextUrl.searchParams.get("post_id");
  if (!post_id) return NextResponse.json({ error: "post_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, nickname, content, created_at")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/comments
export async function POST(req: NextRequest) {
  const { post_id, nickname, password, content } = await req.json();

  if (!post_id || !nickname || !password || !content) {
    return NextResponse.json({ error: "모든 필드를 입력해주세요" }, { status: 400 });
  }
  if (password.length !== 4) {
    return NextResponse.json({ error: "비밀번호는 4자리입니다" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id, nickname, password_hash: hashPassword(password), content })
    .select("id, post_id, nickname, content, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE /api/comments
export async function DELETE(req: NextRequest) {
  const { id, password } = await req.json();

  const { data: comment } = await supabase
    .from("comments")
    .select("password_hash")
    .eq("id", id)
    .single();

  if (!comment) return NextResponse.json({ error: "댓글이 없습니다" }, { status: 404 });
  if (comment.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 403 });
  }

  await supabase.from("comments").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
