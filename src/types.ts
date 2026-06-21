export type PeerStatus = "online" | "trading" | "busy";

export type Peer = {
  id: string;
  name: string;
  booth: string;
  status: PeerStatus;
  signal: number;
  specialties: string[];
  distance: string;
};

export type ListingKind = "trade" | "sale" | "want";

export type Listing = {
  id: string;
  title: string;
  kind: ListingKind;
  owner: string;
  location: string;
  condition: string;
  price: string;
  tags: string[];
};

export type Broadcast = {
  id: string;
  title: string;
  detail: string;
  kind: ListingKind;
  createdAt: string;
};
