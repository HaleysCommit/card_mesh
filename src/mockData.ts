import type { Broadcast, Listing, Peer } from "./types";

export const peers: Peer[] = [
  {
    id: "atlas-comics",
    name: "Atlas Comics",
    booth: "A14",
    status: "online",
    signal: 94,
    specialties: ["Pokemon", "Magic", "sports"],
    distance: "8m away",
  },
  {
    id: "mint-condition",
    name: "Mint Condition Mart",
    booth: "B07",
    status: "trading",
    signal: 81,
    specialties: ["graded", "sealed", "modern"],
    distance: "12m away",
  },
  {
    id: "night-shift-deals",
    name: "Night Shift Deals",
    booth: "C22",
    status: "busy",
    signal: 68,
    specialties: ["anime", "one-piece", "yugioh"],
    distance: "24m away",
  },
  {
    id: "binder-bolt",
    name: "Binder Bolt",
    booth: "D11",
    status: "online",
    signal: 88,
    specialties: ["trade binders", "bulk", "promo"],
    distance: "17m away",
  },
];

export const listings: Listing[] = [
  {
    id: "base-set-venasaur",
    title: "Base Set Venusaur",
    kind: "trade",
    owner: "Atlas Comics",
    location: "A14",
    condition: "LP",
    price: "Trade for raw vintage or sealed product",
    tags: ["pokemon", "wotc", "base"],
  },
  {
    id: "one-piece-alternate-art",
    title: "One Piece Alternate Art Pulls",
    kind: "sale",
    owner: "Mint Condition Mart",
    location: "B07",
    condition: "NM",
    price: "$45-$120",
    tags: ["one-piece", "alt art", "fresh pulls"],
  },
  {
    id: "graded-grails",
    title: "PSA 10 Grails Wanted",
    kind: "want",
    owner: "Binder Bolt",
    location: "D11",
    condition: "Open to offers",
    price: "Bring your best trade binder",
    tags: ["graded", "high-end", "wishlist"],
  },
  {
    id: "vstar-universe",
    title: "VSTAR Universe Slabs",
    kind: "sale",
    owner: "Night Shift Deals",
    location: "C22",
    condition: "Mint",
    price: "$180 each",
    tags: ["pokemon", "slab", "japanese"],
  },
];

export const broadcasts: Broadcast[] = [
  {
    id: "broadcast-1",
    title: "Opening trade window",
    detail: "Looking for vintage holos and sealed ETBs. Meet at A14 or ping me locally.",
    kind: "trade",
    createdAt: "2 min ago",
  },
  {
    id: "broadcast-2",
    title: "Flash sale live",
    detail: "20 percent off raw singles for the next hour. Local pickup only.",
    kind: "sale",
    createdAt: "11 min ago",
  },
];
