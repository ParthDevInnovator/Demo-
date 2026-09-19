# NEXUS — Cloud Infrastructure Control Plane

A next-gen, enterprise-grade cloud infrastructure control plane built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Three.js**.

---

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

Use these accounts on the [Sign In](http://localhost:3000/signin) page:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Alex Chen | `alex.chen@enterprise.io` | `Nexus@2025!` | Principal SRE |
| NEXUS Admin | `admin@nexus.cloud` | `admin1234` | Platform Admin |

> **Note:** This is a demo environment. Sessions are stored in `localStorage` — no real authentication is performed.

---

## Routes

| Path | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page with 3D topology visualization |
| `/signin` | Public | Authentication page |
| `/dashboard` | Public | Overview — live cluster health, metrics, incident feed |
| `/compute` | 🔒 Auth required | Node pools, CPU/RAM usage, pod states, scaling |
| `/deployments` | 🔒 Auth required | Canary releases, rollbacks, revision tracking |
| `/observability` | 🔒 Auth required | Distributed tracing, log query, latency percentiles |
| `/security` | 🔒 Auth required | Zero-trust firewall, CVE scanner, IAM, compliance |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 with custom design tokens
- **3D**: Three.js — interactive infrastructure topology canvas
- **Fonts**: Plus Jakarta Sans · Inter · JetBrains Mono
- **Icons**: Material Symbols Outlined
