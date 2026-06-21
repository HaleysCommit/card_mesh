# CardMesh

CardMesh is a mobile-first Expo app for convention trading floors. It helps people discover nearby peers, browse local inventory, and publish trade or sale alerts without being tied to a single booth station.

## Current scope

- Nearby peer discovery view
- Inventory board with search
- Local trade, sale, and want broadcasts
- Offline-first app structure ready for real mesh networking later

## Run locally

1. Install dependencies.
2. Start the app with `npm run start`.
3. Open the Expo QR code in the Expo Go app or launch a simulator from the Expo menu.

If Expo warns that your Node version is too old, upgrade to Node 20.19+ or use a Node LTS release that matches the Expo SDK you install.

## Next steps

- Replace the mock peer and listing data with live discovery and sync.
- Add Bluetooth, Wi-Fi Direct, or local network transport adapters.
- Introduce persistent local storage for cached inventory and broadcasts.
