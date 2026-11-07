# Event Horizon 🌌
> **Responsive Event Management Platform**  
> *Course Project: K Explore – Web Designing*

---

## 1. Project Description

**Event Horizon** is a modern, responsive, and interactive event discovery and ticketing platform designed to manage college fests, tech summits, hackathons, and cultural festivals. The platform bridges event organizers and attendees through a seamless web interface that supports real-time event discovery, category filtering, live countdown tracking, client-side validation, digital pass generation, and persistent data storage.

### Core Objectives:
- **Event Discovery & Exploration:** Enable users to browse upcoming and featured events with essential metadata including dates, venues, categories, ticket pricing, and real-time seat availability.
- **Search & Multi-Filtering:** Provide immediate search-as-you-type indexing across event titles, descriptions, venues, speakers, and tags, complemented by category pills and sorting controls.
- **Interactive Details & Schedule:** Deliver comprehensive modal overviews for each event, breaking down agendas into chronological timelines and introducing key speakers and hosts.
- **Robust Client-Side Registration:** Enforce strict JavaScript-based form validation for user inputs (name, email, 10-digit phone, ticket tiers, and attendance terms), preventing double-booking through email-event verification.
- **Digital Ticketing & Verification:** Automatically issue a stylized digital boarding pass with unique reference numbers, procedural canvas-rendered QR codes, printable CSS layouts, and celebratory confetti animations.
- **Persistent State Management:** Maintain user bookings, custom-hosted events, and theme preferences entirely within the browser's `localStorage`.
- **3D Interactive Immersion:** Enhance visual engagement through a pure-canvas 3D planetary gyroscope with shaded polyhedral core that responds to user drag/mouse interactions, alongside multi-plane 3D card tilt parallax.

---

## 2. System Implementation

The platform is engineered using modern, semantic web standards (HTML5, modular CSS3, and ES6+ JavaScript) without heavy external framework dependencies, ensuring fast loading speeds, zero build friction, and complete offline capability.

### 2.1 File & Directory Architecture
```
susho web project/
├── index.html              # Semantic HTML5 Single-Page Application entry point
├── README.md               # Project description and implementation documentation
├── .gitignore              # Git exclusion rules
└── assets/
    ├── css/
    │   ├── styles.css      # Design tokens, CSS variables, dark/light themes, layouts & print styles
    │   └── animations.css  # 3D ticket flip, confetti physics, pulse, and shake keyframes
    └── js/
        ├── data.js         # Curated realistic initial events dataset
        ├── storage.js      # LocalStorage persistence manager (Registrations, Favorites, Custom Events)
        ├── validation.js   # Real-time form validation rules & error UI handler
        ├── ticket.js       # Dynamic procedural QR code & digital boarding pass generator
        ├── scene3d.js      # 3D interactive planetary gyroscope, shaded gem core & card tilt
        └── app.js          # Main application controller, UI event bindings & filtering engine
```

---

### 2.2 Technical Implementation Details

#### A. Data Model, Storage Engine & Cloud Sync (`assets/js/data.js` & `assets/js/storage.js`)
- **Initial Dataset:** Pre-configured with realistic campus events spanning Technology & AI, Music & Cultural, Gaming & Esports, Workshops, and Sports.
- **Unified Event Store:** The `StorageManager` dynamically combines default events with user-created events stored under `event_horizon_custom_v2`.
- **Registrations & Bookings:** Stores confirmed passes with unique identifiers (`TKT-XXXXXX`), reference numbers (`EH-2026-XXXX`), seat allocations, and timestamps.
- **Cross-Device Cloud Synchronization:** Automatically synchronizes confirmed bookings and custom events to a global cloud store via RESTful endpoints, ensuring that tickets booked on mobile devices, tablets, or laptops immediately reflect across all devices in real-time.
- **Instant Pass Lookup:** Attendees can instantly locate and view their passes from any device by entering their registered email or booking reference in the slide-over drawer search bar.
- **Seat Allocation Synchronization:** Automatically recalculates event capacity when new registrations are booked or cancelled across devices.
- **Favorites / Wishlist:** Stores saved event IDs in a persistent array, updating UI bookmark states reactively.

