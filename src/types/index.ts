export type PlaceCategory = "bar" | "club" | "cafe" | "sauna" | "other";

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  category: PlaceCategory;
  country: string;
  city: string;
  reviews?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface Post {
  id: string;
  place_id: string;
  nickname: string;
  password_hash: string;
  content: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  nickname: string;
  password_hash: string;
  content: string;
  created_at: string;
}
