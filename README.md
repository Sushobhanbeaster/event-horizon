# PulseEvents ⚡ | Next-Gen Responsive Event Management Platform
> **K-Explore Web Designing Project & Evaluation**  
> Built with Semantic HTML5, CSS3 Design Tokens & Glassmorphism, and Vanilla JavaScript (ES6+).

---

## 🌟 Executive Summary

**PulseEvents** is a modern, responsive, and visually captivating event discovery, management, and registration web application. Designed to cater to college fests, tech conventions, hackathons, and cultural festivals, the platform delivers an engaging user experience with intuitive navigation, fluid animations, real-time client-side form validation, and instant digital boarding pass generation.

---

## 🎯 Key Features & Requirements Matrix

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Attractive Hero Section** | Headliner spotlight, live statistics, quick event search bar, and glowing mesh background. | ✅ Complete |
| **Event Discovery & Cards** | Dynamic cards displaying cover image, category badge, date, venue, short description, and seat capacity progress bar. | ✅ Complete |
| **Real-Time Live Search** | Instant substring matching across titles, descriptions, venues, speakers, and keyword tags. | ✅ Complete |
| **Multi-Category Filter Pills** | Filter by Technology & AI, Music & Cultural, Gaming & Esports, Workshops & Hackathons, and Sports. | ✅ Complete |
| **Advanced Filtering & Sorting** | Filter by Weekend/All Dates, Free/Paid pricing, and sort by Soonest Date, Popularity, or Name (A-Z). | ✅ Complete |
| **Grid & List View Switcher** | Toggle dynamically between a responsive multi-column card grid and a compact list row view. | ✅ Complete |
| **Detailed Event Modal** | Tabbed interface (Overview & Highlights, Agenda & Schedule Timeline, Featured Speakers & Guests, Venue Info). | ✅ Complete |
| **JavaScript Form Validation** | Strict RFC regex email validation, 10-digit mobile phone check, minimum 3-character full name, seat count limits, and duplicate registration protection. | ✅ Complete |
| **Confirmation & Pass Generation** | Confetti celebration burst, dynamic canvas QR code generation, booking reference ID, and printable boarding pass stub. | ✅ Complete |
| **Responsive UI/UX** | Mobile-first architecture with mobile hamburger menu, fluid typography, and media query breakpoints (mobile, tablet, desktop). | ✅ Complete |

---

## 🏆 Bonus Challenges Implemented

### 1. 🌓 Persistent Dark / Light Theme Mode
- Complete dual-theme CSS custom variable architecture (`[data-theme="dark"]` / `[data-theme="light"]`).
- Persistent user preference stored in `localStorage`.
- Automatic detection of system preference (`prefers-color-scheme`).
- Seamless transitions with Sun/Moon icon toggle in the navigation bar.

### 2. ⏳ Real-Time Event Countdown Timers
- Live ticking countdown clock updating days, hours, minutes, and seconds every 1000ms.
- Headliner mega-event spotlight that computes remaining time until the opening keynote.

### 3. 💾 Full LocalStorage Data Management
- **Registrations Store:** Automatically saves user registrations with unique ticket IDs, seat counts, and timestamps.
- **"My Bookings" Slide-Over Drawer:** Dedicated panel where users can review all their registered tickets, re-open their digital pass, or cancel reservations (which automatically recalculates and releases seats back to the event capacity pool).
- **Favorites / Wishlist:** Heart bookmark toggle on each event card that persists across browser sessions.
- **"Host an Event" Publisher:** Enables students and club organizers to submit new events with custom dates, capacities, and venues; new events are immediately saved to `localStorage` and injected into the catalog.

### 4. ✨ Animations & Micro-Interactions
- Custom pure-JavaScript canvas confetti physics engine on successful bookings.
- Smooth modal fade-in and backdrop blur effects.
- Dynamic input error shake animations and field status cues (green glow for valid, red for errors).
- Card elevation and image zoom micro-interactions on hover.

---

## 📂 Project Architecture & Directory Structure

