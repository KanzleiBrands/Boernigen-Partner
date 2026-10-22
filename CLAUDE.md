@AGENTS.md

# Design-Regeln für Creatives und Seiten-Visuals

- **Nie Text, Logo, Buttons oder Overlays (Chat-Bubbles, Badges, Sticker) auf ein Gesicht legen.** Stirn bis Kinn
  bleiben komplett frei, mit sichtbarem Abstand. Overlays gehören neben oder unter das Gesicht (Schulter, Hintergrund).
- In `creatives/meta/src/build.mjs` ist das automatisch abgesichert: Jedes Foto bekommt eine Gesichts-Box (`faceBox`),
  der Build bricht ab, sobald ein Element darauf liegt. Neue Fotos immer mit eigener Gesichts-Box einbauen.
- Story 9:16: oben 250 px und unten 340 px frei von Text (Meta-Profil und CTA-Sticker).
- Nach jedem Rendern die PNGs selbst ansehen, bevor sie rausgehen.
