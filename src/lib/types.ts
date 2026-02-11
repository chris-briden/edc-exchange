// Database-aligned TypeScript types for EDC Exchange

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  created_at: string;
};

export type Item = {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  brand: string | null;
  description: string | null;
  condition: string;
  listing_type: "sell" | "trade" | "lend" | "rent" | "showcase";
  price: number | null;
  rent_price: string | null;
  tags: string[];
  status: "active" | "sold" | "traded" | "removed";
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  categories?: Category;
  item_images?: ItemImage[];
};

export type ItemImage = {
  id: string;
  item_id: string;
  url: string;
  position: number;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  type: "collection" | "review" | "discussion" | "photo";
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  post_images?: PostImage[];
  likes?: { count: number }[];
  comments?: { count: number }[];
};

export type PostImage = {
  id: string;
  post_id: string;
  url: string;
  position: number;
  created_at: string;
};

export type Like = {
  id: string;
  user_id: string;
  item_id: string | null;
  post_id: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  item_id: string | null;
  post_id: string | null;
  content: string;
  created_at: string;
  // Joined
  profiles?: Profile;
};

export type Follower = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type EdcLoadout = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  edc_loadout_items?: EdcLoadoutItem[];
};

export type EdcLoadoutItem = {
  id: string;
  loadout_id: string;
  item_id: string;
  position: number;
  created_at: string;
  // Joined fields
  items?: Item;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  item_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined fields
  sender?: Profile;
  receiver?: Profile;
};
