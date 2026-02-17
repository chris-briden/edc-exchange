// Database-aligned TypeScript types for EDC Exchange

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  stripe_account_id: string | null;
  // Shipping address fields
  shipping_name: string | null;
  shipping_street1: string | null;
  shipping_street2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  created_at: string;
  updated_at: string;
};

/** Structured shipping address (used by Shippo & checkout) */
export type ShippingAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email?: string;
  phone?: string;
};

/** A shipping rate option returned from /api/shipping/rates */
export type ShippingRate = {
  rateId: string;
  carrier: string;
  serviceName: string;
  serviceToken: string;
  buyerPrice: number;
  currency: string;
  estimatedDays: number | null;
  _internal: {
    carrierRate: number;
    revenue: number;
    markupRate: number;
    shippoShipmentId: string;
  };
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
  shipping_cost: number | null;
  ships_from_country: string | null;
  accepts_returns: boolean;
  box_and_docs: string;
  views_count: number;
  favorites_count: number;
  last_renewed_at: string | null;
  rental_deposit: number | null;
  rental_period: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  categories?: Category;
  item_images?: ItemImage[];
  likes?: { count: number }[];
  comments?: { count: number }[];
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
  parent_id: string | null;
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

export type Transaction = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  platform_fee: number;
  stripe_payment_intent_id: string;
  security_deposit_payment_intent_id: string | null;
  type: "sale" | "rental";
  status: string;
  rental_start_date: string | null;
  rental_end_date: string | null;
  rental_status:
    | "active"
    | "returned"
    | "deposit_captured"
    | "deposit_released"
    | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  items?: Item;
  buyer?: Profile;
  seller?: Profile;
};
