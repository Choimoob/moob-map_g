"use client";

import { Place } from "@/types";

interface Props {
  place: Place;
}

// 카테고리별 Agoda 제휴 링크 (추후 실제 어필리에이트 링크로 교체)
const AGODA_LINKS: Record<string, string> = {
  seoul: "https://www.agoda.com/search?city=17168&adults=2",
  busan: "https://www.agoda.com/search?city=17214&adults=2",
  tokyo: "https://www.agoda.com/search?city=17196&adults=2",
  bangkok: "https://www.agoda.com/search?city=17169&adults=2",
  taipei: "https://www.agoda.com/search?city=17197&adults=2",
};

const OWNER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe_placeholder/viewform";

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" aria-hidden>
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" aria-hidden>
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

export default function NativeAdBanner({ place }: Props) {
  const cityKey = place.city?.toLowerCase() ?? "";
  const agodaUrl =
    AGODA_LINKS[cityKey] ?? "https://www.agoda.com/search?adults=2";

  // 랜덤으로 A(어필리에이트) or B(오너 영업) 배너 선택
  const showAffiliate = Math.random() > 0.4; // 60% Agoda, 40% 오너 배너

  if (showAffiliate) {
    return (
      <a
        href={agodaUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center gap-3 mx-4 mb-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 shadow-sm hover:shadow-md transition-shadow group"
      >
        <span className="text-rose-400 group-hover:scale-110 transition-transform">
          <BedIcon />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-rose-600 leading-tight">
            이 장소 근처 게이 프렌들리 숙소
          </p>
          <p className="text-xs text-rose-400 truncate">
            Agoda에서 최저가 예약하기 →
          </p>
        </div>
        <span className="text-[10px] text-rose-300 flex-shrink-0">AD</span>
      </a>
    );
  }

  return (
    <a
      href={OWNER_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 mx-4 mb-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 shadow-sm hover:shadow-md transition-shadow group"
    >
      <span className="text-amber-400 group-hover:scale-110 transition-transform">
        <CrownIcon />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-700 leading-tight">
          이 장소의 관리자이신가요?
        </p>
        <p className="text-xs text-amber-500 truncate">
          공식 뱃지 달고 홍보 메시지 노출하기 →
        </p>
      </div>
      <span className="text-[10px] text-amber-300 flex-shrink-0">B2B</span>
    </a>
  );
}
