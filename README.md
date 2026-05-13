# Base Exchange Pro · Bangladesh Edition

> Instant USDC ↔ BDT on Base L2 — non-custodial, smart-escrow protected, zero platform fee.

![Base Exchange Pro](https://img.shields.io/badge/Base%20L2-0052FF?style=for-the-badge&logo=ethereum&logoColor=white)
![React](https://img.shields.io/badge/React%2018-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite%205-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%203-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Overview

Base Exchange Pro is a mobile-first P2P crypto exchange built for Bangladesh.  
Users can buy and sell USDC via bKash, Nagad, and Rocket — all protected by a Base smart-contract escrow.

**Key properties**

| Property        | Value                     |
|-----------------|---------------------------|
| Network         | Base (Coinbase L2)        |
| Asset           | USDC                      |
| Fiat gateways   | bKash · Nagad · Rocket    |
| Settlement      | 3–5 minutes               |
| Platform fee    | 0%                        |
| Custody model   | Non-custodial / P2P escrow|

---

## Tech Stack

- **React 18** — UI component tree
- **Vite 5** — bundler and dev server
- **Tailwind CSS 3** — utility-first styling + custom design tokens
- **Lucide React** — icon system
- **Space Mono + Syne** — typeface system (data · display)
- **Canvas API** — particle network background animation
- **GitHub Actions** — CI/CD to GitHub Pages

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/your-org/base-exchange-pro.git
cd base-exchange-pro

# 2. Install
npm install

# 3. Dev server (http://localhost:5173)
npm run dev

# 4. Production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## Project Structure

```
base-exchange-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Pages CI/CD
├── public/
│   └── icon.svg              ← App icon
├── src/
│   ├── App.jsx               ← Main application (all UI logic)
│   ├── main.jsx              ← React DOM entry point
│   └── index.css             ← Global styles, design tokens, animations
├── index.html                ← Document shell (fonts, meta, PWA hints)
├── package.json
├── postcss.config.js
├── tailwind.config.js        ← Extended design token system
├── vite.config.js
└── README.md
```

---

## Design System

### Colors
| Token          | Value     | Usage                  |
|----------------|-----------|------------------------|
| `--blue`       | `#0052FF` | Primary / Base brand   |
| `--green`      | `#00E87A` | Success / confirmations|
| `--orange`     | `#FF6B35` | Sell / warning         |
| `--void`       | `#030712` | Page background        |

### Typography
| Role    | Font        | Weights    |
|---------|-------------|------------|
| Display | Syne        | 400–800    |
| Data    | Space Mono  | 400, 700   |

### Animation
All animations are defined as CSS keyframes in `index.css` and exposed as utility classes (`anim-fade-up`, `anim-scale-in`, `anim-spin`, etc.) with stagger delay helpers (`delay-100` … `delay-600`).

---

## Deployment

The repo is pre-configured for GitHub Pages via the included Actions workflow.

1. Push to `main`
2. Actions will `npm ci && npm run build`
3. The `dist/` folder is deployed to `gh-pages`

For custom domains, add a `CNAME` file to `public/`.

---

## License

MIT — free to use, fork, and build upon.
