# Müller Finance

Neue Website von Müller Finance (Buchhaltung, Personalwesen, Steuern – Klingnau).
Vite + `vite-plugin-pwa`, statisch. Push auf `main` deployt automatisch auf
`https://mueller-finance.lightweightluu.com`.

## Lokal
```bash
npm install
npm run dev
npm run build
```

## Aufbau
- `index.html` – Struktur und Inhalte
- `src/style.css` – Design-Tokens, Layout, Hell-/Dunkelmodus
- `src/main.js` – Animationen, Leistungs-Auswahl, Formular (mailto), SPA-Router
- `src/legal.js` – Impressum, Datenschutz, AGB

Original-URLs (`/buchhaltung`, `/personalwesen`, `/steuern`, `/ueber-mich`, `/kontakt`,
`/impressum`, `/datenschutz`, `/agb`) bleiben als Deep-Links gültig.
