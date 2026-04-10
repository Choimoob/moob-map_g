"use client";

import { useEffect, useState } from "react";
import { Place, Post, Comment } from "@/types";

interface Props {
  place: Place;
  open: boolean;
  onClose: () => void;
}

// SNS 아이콘
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// 리뷰 접힘 컴포넌트
function ReviewAccordion({ reviews }: { reviews: string }) {
  const [open, setOpen] = useState(false);
  const reviewList = reviews.split(" | ").filter(Boolean);
  if (reviewList.length === 0) return null;

  return (
    <div className="border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <span>리뷰 {reviewList.length}개</span>
        <span className="text-gray-400 text-lg leading-none">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="divide-y max-h-56 overflow-y-auto">
          {reviewList.map((r, i) => (
            <p key={i} className="px-3 py-2 text-xs text-gray-600 leading-relaxed">{r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// SNS 링크 컴포넌트
function SnsLinks({ place }: { place: Place }) {
  const links = [
    { label: "Instagram", url: place.instagram, icon: <InstagramIcon />, color: "text-pink-500" },
    { label: "X", url: place.twitter, icon: <XIcon />, color: "text-gray-800" },
    { label: "Facebook", url: place.facebook, icon: <FacebookIcon />, color: "text-blue-600" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-2 mb-3">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium ${l.color} hover:bg-gray-50 transition-colors`}
        >
          {l.icon}
          {l.label}
        </a>
      ))}
    </div>
  );
}

export default function BoardPanel({ place, open, onClose }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [view, setView] = useState<"list" | "write" | "detail">("list");

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setView("list");
      setSelectedPost(null);
      loadPosts();
    }
  }, [place.id, open]);

  async function loadPosts() {
    const res = await fetch(`/api/posts?place_id=${place.id}`);
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  }

  async function submitPost() {
    setError("");
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (password.length !== 4) {
      setError("비밀번호는 4자리여야 합니다.");
      return;
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place_id: place.id, nickname, password, content }),
    });
    if (res.ok) {
      setNickname(""); setPassword(""); setContent("");
      setView("list");
      loadPosts();
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
    }
  }

  // 모바일: 하단 슬라이드업 / 데스크탑: 우측 고정
  const panelClass = `
    fixed z-20 bg-white shadow-2xl flex flex-col
    bottom-0 left-0 right-0 rounded-t-2xl
    md:top-0 md:right-0 md:bottom-0 md:left-auto md:rounded-none md:w-[400px]
    transition-transform duration-300
    ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}
    h-[85vh] md:h-full
  `;

  return (
    <>
      {/* 모바일 배경 딤 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={panelClass}>
        {/* 핸들 (모바일) */}
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-start justify-between px-4 py-3 border-b bg-gray-50 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-800 text-base truncate">{place.name}</h2>
            <p className="text-xs text-gray-500 truncate">{place.address}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600 capitalize">
              {place.category} · {place.city}
            </span>
          </div>
          <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0">×</button>
        </div>

        {/* 게시글 목록 */}
        {view === "list" && (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* SNS + 리뷰 */}
              <div className="px-4 pt-3">
                <SnsLinks place={place} />
                {place.reviews && <ReviewAccordion reviews={place.reviews} />}
              </div>

              <div className="divide-y">
                {posts.length === 0 && (
                  <p className="text-center text-gray-400 py-10 text-sm">아직 글이 없어요. 첫 글을 남겨보세요!</p>
                )}
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => { setSelectedPost(post); setView("detail"); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-800">{post.nickname}</span>
                      <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t flex-shrink-0">
              <button
                onClick={() => setView("write")}
                className="w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                글 쓰기
              </button>
            </div>
          </>
        )}

        {/* 글쓰기 */}
        {view === "write" && (
          <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
            <button onClick={() => { setView("list"); setError(""); }} className="text-sm text-gray-500 hover:text-gray-700 self-start">← 목록으로</button>
            <h3 className="font-bold text-gray-800">글 쓰기</h3>
            <div className="flex gap-2">
              <input
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
              <input
                placeholder="비밀번호 4자리"
                type="password"
                maxLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-32 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={submitPost}
              className="py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              등록
            </button>
          </div>
        )}

        {/* 게시글 상세 */}
        {view === "detail" && selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => { setSelectedPost(null); setView("list"); }}
          />
        )}
      </div>
    </>
  );
}

function PostDetail({ post, onBack }: { post: Post; onBack: () => void }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { loadComments(); }, [post.id]);

  async function loadComments() {
    const res = await fetch(`/api/comments?post_id=${post.id}`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  }

  async function submitComment() {
    setError("");
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (password.length !== 4) {
      setError("비밀번호는 4자리여야 합니다.");
      return;
    }
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id, nickname, password, content }),
    });
    if (res.ok) {
      setNickname(""); setPassword(""); setContent("");
      loadComments();
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b flex-shrink-0">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">← 목록으로</button>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-gray-800">{post.nickname}</span>
          <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y px-4">
        <p className="text-xs text-gray-400 py-2">댓글 {comments.length}개</p>
        {comments.map((c) => (
          <div key={c.id} className="py-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm text-gray-800">{c.nickname}</span>
              <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("ko-KR")}</span>
            </div>
            <p className="text-sm text-gray-600">{c.content}</p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-gray-50 flex-shrink-0 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          />
          <input
            placeholder="비번 4자리"
            type="password"
            maxLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-28 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <input
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitComment()}
            className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          />
          <button
            onClick={submitComment}
            className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            등록
          </button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
}
