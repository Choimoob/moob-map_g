"use client";

import { Place } from "@/types";

interface Props {
  currentPlace: Place;
  allPlaces: Place[];
  onSelectPlace: (place: Place) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  bar: "bg-red-100 text-red-600",
  club: "bg-purple-100 text-purple-600",
  cafe: "bg-orange-100 text-orange-600",
  sauna: "bg-blue-100 text-blue-600",
  other: "bg-green-100 text-green-600",
};

const CATEGORY_DOT: Record<string, string> = {
  bar: "bg-red-400",
  club: "bg-purple-400",
  cafe: "bg-orange-400",
  sauna: "bg-blue-400",
  other: "bg-green-400",
};

export default function RelatedPlaces({ currentPlace, allPlaces, onSelectPlace }: Props) {
  // 같은 카테고리 + 같은 도시, 현재 장소 제외, 최대 5개 후보
  const candidates = allPlaces.filter(
    (p) =>
      p.id !== currentPlace.id &&
      p.category === currentPlace.category &&
      p.city === currentPlace.city
  );

  if (candidates.length === 0) return null;

  // 랜덤 셔플 후 최대 3개
  const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${CATEGORY_DOT[currentPlace.category] ?? "bg-gray-400"}`} />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {currentPlace.city}의 다른 {currentPlace.category}
        </p>
      </div>

      {/* 가로 슬라이드 카드 */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {shuffled.map((place) => (
          <button
            key={place.id}
            onClick={() => onSelectPlace(place)}
            className="flex-shrink-0 w-40 text-left border rounded-xl p-3 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT[place.category] ?? "bg-gray-400"}`} />
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[place.category] ?? "bg-gray-100 text-gray-600"}`}>
                {place.category}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
              {place.name}
            </p>
            {place.address && (
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{place.address}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
