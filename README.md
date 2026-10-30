# VMOVE LOGISTICS — B2B Road Freight & Logistics Platform

> **Moving Business Forward.**  
> Dedicated B2B Road Transportation, Full Truck Load (FTL), and Freight Management powered by verified third-party transportation fleet partners across key Indian commercial corridors.

---

## 1. Project Overview & Architecture

Vmove Logistics is a production-oriented, modular logistics web platform and private administrative operations suite developed for an asset-light Indian commercial road freight enterprise.

### Core Architectural Pillars
- **Public Website:** Corporate brand showcase, service offerings, verified corridor network, direct telephone & WhatsApp integration (+91 7906308640), and an interactive rate-limited freight quote enquiry engine.
- **Freight Quotation Engine:** Server-validated form with honeypot anti-spam, client-side rate limiting, unique reference generation (`VM-ENQ-XXXX`), instant confirmation, and automatic synchronization to the operations dashboard.
- **Private Operations Dashboard:** Protected administration portal with Supabase Authentication / RBAC, KPI overview cards, enquiry review, quotation creator with auto-calculated contribution margins, customer & transporter management, confirmed booking dispatch tracking, operational payment tracking, and audit logging.
- **Customer-Facing Quotation PDF Generator:** Instant PDF export that strictly strips out internal transporter purchase costs, gross margins, and confidential internal notes while presenting an official commercial quote with GST separation.
- **Hybrid Storage Layer:** Native compatibility with Supabase PostgreSQL (with full Row Level Security policies), bundled with an immediate zero-configuration local fallback engine pre-loaded with realistic Indian road logistics demo data.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **PDF Engine:** jsPDF with corporate layout and vector branding
- **Backend & Database:** Supabase, PostgreSQL 15+, Row Level Security (RLS)
- **Testing Suite:** Vitest automated test suite for commercial calculations, rate limiting, and workflow lifecycles
- **Deployment Targets:** Vercel, Netlify, Cloudflare Pages, Supabase

---

## 3. Brand Identity & Visual System

| Element | Specification | Description |
| :--- | :--- | :--- |
| **Primary Brand Colour** | `#10243A` | Deep Corporate Navy |
| **Accent Colour** | `#F97316` | Energetic Logistics Orange |
| **Neutral Background** | `#FFFFFF` / `#F8FAFC` | Clean corporate surface |
| **Typography** | Inter / Manrope | Strong geometric sans-serif |
| **Contact Number** | `+91 7906308640` | Direct Commercial & Operations Hotline |
| **Official Email** | `contact@vmovelogistics.com` | Primary Customer Desk |

---

## 4. Database Schema & Tables

The schema is maintained in `supabase/migrations/20261030000000_vmove_schema.sql`:

1. `profiles`: Operations staff and administrators with role-based access (`admin`, `operations`, `viewer`).
2. `customers`: Commercial B2B shippers, billing addresses, GSTIN (15 chars), payment terms, and notes.
3. `enquiries`: Inbound freight quote requests with reference numbers (`VM-ENQ-XXXX`), routes, cargo specs, weight, pickup dates, and review statuses.
4. `transporters`: Verified third-party fleet partners, vehicle configurations, operating routes, and verification statuses (`Verified`, `Pending`, `Suspended`).
5. `quotations`: Formal freight quotes with customer freight, transporter purchase rate, other direct charges, automatically computed contribution margin, GST breakdown, validity date, and terms.
6. `bookings`: Confirmed shipments (`VM-BKG-XXXX`) with allocated vehicle numbers, driver credentials, pickup/delivery dates, and lifecycle statuses.
7. `shipment_updates`: Checkpoint milestone logs with timestamps, locations, and updates.
8. `payments`: Operational payment ledger tracking customer invoices receivable, transporter payables, paid amounts, and outstanding balances.
9. `audit_logs`: Detailed change history and operational events.

---

## 5. Getting Started & Local Development

### Prerequisites
- Node.js v18+ (tested on Node v24.19)
- npm v10+

### Installation
```bash
# Clone or navigate to the project directory
cd C:\Users\devya\.gemini\antigravity\scratch\vmove-logistics

# Install dependencies
npm install

# Run automated test suite
npm run test

# Launch local development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Default Administrative Credentials

For immediate evaluation and operations testing, the dashboard includes verified operational staff accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin Director** | `admin@vmovelogistics.com` | `admin123` | Full access (All modules, DB reset tools) |
| **Operations Staff**| `ops@vmovelogistics.com` | `ops123` | Quotations, Enquiries, Bookings, Transporters |

*Note: In production with live Supabase, accounts are managed securely via Supabase Auth.*

---

## 7. Connecting to Live Supabase Backend

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run the migration script:
   - Copy contents of `supabase/migrations/20261030000000_vmove_schema.sql` and execute.
   - (Optional) Copy contents of `supabase/seed.sql` to populate initial Indian freight routes and carriers.
3. In your project root, create a `.env` file from `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Rebuild or restart `npm run dev`. The application will automatically detect your Supabase credentials and transition from local mode to live PostgreSQL!

---

## 8. Deployment Instructions

### Deploy to Vercel
1. Push this directory to your Git repository (GitHub / GitLab).
2. Import the project into Vercel.
3. Set Framework Preset: **Vite**.
4. Configure Environment Variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

### Deploy to Netlify
1. Create a `netlify.toml` or connect repository via Netlify Dashboard.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Site settings > Environment variables.
