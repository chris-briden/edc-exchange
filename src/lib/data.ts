// Mock data for EDC Exchange prototype

export type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  joinDate: string;
  itemCount: number;
  followers: number;
  following: number;
  badges: string[];
};

export type EDCItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  condition: string;
  listingType: "sell" | "trade" | "lend" | "rent" | "showcase";
  price?: number;
  rentPrice?: string;
  owner: User;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
};

export type CommunityPost = {
  id: string;
  type: "collection" | "review" | "discussion" | "photo";
  title: string;
  content: string;
  author: User;
  images: string[];
  items: string[];
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
};

export const categories: Category[] = [
  { id: "knives", name: "Knives", icon: "🔪", count: 2847, description: "Folding knives, fixed blades, multi-blade knives" },
  { id: "flashlights", name: "Flashlights", icon: "🔦", count: 1563, description: "EDC lights, keychain lights, tactical lights" },
  { id: "pens", name: "Pens", icon: "🖊️", count: 1201, description: "Tactical pens, fountain pens, bolt-action pens" },
  { id: "multi-tools", name: "Multi-Tools", icon: "🔧", count: 982, description: "Swiss army knives, pliers-based, keychain tools" },
  { id: "fidget", name: "Fidget Gear", icon: "🌀", count: 756, description: "Spinners, sliders, worry coins, fidget tools" },
  { id: "wallets", name: "Wallets", icon: "👛", count: 634, description: "Minimalist wallets, card holders, money clips" },
  { id: "watches", name: "Watches", icon: "⌚", count: 1892, description: "Field watches, dive watches, digital, smart" },
  { id: "bags", name: "Bags & Pouches", icon: "🎒", count: 445, description: "Organizer pouches, sling bags, tech rolls" },
];

export const users: User[] = [
  {
    id: "u1",
    username: "BladeRunner_EDC",
    avatar: "",
    bio: "Knife collector and reviewer. 15+ years in the EDC game.",
    joinDate: "2024-03-15",
    itemCount: 127,
    followers: 2341,
    following: 189,
    badges: ["Top Contributor", "Verified Seller", "OG Member"],
  },
  {
    id: "u2",
    username: "LumenJunkie",
    avatar: "",
    bio: "Flashlight enthusiast. If it emits photons, I want it.",
    joinDate: "2024-06-22",
    itemCount: 84,
    followers: 1567,
    following: 234,
    badges: ["Verified Seller", "Flashlight Expert"],
  },
  {
    id: "u3",
    username: "TitaniumTom",
    avatar: "",
    bio: "Ti everything. Custom scales, clips, and beads.",
    joinDate: "2024-01-10",
    itemCount: 203,
    followers: 3892,
    following: 145,
    badges: ["Top Contributor", "Master Collector", "OG Member"],
  },
  {
    id: "u4",
    username: "PenPalDave",
    avatar: "",
    bio: "Writing instrument nerd. Bolt-actions are life.",
    joinDate: "2024-09-05",
    itemCount: 56,
    followers: 892,
    following: 312,
    badges: ["Pen Specialist"],
  },
];