#### B. Discovery, Search & Filtering Algorithm (`assets/js/app.js`)
- **Real-Time Search:** Executes sub-string searches across `title`, `shortDescription`, `venue`, and `tags` simultaneously upon `input` events.
- **Category Filter Pills:** Filters catalog items based on assigned category keys (`tech`, `music`, `gaming`, `workshop`, `sports`, `all`).
- **Compound Filters:** Allows combining category filters with date constraints (Weekend Specials) and pricing models (Free vs. Paid).
- **Sort Pipeline:** Dynamically orders items by chronological date, popularity (registered seats), or alphabetical name.
- **View Mode Switcher:** Toggles between CSS Grid (`minmax(340px, 1fr)`) and compact horizontal List views without re-fetching data.

#### C. Real-Time Form Validation Engine (`assets/js/validation.js`)
- **Full Name Validation:** Requires a minimum of 3 alphabetical characters; rejects numbers and unapproved symbols.
- **RFC Email Validation:** Regex verification against standard email patterns (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`).
- **Anti-Duplicate Booking Protection:** Cross-checks the entered email against existing registrations for the selected event in `localStorage`.
- **Phone Number Sanitation & Validation:** Strips prefixes (`+91`, `0`, spaces, dashes) and verifies that the remaining value is a valid 10-digit mobile number starting with 6, 7, 8, or 9.
- **Dynamic Price Breakdown:** Computes total payable amounts in real-time according to ticket quantity (1 to 5) and pass tier (General Admission, Student 30% discount, or VIP surcharge).
- **Visual Feedback:** Applies inline green border feedback for valid inputs and animated shake alerts with descriptive error labels for invalid inputs.

#### D. Digital Boarding Pass & Verification (`assets/js/ticket.js`)
- **Procedural Canvas QR Generator:** Draws an authentic 21×21 matrix QR code directly on an HTML5 `<canvas>` using data-derived pseudo-random seeding, encoding booking reference, attendee name, and event date.
- **Print Formatting:** Implements a dedicated `@media print` stylesheet that isolates the ticket card, suppresses background web chrome, and formats an official printable pass stub.
- **Confetti Celebration Physics:** Features a pure-JavaScript canvas particle engine simulating gravity, wind resistance, and rotational drag upon registration confirmation.

#### E. 3D Holographic Engine & Spatial Parallax (`assets/js/scene3d.js`)
- **3D Planetary Gyroscope Rings:** Renders 3 concentric, rotating 3D gimbal rings with illuminated orbiting beads using 3D perspective projection (`scale = focalLength / (focalLength + z)`).
- **Shaded Polyhedral Gem Core:** Computes triangular facet surface normals and 2D cross-product vectors to achieve real-time backface culling, depth sorting (Painter's Algorithm), and light intensity shading.
- **Interactive Drag Rotation:** Tracks mouse and touch drag deltas to apply 3D rotational momentum and inertia to the core geometry.
- **Spatial Layer Parallax:** Enhances event cards with dynamic 3D perspective tilt (`rotateX`, `rotateY`) while badges, price tags, and buttons physically elevate along the Z-axis (`translateZ(50px)`) with specular light reflections.

#### F. Dual Theme Architecture (`assets/css/styles.css`)
- **CSS Custom Properties:** Structured token architecture defining body, surface, text, border, and glow colors for both `[data-theme="dark"]` and `[data-theme="light"]`.
- **System Sync:** Checks `prefers-color-scheme` on initial load and synchronizes user toggles with `localStorage`.

---

## 3. Technology Stack

- **Markup:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`)
- **Styling:** CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, 3D Transforms, Media Queries, Print Rules)
- **Scripting:** Vanilla JavaScript (ES6+ Classes, LocalStorage API, HTML5 Canvas 2D API, DOM Manipulation)
- **Zero External Dependencies:** Built without external JavaScript libraries or heavy frameworks, ensuring 100% offline reliability, instant load times, and clean evaluation.
