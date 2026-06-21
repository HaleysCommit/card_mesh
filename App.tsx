import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { broadcasts as seedBroadcasts, listings, peers } from "./src/mockData";
import type { Broadcast, Listing, ListingKind, Peer } from "./src/types";

const kindLabels: Record<ListingKind, string> = {
  trade: "Trade",
  sale: "Sale",
  want: "Want",
};

const kindPalette: Record<ListingKind, { backgroundColor: string; color: string; borderColor: string }> = {
  trade: { backgroundColor: "rgba(58, 227, 167, 0.14)", color: "#72f0be", borderColor: "rgba(114, 240, 190, 0.28)" },
  sale: { backgroundColor: "rgba(255, 183, 77, 0.14)", color: "#ffcb7d", borderColor: "rgba(255, 203, 125, 0.26)" },
  want: { backgroundColor: "rgba(154, 144, 255, 0.14)", color: "#beb8ff", borderColor: "rgba(190, 184, 255, 0.26)" },
};

function signalLabel(signal: number) {
  if (signal >= 90) return "Excellent";
  if (signal >= 75) return "Strong";
  if (signal >= 60) return "Stable";
  return "Weak";
}

function SignalBars({ value }: { value: number }) {
  const bars = [24, 48, 68, 92];
  return (
    <View style={styles.signalBars}>
      {bars.map((height, index) => (
        <View
          key={`${height}-${index}`}
          style={[
            styles.signalBar,
            { height },
            value >= 60 + index * 10 ? styles.signalBarActive : styles.signalBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

function PeerCard({ peer, selected, onPress }: { peer: Peer; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.peerCard, selected && styles.peerCardSelected]}>
      <View style={styles.peerCardTopRow}>
        <View>
          <Text style={styles.peerName}>{peer.name}</Text>
          <Text style={styles.peerBooth}>{peer.booth}</Text>
        </View>
        <SignalBars value={peer.signal} />
      </View>
      <Text style={styles.peerMeta}>{peer.distance}</Text>
      <Text style={styles.peerSignal}>{signalLabel(peer.signal)} link</Text>
      <View style={styles.peerPillRow}>
        <Text style={styles.peerPill}>{peer.status}</Text>
      </View>
    </Pressable>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <View style={styles.listingCard}>
      <View style={styles.listingTopRow}>
        <View style={[styles.kindPill, kindPalette[listing.kind], { borderColor: kindPalette[listing.kind].borderColor }]}>
          <Text style={[styles.kindPillText, { color: kindPalette[listing.kind].color }]}>{kindLabels[listing.kind]}</Text>
        </View>
        <Text style={styles.listingOwner}>{listing.owner}</Text>
      </View>
      <Text style={styles.listingTitle}>{listing.title}</Text>
      <Text style={styles.listingMeta}>{listing.location} · {listing.condition}</Text>
      <Text style={styles.listingPrice}>{listing.price}</Text>
      <View style={styles.tagRow}>
        {listing.tags.map((tag) => (
          <Text key={tag} style={styles.tagText}>#{tag}</Text>
        ))}
      </View>
    </View>
  );
}

function BroadcastCard({ broadcast }: { broadcast: Broadcast }) {
  return (
    <View style={styles.broadcastCard}>
      <View style={styles.broadcastTopRow}>
        <View style={[styles.kindPill, kindPalette[broadcast.kind], { borderColor: kindPalette[broadcast.kind].borderColor }]}>
          <Text style={[styles.kindPillText, { color: kindPalette[broadcast.kind].color }]}>{kindLabels[broadcast.kind]}</Text>
        </View>
        <Text style={styles.broadcastTime}>{broadcast.createdAt}</Text>
      </View>
      <Text style={styles.broadcastTitle}>{broadcast.title}</Text>
      <Text style={styles.broadcastDetail}>{broadcast.detail}</Text>
    </View>
  );
}

export default function App() {
  const [selectedPeerId, setSelectedPeerId] = useState(peers[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [broadcastKind, setBroadcastKind] = useState<ListingKind>("trade");
  const [broadcastText, setBroadcastText] = useState("Looking to trade for sealed product and vintage holos.");
  const [liveBroadcasts, setLiveBroadcasts] = useState(seedBroadcasts);

  const selectedPeer = peers.find((peer) => peer.id === selectedPeerId) ?? peers[0];

  const visibleListings = useMemo(() => {
    const lowered = search.trim().toLowerCase();
    if (!lowered) return listings;
    return listings.filter((listing) => {
      const haystack = [listing.title, listing.owner, listing.location, listing.condition, listing.price, ...listing.tags].join(" ").toLowerCase();
      return haystack.includes(lowered);
    });
  }, [search]);

  const featuredListings = visibleListings.slice(0, 3);
  const pulseCount = Math.min(9, liveBroadcasts.length + peers.filter((peer) => peer.signal > 70).length);

  function publishBroadcast() {
    const message = broadcastText.trim();
    if (!message) return;
    setLiveBroadcasts((current) => [
      {
        id: `broadcast-${Date.now()}`,
        title: kindLabels[broadcastKind],
        detail: message,
        kind: broadcastKind,
        createdAt: "Just now",
      },
      ...current,
    ]);
    setBroadcastText("");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.background}>
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>CardMesh</Text>
            <Text style={styles.headerSubtext}>Nearby trade discovery</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Mesh live</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroKickerWrap}>
              <Text style={styles.heroKicker}>Convention floor intelligence</Text>
            </View>
            <View style={styles.heroPulseWrap}>
              <Text style={styles.heroPulseLabel}>Active nodes</Text>
              <View style={styles.heroPulseRow}>
                {Array.from({ length: pulseCount }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.heroPulseDot,
                      index < 3 && styles.heroPulseDotPrimary,
                      index >= 3 && index < 6 && styles.heroPulseDotSecondary,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.heroTitle}>A sleek local market for cards, trades, and live deal signals.</Text>
          <Text style={styles.heroCopy}>
            Browse inventory, post wants, and move fast without being locked to a single booth.
          </Text>

          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, styles.metricCardLarge]}>
              <Text style={styles.metricValue}>{peers.length}</Text>
              <Text style={styles.metricLabel}>Nearby peers</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{listings.length}</Text>
              <Text style={styles.metricLabel}>Listings</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{liveBroadcasts.length}</Text>
              <Text style={styles.metricLabel}>Signals</Text>
            </View>
          </View>
        </View>

        <View style={styles.bentoGrid}>
          <View style={[styles.panel, styles.panelWide]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby peers</Text>
              <Text style={styles.sectionHint}>Tap a node to inspect its booth, signal, and specialties.</Text>
            </View>
            <FlatList
              data={peers}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.peerList}
              renderItem={({ item }) => (
                <PeerCard peer={item} selected={item.id === selectedPeerId} onPress={() => setSelectedPeerId(item.id)} />
              )}
            />
          </View>

          <View style={styles.sideStack}>
            <View style={styles.panelCompact}>
              <Text style={styles.sideLabel}>Selected booth</Text>
              <Text style={styles.sideTitle}>{selectedPeer?.name}</Text>
              <Text style={styles.sideCopy}>
                {selectedPeer?.booth} · {selectedPeer?.status} · {selectedPeer?.distance}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.sideLabel}>Specialties</Text>
              <Text style={styles.sideCopy}>{selectedPeer?.specialties.join(" • ")}</Text>
            </View>

            <View style={styles.panelCompact}>
              <Text style={styles.sideLabel}>System mood</Text>
              <Text style={styles.sideTitle}>Calm, fast, discoverable.</Text>
              <Text style={styles.sideCopy}>Designed for convention browsing with quick reading and low visual noise.</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Inventory</Text>
              <Text style={styles.sectionHint}>Search across titles, tags, conditions, and booth locations.</Text>
            </View>
            <Text style={styles.sectionCount}>{visibleListings.length} live</Text>
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search inventory"
            placeholderTextColor="#8f98b3"
            style={styles.searchInput}
          />
          <View style={styles.featureGrid}>
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Broadcast studio</Text>
              <Text style={styles.sectionHint}>Publish a local trade, sale, or want alert.</Text>
            </View>
            <Text style={styles.sectionCount}>Local only</Text>
          </View>

          <View style={styles.segmentRow}>
            {(["trade", "sale", "want"] as ListingKind[]).map((kind) => (
              <Pressable key={kind} onPress={() => setBroadcastKind(kind)} style={[styles.segmentButton, broadcastKind === kind && styles.segmentButtonActive]}>
                <Text style={[styles.segmentText, broadcastKind === kind && styles.segmentTextActive]}>{kindLabels[kind]}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={broadcastText}
            onChangeText={setBroadcastText}
            multiline
            style={styles.broadcastInput}
            placeholder="Describe what you are looking for or offering"
            placeholderTextColor="#8f98b3"
          />

          <View style={styles.broadcastFooter}>
            <Text style={styles.broadcastFooterHint}>This becomes a live mesh signal for nearby peers.</Text>
            <Pressable onPress={publishBroadcast} style={styles.publishButton}>
              <Text style={styles.publishText}>Publish</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Live feed</Text>
              <Text style={styles.sectionHint}>Recent local broadcasts in a compact stream.</Text>
            </View>
            <Text style={styles.sectionCount}>{liveBroadcasts.length}</Text>
          </View>

          <FlatList
            data={liveBroadcasts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.feedSeparator} />}
            renderItem={({ item }) => <BroadcastCard broadcast={item} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#060b16",
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#060b16",
  },
  orbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(97, 123, 255, 0.28)",
  },
  orbBottom: {
    position: "absolute",
    bottom: -100,
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: "rgba(41, 214, 168, 0.18)",
  },
  container: {
    padding: 20,
    paddingBottom: 42,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: "#f4f7ff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  headerSubtext: {
    color: "#9aa4be",
    fontSize: 13,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#42f5b2",
    shadowColor: "#42f5b2",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  liveBadgeText: {
    color: "#f4f7ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroCard: {
    gap: 16,
    padding: 22,
    borderRadius: 30,
    backgroundColor: "rgba(10, 15, 32, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
    shadowColor: "#000",
    shadowOpacity: 0.34,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroKickerWrap: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroKicker: {
    color: "#aeb7d2",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  heroPulseWrap: {
    alignItems: "flex-end",
    gap: 8,
  },
  heroPulseLabel: {
    color: "#7f89a6",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroPulseRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  heroPulseDot: {
    width: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  heroPulseDotPrimary: {
    height: 28,
    backgroundColor: "#42f5b2",
  },
  heroPulseDotSecondary: {
    height: 20,
    backgroundColor: "#8f9cff",
  },
  heroTitle: {
    color: "#f7f9ff",
    fontSize: 33,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  heroCopy: {
    color: "#a5afc8",
    fontSize: 15,
    lineHeight: 22,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metricCardLarge: {
    flex: 1.2,
  },
  metricValue: {
    color: "#f7f9ff",
    fontSize: 22,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#96a1bd",
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  panel: {
    gap: 14,
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(10, 15, 32, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
  },
  panelWide: {
    flex: 1.2,
  },
  sideStack: {
    flex: 0.8,
    gap: 12,
  },
  panelCompact: {
    gap: 10,
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(10, 15, 32, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
  },
  sideLabel: {
    color: "#8d98b7",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sideTitle: {
    color: "#f7f9ff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  sideCopy: {
    color: "#a5afc8",
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 4,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: "#f7f9ff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  sectionHint: {
    color: "#8d98b7",
    fontSize: 13,
    lineHeight: 18,
  },
  sectionCount: {
    color: "#f7f9ff",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  peerList: {
    gap: 12,
    paddingRight: 8,
  },
  peerCard: {
    width: 196,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  peerCardSelected: {
    borderColor: "rgba(66, 245, 178, 0.5)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  peerCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  peerName: {
    color: "#f7f9ff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  peerBooth: {
    color: "#42f5b2",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 38,
  },
  signalBar: {
    width: 4,
    borderRadius: 4,
  },
  signalBarActive: {
    backgroundColor: "#42f5b2",
  },
  signalBarInactive: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  peerMeta: {
    color: "#96a1bd",
    fontSize: 13,
  },
  peerSignal: {
    color: "#dce3f5",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  peerPillRow: {
    flexDirection: "row",
  },
  peerPill: {
    color: "#f7f9ff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#f7f9ff",
    fontSize: 15,
  },
  featureGrid: {
    gap: 10,
  },
  listingCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  listingTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  listingOwner: {
    color: "#96a1bd",
    fontSize: 12,
    fontWeight: "600",
  },
  listingTitle: {
    color: "#f7f9ff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  listingMeta: {
    color: "#96a1bd",
    fontSize: 13,
  },
  listingPrice: {
    color: "#42f5b2",
    fontSize: 14,
    fontWeight: "700",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  tagText: {
    color: "#c4cbe0",
    fontSize: 12,
    fontWeight: "600",
  },
  kindPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  kindPillText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "rgba(66, 245, 178, 0.14)",
    borderColor: "rgba(66, 245, 178, 0.3)",
  },
  segmentText: {
    color: "#8d98b7",
    fontSize: 13,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#f7f9ff",
  },
  broadcastInput: {
    minHeight: 118,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#f7f9ff",
    fontSize: 15,
    textAlignVertical: "top",
  },
  broadcastFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  broadcastFooterHint: {
    flex: 1,
    color: "#8d98b7",
    fontSize: 12,
    lineHeight: 18,
  },
  publishButton: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#42f5b2",
    shadowColor: "#42f5b2",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  publishText: {
    color: "#08101d",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  feedSeparator: {
    height: 10,
  },
  broadcastCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  broadcastTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  broadcastTitle: {
    color: "#f7f9ff",
    fontSize: 16,
    fontWeight: "800",
  },
  broadcastDetail: {
    color: "#a5afc8",
    fontSize: 14,
    lineHeight: 20,
  },
  broadcastTime: {
    color: "#96a1bd",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});