```
susho web project/
├── index.html              # Main HTML5 Single-Page Application entry point
├── README.md               # Detailed project documentation and deployment guide
├── .gitignore              # Standard git exclusion file
└── assets/
    ├── css/
    │   ├── styles.css      # Design tokens, themes, layouts, modals, print styles
    │   └── animations.css  # Keyframes, confetti canvas, shake, and pulse effects
    └── js/
        ├── data.js         # Curated realistic initial events dataset
        ├── storage.js      # LocalStorage engine for bookings, favorites & custom events
        ├── validation.js   # Real-time form validation rules & error UI
        ├── ticket.js       # Dynamic QR code generation & confetti engine
        └── app.js          # Main application controller, UI event bindings & filters
```

---

## 🛠️ Technology Stack

- **Markup:** HTML5 (Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **Styling:** CSS3 (CSS Custom Properties, Flexbox, CSS Grid, Glassmorphism `backdrop-filter`, `@media print`)
- **Scripting:** Modern JavaScript (ES6+ Classes, Arrow Functions, LocalStorage API, HTML5 Canvas API, DOM Manipulation)
- **Zero External Dependencies:** Built without heavy third-party runtime libraries, ensuring lightning-fast load times, zero broken links, and 100% offline reliability.

---

## 🚀 Local Setup & Running Instructions

1. **Clone or Download the Repository:**
   ```bash
   git clone <your-repository-url>
   cd "susho web project"
   ```

2. **Run the Project:**
   - **Option A (Instant Direct Open):** Simply double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Safari).
   - **Option B (VS Code Live Server):** Right-click `index.html` inside VS Code and select **"Open with Live Server"**.
   - **Option C (Python local server):**
     ```bash
     python -m http.server 3000
     ```
     Then open `http://localhost:3000` in your browser.

---

## 🌐 Deployment Instructions (Vercel, Netlify, GitHub Pages)

### Option 1: Deploy on GitHub Pages (Recommended for Academic Submissions)
1. Initialize Git and commit the project files:
   ```bash
   git add .
   git commit -m "feat: complete responsive event management website"
   ```
2. Create a new repository on your GitHub account (e.g., `pulse-events-kexplore`).
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Branch**, select `main` and root `/`.
   - Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option 2: Deploy on Netlify
1. Go to [Netlify.com](https://www.netlify.com/) and log in.
2. Click **"Add new site"** > **"Deploy manually"** (or connect your GitHub repository).
3. Drag and drop the `susho web project` root folder into the Netlify drop zone.
4. Your website is deployed instantly with a live `.netlify.app` URL.

### Option 3: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Import your GitHub repository.
4. Leave settings default (Root Directory `./`) and click **Deploy**.
5. Your project will be live with an SSL-secured `.vercel.app` domain.

---

## 📝 Form Validation Specifications

The registration system implements the following rigorous validation rules:
- **Full Name:** Minimum 3 characters; alphabetical characters, spaces, periods, and hyphens only.
- **Email Address:** Strictly validated against standard RFC-compliant email regular expressions (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`).
- **Duplicate Registration Check:** Prevents a user from registering twice for the same event with the same email address.
- **Phone Number:** Validates 10-digit mobile numbers with common prefix sanitation (`+91`, `0`, spaces, and dashes).
- **Ticket Quantity:** Constrained to positive integers between 1 and 5.
- **Terms Acceptance:** Requires explicit confirmation of the event code of conduct checkbox.

---

## 🎫 Digital Ticket Pass & Print Verification
- Each confirmed registration generates a unique **Booking Reference Code** (`KP-2026-XXXX`).
- An algorithmic **QR Code** is procedurally drawn on an HTML5 `<canvas>` containing verified booking metadata.
- Includes full `@media print` CSS rules allowing attendees to directly click **"Download / Print Pass"** to produce an official clean PDF or printed pass with background graphics preserved.

---

## 📄 License & Academic Integrity
Developed as part of the **K-Explore Web Designing Assignment**. Clean, modular, well-commented source code written in accordance with high UI/UX and accessibility standards.