export const edcItems: EDCItem[] = [
  {
    id: "i1",
    name: "Benchmade Bugout 535",
    brand: "Benchmade",
    category: "knives",
    image: "",
    description: "Lightweight EDC folder. AXIS lock, S30V steel, blue Grivory handles. Carried for 3 months, excellent condition.",
    condition: "Like New",
    listingType: "sell",
    price: 125,
    owner: users[0],
    likes: 47,
    comments: 12,
    createdAt: "2026-02-08",
    tags: ["benchmade", "bugout", "lightweight", "s30v"],
  },
  {
    id: "i2",
    name: "Emisar D4V2 Ti",
    brand: "Emisar",
    category: "flashlights",
    image: "",
    description: "Titanium D4V2 with SST-20 4000K emitters. Raw Ti with beautiful patina starting to form.",
    condition: "Good",
    listingType: "trade",
    owner: users[1],
    likes: 83,
    comments: 24,
    createdAt: "2026-02-06",
    tags: ["emisar", "titanium", "d4v2", "enthusiast"],
  },
  {
    id: "i3",
    name: "Tactile Turn Bolt Action Short",
    brand: "Tactile Turn",
    category: "pens",
    image: "",
    description: "Titanium bolt-action pen, short size. Incredibly satisfying action. Takes Pilot G2 refills.",
    condition: "Excellent",
    listingType: "sell",
    price: 89,
    owner: users[3],
    likes: 62,
    comments: 8,
    createdAt: "2026-02-09",
    tags: ["tactile-turn", "bolt-action", "titanium", "pen"],
  },
  {
    id: "i4",
    name: "Leatherman Wave+",
    brand: "Leatherman",
    category: "multi-tools",
    image: "",
    description: "The classic EDC multi-tool. Comes with leather sheath. Some light scratches from use.",
    condition: "Good",
    listingType: "lend",
    owner: users[2],
    likes: 35,
    comments: 6,
    createdAt: "2026-02-07",
    tags: ["leatherman", "wave", "multi-tool", "classic"],
  },
  {
    id: "i5",
    name: "CRK Large Sebenza 31",
    brand: "Chris Reeve Knives",
    category: "knives",
    image: "",
    description: "DOB: Jan 2025. Glass blast titanium handles, S45VN steel. Carried sparingly, no snail trails.",
    condition: "Like New",
    listingType: "sell",
    price: 425,
    owner: users[2],
    likes: 156,
    comments: 41,
    createdAt: "2026-02-10",
    tags: ["crk", "sebenza", "grail", "s45vn", "titanium"],
  },
  {
    id: "i6",
    name: "Olight Warrior Mini 2",
    brand: "Olight",
    category: "flashlights",
    image: "",
    description: "Great pocket light. 1750 lumens, magnetic tail cap. Desert Tan limited edition.",
    condition: "New",
    listingType: "sell",
    price: 65,
    owner: users[1],
    likes: 29,
    comments: 5,
    createdAt: "2026-02-05",
    tags: ["olight", "warrior", "tactical", "limited-edition"],
  },
  {
    id: "i7",
    name: "Billetspin Gambit Spinner",
    brand: "Billetspin",
    category: "fidget",
    image: "",
    description: "Zirc and copper Gambit spinner. Incredible spin time. Perfect desk fidget.",
    condition: "Excellent",
    listingType: "rent",
    rentPrice: "$5/week",
    owner: users[2],
    likes: 44,
    comments: 15,
    createdAt: "2026-02-04",
    tags: ["billetspin", "spinner", "zirconium", "fidget"],
  },
  {
    id: "i8",
    name: "Ridge Wallet Titanium",
    brand: "The Ridge",
    category: "wallets",
    image: "",
    description: "Titanium Ridge wallet with money clip. Holds 12 cards comfortably. Barely used.",
    condition: "Like New",
    listingType: "trade",
    owner: users[0],
    likes: 38,
    comments: 9,
    createdAt: "2026-02-03",
    tags: ["ridge", "wallet", "titanium", "minimalist"],
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "p1",
    type: "collection",
    title: "My Titanium Tuesday carry — all Ti everything 🤘",
    content: "Finally completed my all-titanium loadout. CRK Sebenza, Emisar D4V2 Ti, Tactile Turn pen, and a Ti Ridge wallet. Took 2 years to put this together. What do you think?",
    author: users[2],
    images: [],
    items: ["CRK Sebenza 31", "Emisar D4V2 Ti", "Tactile Turn Short", "Ridge Wallet Ti"],
    likes: 342,
    comments: 67,
    createdAt: "2026-02-11",
    tags: ["titanium-tuesday", "collection", "grails"],
  },
  {
    id: "p2",
    type: "review",
    title: "Benchmade Bugout — 6 Month Review (Honest Take)",
    content: "After carrying the Bugout daily for 6 months, here are my real thoughts. The lightweight design is incredible for pocket carry, but the thin handles might not be for everyone. The AXIS lock is addictive. S30V holds up well for general EDC tasks. Would I buy it again? Absolutely.",
    author: users[0],
    images: [],
    items: ["Benchmade Bugout 535"],
    likes: 218,
    comments: 45,
    createdAt: "2026-02-10",
    tags: ["review", "benchmade", "bugout", "honest-review"],
  },
  {
    id: "p3",
    type: "discussion",
    title: "What's your unpopular EDC opinion? 🌶️",
    content: "I'll go first: Victorinox SAKs are more practical than 90% of \"tactical\" knives. They're lighter, legal almost everywhere, and the tool selection is actually useful. Fight me.",
    author: users[3],
    images: [],
    items: [],
    likes: 567,
    comments: 234,
    createdAt: "2026-02-09",
    tags: ["discussion", "hot-take", "unpopular-opinion"],
  },
  {
    id: "p4",
    type: "photo",
    title: "New light day! Emisar D4V2 in copper 🔦",
    content: "Just arrived and this thing is gorgeous. The weight, the machining, the instant turbo. I may have a problem... this is my 4th D4V2. Anyone else addicted to Hank lights?",
    author: users[1],
    images: [],
    items: ["Emisar D4V2 Copper"],
    likes: 189,
    comments: 38,
    createdAt: "2026-02-08",
    tags: ["new-pickup", "emisar", "flashlight", "copper"],
  },
  {
    id: "p5",
    type: "collection",
    title: "Budget EDC that punches above its weight",
    content: "Not everything needs to be $400 titanium. My daily carry: Civivi Elementum ($55), Wurkkos FC11 ($25), Zebra F-701 pen ($8), and a Herschel wallet ($35). Total under $125 and it all works great.",
    author: users[0],
    images: [],
    items: ["Civivi Elementum", "Wurkkos FC11", "Zebra F-701", "Herschel Wallet"],
    likes: 421,
    comments: 89,
    createdAt: "2026-02-07",
    tags: ["budget", "value", "everyday-carry", "recommendation"],
  },
];

// Color palette for category cards (dark theme with subtle orange accent)
export const categoryColors: Record<string, string> = {
  knives: "from-orange-900/80 to-zinc-900",
  flashlights: "from-orange-900/80 to-zinc-900",
  pens: "from-orange-900/80 to-zinc-900",
  "multi-tools": "from-orange-900/80 to-zinc-900",
  fidget: "from-orange-900/80 to-zinc-900",
  wallets: "from-orange-900/80 to-zinc-900",
  watches: "from-orange-900/80 to-zinc-900",
  bags: "from-orange-900/80 to-zinc-900",
};

// Listing type colors and labels
export const listingTypeConfig: Record<string, { color: string; label: string; bg: string }> = {
  sell: { color: "text-green-700", label: "For Sale", bg: "bg-green-100" },
  trade: { color: "text-amber-700", label: "For Trade", bg: "bg-amber-100" },
  lend: { color: "text-purple-700", label: "Available to Lend", bg: "bg-purple-100" },
  rent: { color: "text-amber-700", label: "For Rent", bg: "bg-amber-100" },
  showcase: { color: "text-gray-700", label: "Showcase", bg: "bg-gray-100" },
};

