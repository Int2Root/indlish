export const SITE = {
  name: "indlish",
  tagline: "India ka apna social platform",
  description:
    "Hinglish-native microblogging where you post, tip creators via UPI, and vibe with your tribe. No algorithm BS — just real desi content.",
  url: "https://indlish.com",
  ogImage: "https://indlish.com/og.png",
  founder: "siddhartha@int2root.com",
  company: {
    name: "Int2Root LLP",
    url: "https://int2root.com",
  },
  social: {
    twitter: "@indlish",
    instagram: "@indlish",
  },
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Feed", href: "#feed" },
  { label: "Creators", href: "#creators" },
  { label: "Trending", href: "#trending" },
] as const;

export const FEATURES = [
  {
    emoji: "🗣️",
    title: "Hinglish First",
    desc: "Yahan Hindi-English mix karna cool hai, not cringe. Write jaise tum bolte ho.",
    gradient: "from-saffron-400 to-saffron-600",
  },
  {
    emoji: "💸",
    title: "UPI Tipping",
    desc: "Pasand aaya post? Seedha UPI se tip karo. Creator ko direct paisa, no middleman.",
    gradient: "from-neon-green to-emerald-500",
  },
  {
    emoji: "🔥",
    title: "Meme Friendly",
    desc: "Text posts, roasts, one-liners — sab chalega. Meme lords ka paradise hai yeh.",
    gradient: "from-neon-pink to-rose-500",
  },
  {
    emoji: "🚫",
    title: "No Algorithm BS",
    desc: "Koi algorithm nahi decide karega kya dikhega. Latest posts, real engagement, simple.",
    gradient: "from-neon-blue to-blue-500",
  },
  {
    emoji: "⚡",
    title: "Super Lightweight",
    desc: "2G pe bhi chalega bhai. Under 100KB load, kyunki data sasta nahi hai.",
    gradient: "from-neon-yellow to-amber-500",
  },
  {
    emoji: "🇮🇳",
    title: "Made in India",
    desc: "Apna platform, apne rules. India ke liye India ne banaya. Proud desi vibes only.",
    gradient: "from-green-400 to-emerald-600",
  },
] as const;

export const MOCK_POSTS = [
  {
    id: 1,
    author: "priya_codes",
    avatar: "P",
    avatarColor: "bg-neon-pink",
    handle: "@priya_codes",
    content:
      "Aaj finally React samajh aaya 😭🙏 3 months se lad rahi thi useState se. Ab toh main formik bhi seekh lungi 💪",
    time: "2m ago",
    likes: 234,
    tips: "₹45",
    comments: 18,
    reposts: 5,
  },
  {
    id: 2,
    author: "mumbai_ka_memer",
    avatar: "M",
    avatarColor: "bg-neon-blue",
    handle: "@mumbai_memer",
    content:
      "Local train mein seat milna > any interview crack karna. Fight me. 🚂💀",
    time: "8m ago",
    likes: 1892,
    tips: "₹320",
    comments: 147,
    reposts: 89,
  },
  {
    id: 3,
    author: "chai_philosopher",
    avatar: "C",
    avatarColor: "bg-saffron-500",
    handle: "@chai_thinker",
    content:
      "Hot take: Cutting chai > therapy. Ek glass mein sab sort ho jaata hai. ☕✨",
    time: "15m ago",
    likes: 567,
    tips: "₹78",
    comments: 42,
    reposts: 23,
  },
  {
    id: 4,
    author: "startup_wali",
    avatar: "S",
    avatarColor: "bg-neon-green",
    handle: "@startup_wali",
    content:
      "Investor ne bola 'we love your energy' and then ghosted. Bhai energy se funding milti toh Red Bull IPO kar deta 😂",
    time: "23m ago",
    likes: 3401,
    tips: "₹890",
    comments: 234,
    reposts: 156,
  },
] as const;

export const TRENDING_TOPICS = [
  { tag: "#HinglishVibes", posts: "12.4k", trend: "up" },
  { tag: "#ChaiPeCharcha", posts: "8.9k", trend: "up" },
  { tag: "#StartupLife", posts: "6.2k", trend: "up" },
  { tag: "#MumbaiMonsoon", posts: "5.8k", trend: "stable" },
  { tag: "#CodingInHindi", posts: "4.1k", trend: "up" },
  { tag: "#IPL2026", posts: "34.7k", trend: "up" },
  { tag: "#DesiMemes", posts: "9.3k", trend: "up" },
  { tag: "#UPITips", posts: "2.8k", trend: "up" },
] as const;

export const CREATORS = [
  {
    name: "Riya Sharma",
    handle: "@riya_writes",
    avatar: "R",
    avatarColor: "bg-neon-pink",
    bio: "Hinglish poet | Chai addict | Mumbai dreams",
    followers: "24.5k",
    tips: "₹1.2L",
    posts: 342,
  },
  {
    name: "Arjun Patel",
    handle: "@techbro_arjun",
    avatar: "A",
    avatarColor: "bg-neon-blue",
    bio: "SDE by day, memer by night | Bangalore se",
    followers: "18.2k",
    tips: "₹89k",
    posts: 567,
  },
  {
    name: "Zoya Khan",
    handle: "@zoya.creates",
    avatar: "Z",
    avatarColor: "bg-neon-green",
    bio: "Content creator | Desi fashion | Delhi girl",
    followers: "31.8k",
    tips: "₹2.1L",
    posts: 891,
  },
] as const;
