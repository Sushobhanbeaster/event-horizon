/**
 * Event Horizon - Main Application Controller
 * Handles UI state, filtering, search, modals, countdown timers, and theme switching.
 */

class PulseApp {
  constructor() {
    this.events = [];
    this.selectedEvent = null;
    this.activeCategory = "all";
    this.searchQuery = "";
    this.dateFilter = "all";
    this.priceFilter = "all";
    this.sortBy = "date";
    this.viewMode = "grid";
    this.countdownInterval = null;

    this.init();
  }

  /**
   * Application Entry Point
   */
  init() {
    this.initTheme();
    this.loadEvents();
    this.bindEvents();
    this.startFeaturedCountdown();
    this.updateTicketsBadge();
    this.renderEvents();

    // Initial background cloud sync across all devices
    this.syncCloudData(true);

    // Periodic cloud refresh every 25 seconds
    setInterval(() => this.syncCloudData(true), 25000);

    // Re-sync instantly when user unlocks phone or switches back to tab
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.syncCloudData(true);
      }
    });
  }

  /**
   * Global Cloud Synchronization Across Devices
   */
  async syncCloudData(silent = true) {
    const dot = document.getElementById("sync-indicator-dot");
    const text = document.getElementById("drawer-sync-status");
    if (dot) dot.className = "sync-dot syncing";
    if (text) text.textContent = "Syncing cloud...";

    try {
      const res = await StorageManager.syncFromCloud();
      this.loadEvents();
      this.updateTicketsBadge();
      this.renderEvents();

      if (dot) dot.className = "sync-dot live";
      if (text) text.textContent = "Cross-Device Synced";

      if (!silent && res && res.success) {
        this.showToast("☁️ Synced tickets & events across devices!", "success");
      }
      return res;
    } catch (e) {
      if (dot) dot.className = "sync-dot";
      if (text) text.textContent = "Offline / Local Mode";
      return { success: false };
    }
  }

  /**
   * Theme Engine (Light / Dark Mode with persistence)
   */
  initTheme() {
    const savedTheme = StorageManager.getStoredTheme();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "dark"); // Default dark for sleek vibe

    this.setTheme(initialTheme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
        this.showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`, "info");
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    StorageManager.setStoredTheme(theme);
    
    const themeIcon = document.getElementById("theme-toggle-icon");
    const themeLabel = document.getElementById("theme-toggle-label");
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
    }
  }

  /**
   * Load Events from LocalStorage and Data Store
   */
  loadEvents() {
    this.events = StorageManager.getAllEvents();
  }

  /**
   * Start Live Countdown for the Main Featured Event
   */
  startFeaturedCountdown() {
    // Find featured event or the earliest event
    const featured = this.events.find(e => e.isFeatured) || this.events[0];
    if (!featured) return;

    const targetDate = new Date(`${featured.date}T09:30:00`).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const daysEl = document.getElementById("timer-days");
      const hoursEl = document.getElementById("timer-hours");
      const minsEl = document.getElementById("timer-mins");
      const secsEl = document.getElementById("timer-secs");

      if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

      if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(minutes).padStart(2, "0");
      secsEl.textContent = String(seconds).padStart(2, "0");
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  /**
   * Filter and Sort Events based on user selections
   */
  getFilteredEvents() {
    return this.events.filter(event => {
      // Category Filter
      if (this.activeCategory !== "all" && event.category !== this.activeCategory) {
        return false;
      }

      // Live Search Query
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase().trim();
        const inTitle = event.title.toLowerCase().includes(query);
        const inDesc = event.shortDescription.toLowerCase().includes(query);
        const inVenue = event.venue.toLowerCase().includes(query);
        const inTags = event.tags && event.tags.some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inVenue && !inTags) {
          return false;
        }
      }

      // Price Filter
      if (this.priceFilter === "free" && event.price > 0) return false;
      if (this.priceFilter === "paid" && event.price === 0) return false;

      // Date Filter
      if (this.dateFilter === "weekend") {
        const evtDate = new Date(event.date);
        const day = evtDate.getDay();
        // Saturday is 6, Sunday is 0
        if (day !== 0 && day !== 6) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (this.sortBy === "popular") {
        return (b.registered || 0) - (a.registered || 0);
      } else if (this.sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  /**
   * Render Event Cards (Grid or List View)
   */
  renderEvents() {
    const container = document.getElementById("events-container");
    const countEl = document.getElementById("events-count-badge");
    if (!container) return;

    const filtered = this.getFilteredEvents();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${this.events.length} Events`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No events match your criteria</h3>
          <p class="empty-text">Try adjusting your keywords, switching categories, or clearing filters.</p>
          <button class="btn btn-secondary" id="reset-filters-btn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => this.resetFilters());
      }
      return;
    }

    container.className = `events-grid ${this.viewMode === "list" ? "view-list" : "view-grid"}`;

    container.innerHTML = filtered.map(event => {
      const isFav = StorageManager.isFavorite(event.id);
      const capacityPercent = Math.min(100, Math.round(((event.registered || 0) / event.capacity) * 100));
      const spotsLeft = Math.max(0, event.capacity - (event.registered || 0));
      const isAlmostFull = spotsLeft <= 30;

      return `
        <article class="event-card ${event.isFeatured ? "featured-card" : ""}" data-id="${event.id}">
          <div class="card-media">
            <img src="${event.image}" alt="${event.title}" loading="lazy" class="card-image" onerror="this.src='${FALLBACK_CATEGORY_IMAGES[event.category] || FALLBACK_CATEGORY_IMAGES.tech}'" />
            <div class="card-badges">
              <span class="badge badge-category badge-${event.category}">${event.categoryLabel}</span>
              ${event.isFeatured ? '<span class="badge badge-featured">★ Featured</span>' : ""}
            </div>
            <button class="btn-fav ${isFav ? "active" : ""}" data-action="favorite" data-id="${event.id}" title="Bookmark Event" aria-label="Bookmark Event">
              <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" class="fav-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div class="card-price-tag ${event.price === 0 ? "free" : ""}">
              ${event.price === 0 ? "FREE ENTRY" : event.priceLabel}
            </div>
          </div>

          <div class="card-content">
            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>${event.displayDate}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span class="truncate-venue">${event.venue}</span>
              </div>
            </div>

            <h3 class="card-title">${event.title}</h3>
            <p class="card-desc">${event.shortDescription}</p>

            <div class="capacity-meter">
              <div class="capacity-labels">
                <span class="spots-status ${isAlmostFull ? "urgent" : ""}">${spotsLeft} seats remaining</span>
                <span class="spots-percent">${capacityPercent}% booked</span>
              </div>
              <div class="capacity-track">
                <div class="capacity-bar" style="width: ${capacityPercent}%;"></div>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn btn-outline" data-action="details" data-id="${event.id}">
                <span>View Details</span>
              </button>
              <button class="btn btn-primary" data-action="register" data-id="${event.id}">
                <span>Register Now</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * Open Detailed Event Modal
   */
  openEventDetailsModal(eventId) {
    const event = StorageManager.getEventById(eventId);
    if (!event) return;
    this.selectedEvent = event;

    const modal = document.getElementById("details-modal");
    const content = document.getElementById("details-modal-content");
    if (!modal || !content) return;

    const spotsLeft = Math.max(0, event.capacity - (event.registered || 0));
    const capacityPercent = Math.min(100, Math.round(((event.registered || 0) / event.capacity) * 100));

    content.innerHTML = `
      <div class="modal-event-hero">
        <img src="${event.image}" alt="${event.title}" class="modal-hero-img" onerror="this.src='${FALLBACK_CATEGORY_IMAGES[event.category] || FALLBACK_CATEGORY_IMAGES.tech}'" />
        <div class="modal-hero-overlay">
          <span class="badge badge-category badge-${event.category}">${event.categoryLabel}</span>
          <h2 class="modal-event-title">${event.title}</h2>
          <div class="modal-quick-meta">
            <span>📅 ${event.displayDate}</span>
            <span>⏰ ${event.time}</span>
            <span>📍 ${event.venue}, ${event.city}</span>
          </div>
        </div>
      </div>

      <div class="modal-body-wrapper">
        <div class="modal-main-column">
          <div class="modal-tabs">
            <button class="modal-tab-btn active" data-tab="overview">Overview</button>
            <button class="modal-tab-btn" data-tab="agenda">Agenda & Schedule</button>
            <button class="modal-tab-btn" data-tab="speakers">Speakers & Guests</button>
          </div>

          <div class="tab-pane active" id="tab-overview">
            <h4 class="tab-heading">About This Event</h4>
            <p class="tab-paragraph">${event.fullDescription}</p>

            <h4 class="tab-heading">Key Highlights</h4>
            <ul class="highlights-list">
              ${event.highlights.map(h => `<li><span class="check-icon">✓</span> ${h}</li>`).join("")}
            </ul>

            <div class="tags-container">
              ${event.tags.map(t => `<span class="tag-chip">#${t}</span>`).join("")}
            </div>
          </div>

          <div class="tab-pane" id="tab-agenda">
            <h4 class="tab-heading">Event Schedule Breakdown</h4>
            <div class="timeline">
              ${event.agenda.map(item => `
                <div class="timeline-item">
                  <div class="timeline-time">${item.time}</div>
                  <div class="timeline-content">
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-sub">${item.speaker}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="tab-pane" id="tab-speakers">
            <h4 class="tab-heading">Featured Speakers & Hosts</h4>
            <div class="speakers-grid">
              ${event.speakers.map(s => `
                <div class="speaker-card">
                  <img src="${s.avatar}" alt="${s.name}" class="speaker-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'" />
                  <div class="speaker-info">
                    <h5 class="speaker-name">${s.name}</h5>
                    <div class="speaker-role">${s.role}</div>
                    <div class="speaker-company">${s.company}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <aside class="modal-side-column">
          <div class="side-card">
            <div class="side-price-header">
              <span class="side-label">Registration Fee</span>
              <span class="side-price ${event.price === 0 ? "free" : ""}">${event.price === 0 ? "FREE" : event.priceLabel}</span>
            </div>

            <div class="capacity-meter mb-4">
              <div class="capacity-labels">
                <span class="spots-status">${spotsLeft} seats available</span>
                <span class="spots-percent">${capacityPercent}%</span>
              </div>
              <div class="capacity-track">
                <div class="capacity-bar" style="width: ${capacityPercent}%;"></div>
              </div>
            </div>

            <div class="side-perks">
              <div class="perk-item">🎟️ Instant Digital Pass & QR Code</div>
              <div class="perk-item">📜 Verified Certificate of Attendance</div>
              <div class="perk-item">☕ Complimentary Refreshments Included</div>
              <div class="perk-item">🤝 Networking & Q&A Access</div>
            </div>

            <button class="btn btn-primary btn-block btn-lg" id="modal-register-btn" data-id="${event.id}">
              Proceed to Register
            </button>
            <button class="btn btn-outline btn-block mt-2" id="modal-share-btn">
              🔗 Share Event
            </button>
          </div>
        </aside>
      </div>
    `;

    // Bind tab clicks
    const tabBtns = content.querySelectorAll(".modal-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        content.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetId = "tab-" + btn.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // Modal register button
    const regBtn = document.getElementById("modal-register-btn");
    if (regBtn) {
      regBtn.addEventListener("click", () => {
        this.closeModal("details-modal");
        this.openRegistrationModal(event.id);
      });
    }

    // Modal share button
    const shareBtn = document.getElementById("modal-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        navigator.clipboard?.writeText(window.location.href);
        this.showToast("Event link copied to clipboard!", "success");
      });
    }

    this.showModal("details-modal");
  }

  /**
   * Open Event Registration Modal & Setup Form
   */
  openRegistrationModal(eventId) {
    const event = StorageManager.getEventById(eventId);
    if (!event) return;
    this.selectedEvent = event;

    const modal = document.getElementById("registration-modal");
    const summaryEl = document.getElementById("reg-event-summary");
    const form = document.getElementById("registration-form");
    if (!modal || !summaryEl || !form) return;

    // Reset Form
    form.reset();
    form.querySelectorAll(".input-error, .input-valid").forEach(el => el.classList.remove("input-error", "input-valid"));
    form.querySelectorAll(".field-error-msg").forEach(el => el.classList.remove("visible"));

    // Event Header Summary
    summaryEl.innerHTML = `
      <div class="reg-summary-card">
        <img src="${event.image}" alt="${event.title}" class="reg-summary-thumb" onerror="this.src='${FALLBACK_CATEGORY_IMAGES[event.category] || FALLBACK_CATEGORY_IMAGES.tech}'" />
        <div class="reg-summary-details">
          <span class="badge badge-category badge-${event.category}">${event.categoryLabel}</span>
          <h4 class="reg-summary-title">${event.title}</h4>
          <p class="reg-summary-sub">📅 ${event.displayDate} • 📍 ${event.venue}</p>
          <div class="reg-summary-cost">Base Price: <strong>${event.price === 0 ? "Free Entry" : event.priceLabel}</strong></div>
        </div>
      </div>
    `;

    // Pre-populate hidden or locked event ID
    const eventIdInput = document.getElementById("reg-event-id");
    if (eventIdInput) eventIdInput.value = event.id;

    // Calculate dynamic pricing
    this.updatePriceBreakdown();

    // Bind real-time form validation
    FormValidator.bindLiveValidation(form, () => this.selectedEvent ? this.selectedEvent.id : null);

    this.showModal("registration-modal");
  }

  /**
   * Dynamic Calculation of Ticket Tier & Quantity Price
   */
  updatePriceBreakdown() {
    if (!this.selectedEvent) return;
    const tierSelect = document.getElementById("ticket-tier-select");
    const qtyInput = document.getElementById("ticket-qty-input");
    const priceDisplay = document.getElementById("reg-price-total");
    if (!tierSelect || !qtyInput || !priceDisplay) return;

    const qty = parseInt(qtyInput.value, 10) || 1;
    let basePrice = this.selectedEvent.price || 0;

    // Tier multipliers or additions
    if (tierSelect.value === "vip") {
      basePrice += 400; // VIP perk surcharge
    } else if (tierSelect.value === "student") {
      basePrice = Math.round(basePrice * 0.7); // 30% student discount
    }

    const total = basePrice * qty;
    priceDisplay.textContent = total === 0 ? "Free (₹0)" : `₹${total}`;
  }

  /**
   * Handle Registration Form Submission
   */
  handleRegistrationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!this.selectedEvent) return;

    const isValid = FormValidator.validateForm(form, this.selectedEvent.id);
    if (!isValid) {
      this.showToast("Please correct the highlighted errors before submitting.", "warning");
      return;
    }

    const formData = new FormData(form);
    const fullName = formData.get("fullName").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const ticketTier = formData.get("ticketTier") || "General Admission";
    const ticketQuantity = parseInt(formData.get("ticketQuantity") || "1", 10);
    const dietary = formData.get("dietaryNotes") || "";

    // Save registration to localStorage
    const saved = StorageManager.saveRegistration({
      eventId: this.selectedEvent.id,
      eventTitle: this.selectedEvent.title,
      fullName,
      email,
      phone,
      ticketTier,
      ticketQuantity,
      dietary
    });

    if (!saved) {
      this.showToast("Failed to complete registration. Please try again.", "warning");
      return;
    }

    // Close registration modal
    this.closeModal("registration-modal");

    // Launch Confetti Celebration!
    TicketManager.launchConfetti();

    // Render Digital Pass into Confirmation Modal
    TicketManager.renderTicketPass(saved, this.selectedEvent);
    this.showModal("ticket-pass-modal");

    // Update tickets count badge in header
    this.updateTicketsBadge();

    // Refresh events to show updated capacity counter
    this.loadEvents();
    this.renderEvents();

    this.showToast("🎉 Registration confirmed! Your pass is ready.", "success");
  }

  /**
   * Open "My Bookings" Drawer with Live Cloud Sync
   */
  async openMyBookingsDrawer() {
    const drawer = document.getElementById("bookings-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");

    // Clear search filter input when opening
    const searchInput = document.getElementById("drawer-ticket-search");
    if (searchInput) searchInput.value = "";

    // Immediate render from local cache
    this.renderMyBookingsList();

    // Background fetch latest cloud updates and re-render
    await this.syncCloudData(true);
    this.renderMyBookingsList(searchInput ? searchInput.value : "");
  }

  /**
   * Render bookings into the slide-over drawer (supports instant search/filter)
   */
  renderMyBookingsList(filterQuery = "") {
    const listContainer = document.getElementById("my-bookings-list");
    if (!listContainer) return;

    let registrations = StorageManager.getRegistrations();
    const query = (filterQuery || "").toLowerCase().trim();

    if (query) {
      registrations = registrations.filter(r => 
        (r.bookingRef && r.bookingRef.toLowerCase().includes(query)) ||
        (r.email && r.email.toLowerCase().includes(query)) ||
        (r.fullName && r.fullName.toLowerCase().includes(query)) ||
        (r.eventTitle && r.eventTitle.toLowerCase().includes(query))
      );
    }

    if (registrations.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎟️</div>
          <h4 class="empty-title">${query ? "No matching passes found" : "No bookings yet"}</h4>
          <p class="empty-text">
            ${query ? "Try searching by registered email or reference code (e.g. EH-2026-...)" : "Explore upcoming events and reserve your spot today! All tickets automatically sync across your phone and laptop."}
          </p>
          ${query ? "" : '<button class="btn btn-primary" id="drawer-explore-btn">Browse Events</button>'}
        </div>
      `;
      const exploreBtn = document.getElementById("drawer-explore-btn");
      if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
          this.closeDrawer();
          const target = document.getElementById("events-section");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      }
    } else {
      listContainer.innerHTML = registrations.map(reg => {
        const event = StorageManager.getEventById(reg.eventId) || {
          title: reg.eventTitle,
          displayDate: "Upcoming Event",
          venue: "Campus Venue",
          category: "tech",
          categoryLabel: "Event Pass",
          price: 0
        };

        return `
          <div class="booking-item-card" data-id="${reg.id}">
            <div class="booking-item-header">
              <span class="booking-ref">${reg.bookingRef}</span>
              <span class="booking-tier-badge">${reg.ticketTier || "General"}</span>
            </div>
            <h4 class="booking-item-title">${event.title}</h4>
            <div class="booking-item-meta">
              <span>📅 ${event.displayDate}</span>
              <span>📍 ${event.venue}</span>
              <span>👤 ${reg.fullName} (${reg.ticketQuantity || 1} Pass)</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); word-break: break-all;">📧 ${reg.email || ""}</span>
            </div>
            <div class="booking-item-actions">
              <button class="btn btn-sm btn-outline" data-action="view-pass" data-reg-id="${reg.id}">
                🎫 View Ticket Pass
              </button>
              <button class="btn btn-sm btn-danger-outline" data-action="cancel-booking" data-reg-id="${reg.id}">
                Cancel
              </button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  closeDrawer() {
    const drawer = document.getElementById("bookings-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  /**
   * Cancel an existing booking
   */
  async cancelBooking(registrationId) {
    if (!confirm("Are you sure you want to cancel this registration? Your seat will be released across all devices.")) {
      return;
    }

    const success = StorageManager.cancelRegistration(registrationId);
    if (success) {
      this.showToast("Registration cancelled successfully.", "info");
      this.updateTicketsBadge();
      const searchInput = document.getElementById("drawer-ticket-search");
      this.renderMyBookingsList(searchInput ? searchInput.value : "");
      this.loadEvents();
      this.renderEvents();
      await this.syncCloudData(true);
    }
  }

  /**
   * Open Pass from My Bookings
   */
  viewPassFromBooking(registrationId) {
    const registrations = StorageManager.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    const event = StorageManager.getEventById(reg.eventId) || {
      id: reg.eventId,
      title: reg.eventTitle,
      category: "tech",
      categoryLabel: "Special Event",
      shortDescription: "Official Registered Event Pass",
      displayDate: "2026 Event Date",
      time: "Event Time",
      venue: "Main Venue",
      city: "Campus",
      price: 0
    };

    this.closeDrawer();
    TicketManager.renderTicketPass(reg, event);
    this.showModal("ticket-pass-modal");
  }

  /**
   * Host an Event Form Submission
   */
  handleCreateEventSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const title = (formData.get("eventTitle") || "").trim();
    const category = formData.get("eventCategory") || "tech";
    const date = formData.get("eventDate") || "";
    const time = (formData.get("eventTime") || "").trim();
    const venue = (formData.get("eventVenue") || "").trim();
    const city = (formData.get("eventCity") || "Campus").trim();
    const capacity = parseInt(formData.get("eventCapacity"), 10) || 100;
    const price = parseInt(formData.get("eventPrice"), 10) || 0;
    const shortDesc = (formData.get("eventShortDesc") || "").trim();
    const organizer = (formData.get("eventOrganizer") || "Event Host").trim();
    let image = (formData.get("eventImage") || "").trim();

    if (!image) {
      image = FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES.tech;
    }

    if (!title || !category || !date || !venue || !shortDesc) {
      this.showToast("Please fill in all required fields.", "warning");
      return;
    }

    // Format display date safely
    let displayDate = date;
    try {
      const d = new Date(date + "T00:00:00");
      if (!isNaN(d.getTime())) {
        const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
        displayDate = d.toLocaleDateString("en-US", options);
      }
    } catch (_) {}

    const newEvent = StorageManager.createEvent({
      title,
      category,
      categoryLabel: this.getCategoryLabel(category),
      date,
      displayDate,
      time: time || "10:00 AM - 04:00 PM",
      venue,
      city,
      capacity,
      price,
      priceLabel: price === 0 ? "Free" : "₹" + price,
      image,
      shortDescription: shortDesc,
      fullDescription: shortDesc + " Organized by " + organizer + " through Event Horizon.",
      organizer
    });

    if (newEvent) {
      form.reset();
      this.closeModal("create-event-modal");

      // Reset category filter to 'all' so new event is immediately visible
      this.activeCategory = "all";
      this.searchQuery = "";
      document.querySelectorAll(".category-pill").forEach(p => {
        p.classList.toggle("active", p.dataset.category === "all");
      });
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = "";

      // Reload and re-render events
      this.loadEvents();
      this.renderEvents();
      this.showToast("🚀 Event published successfully to the catalog!", "success");

      // Smooth scroll to catalog
      setTimeout(() => {
        const newCard = document.querySelector(`[data-id="${newEvent.id}"]`);
        if (newCard) {
          newCard.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const eventsSection = document.getElementById("events-section");
          if (eventsSection) eventsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    }
  }

  getCategoryLabel(category) {
    const map = {
      tech: "Technology & AI",
      music: "Music & Cultural",
      gaming: "Gaming & Esports",
      workshop: "Workshops & Hackathons",
      sports: "Sports & Fitness"
    };
    return map[category] || "Special Event";
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.activeCategory = "all";
    this.searchQuery = "";
    this.dateFilter = "all";
    this.priceFilter = "all";
    this.sortBy = "date";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const dateSelect = document.getElementById("filter-date");
    if (dateSelect) dateSelect.value = "all";

    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) priceSelect.value = "all";

    const sortSelect = document.getElementById("sort-by");
    if (sortSelect) sortSelect.value = "date";

    document.querySelectorAll(".category-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.category === "all");
    });

    this.renderEvents();
  }

  /**
   * Update Tickets Counter in Header
   */
  updateTicketsBadge() {
    const badge = document.getElementById("my-tickets-count");
    if (!badge) return;
    const count = StorageManager.getRegistrations().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  }

  /**
   * Modal Show / Hide Helpers
   */
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("open");
    document.body.classList.add("modal-locked");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("open");
    if (!document.querySelector(".modal.open")) {
      document.body.classList.remove("modal-locked");
    }
  }

  /**
   * Toast Notification Helper
   */
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "✓" : type === "warning" ? "⚠️" : "ℹ️";
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Global Event Listeners Binding
   */
  bindEvents() {
    // Live Search
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderEvents();
      });
    }

    // Category Filter Pills
    document.querySelectorAll(".category-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.activeCategory = pill.dataset.category;
        this.renderEvents();
      });
    });

    // Date Filter Select
    const dateSelect = document.getElementById("filter-date");
    if (dateSelect) {
      dateSelect.addEventListener("change", (e) => {
        this.dateFilter = e.target.value;
        this.renderEvents();
      });
    }

    // Price Filter Select
    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) {
      priceSelect.addEventListener("change", (e) => {
        this.priceFilter = e.target.value;
        this.renderEvents();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById("sort-by");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderEvents();
      });
    }

    // View Mode Toggle (Grid / List)
    const gridBtn = document.getElementById("btn-view-grid");
    const listBtn = document.getElementById("btn-view-list");
    if (gridBtn && listBtn) {
      gridBtn.addEventListener("click", () => {
        this.viewMode = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        this.renderEvents();
      });
      listBtn.addEventListener("click", () => {
        this.viewMode = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        this.renderEvents();
      });
    }

    // Event Card Click Delegation
    const eventsContainer = document.getElementById("events-container");
    if (eventsContainer) {
      eventsContainer.addEventListener("click", (e) => {
        const favBtn = e.target.closest('[data-action="favorite"]');
        if (favBtn) {
          e.stopPropagation();
          const eventId = favBtn.dataset.id;
          const isNowFav = StorageManager.toggleFavorite(eventId);
          favBtn.classList.toggle("active", isNowFav);
          const icon = favBtn.querySelector("svg");
          if (icon) icon.setAttribute("fill", isNowFav ? "currentColor" : "none");
          this.showToast(isNowFav ? "Added to bookmarked events ❤️" : "Removed from bookmarks", "info");
          return;
        }

        const detailsBtn = e.target.closest('[data-action="details"]');
        if (detailsBtn) {
          e.stopPropagation();
          this.openEventDetailsModal(detailsBtn.dataset.id);
          return;
        }

        const regBtn = e.target.closest('[data-action="register"]');
        if (regBtn) {
          e.stopPropagation();
          this.openRegistrationModal(regBtn.dataset.id);
          return;
        }

        const card = e.target.closest(".event-card");
        if (card && !e.target.closest("button")) {
          this.openEventDetailsModal(card.dataset.id);
        }
      });
    }

    // Dynamic Price recalculation in Registration Modal
    const tierSelect = document.getElementById("ticket-tier-select");
    const qtyInput = document.getElementById("ticket-qty-input");
    if (tierSelect) tierSelect.addEventListener("change", () => this.updatePriceBreakdown());
    if (qtyInput) qtyInput.addEventListener("input", () => this.updatePriceBreakdown());

    // Registration Form Submit
    const regForm = document.getElementById("registration-form");
    if (regForm) {
      regForm.addEventListener("submit", (e) => this.handleRegistrationSubmit(e));
    }

    // Host Event Form Submit
    const createForm = document.getElementById("create-event-form");
    if (createForm) {
      createForm.addEventListener("submit", (e) => this.handleCreateEventSubmit(e));
    }

    // Host Event Trigger Button
    const hostBtn = document.getElementById("btn-host-event");
    if (hostBtn) {
      hostBtn.addEventListener("click", () => this.showModal("create-event-modal"));
    }

    // My Tickets Nav Trigger
    const myTicketsBtn = document.getElementById("nav-my-tickets");
    if (myTicketsBtn) {
      myTicketsBtn.addEventListener("click", () => this.openMyBookingsDrawer());
    }

    // Close Drawer Trigger
    const closeDrawerBtn = document.getElementById("btn-close-drawer");
    const drawerOverlay = document.getElementById("drawer-overlay");
    if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", () => this.closeDrawer());
    if (drawerOverlay) drawerOverlay.addEventListener("click", () => this.closeDrawer());

    // Drawer Manual Sync Button
    const manualSyncBtn = document.getElementById("btn-manual-sync");
    if (manualSyncBtn) {
      manualSyncBtn.addEventListener("click", async () => {
        await this.syncCloudData(false);
        const searchInput = document.getElementById("drawer-ticket-search");
        this.renderMyBookingsList(searchInput ? searchInput.value : "");
      });
    }

    // Drawer Ticket Instant Search / Filter
    const drawerSearch = document.getElementById("drawer-ticket-search");
    if (drawerSearch) {
      drawerSearch.addEventListener("input", (e) => {
        this.renderMyBookingsList(e.target.value);
      });
    }

    // Drawer List Actions Delegation (View Pass & Cancel)
    const bookingsList = document.getElementById("my-bookings-list");
    if (bookingsList) {
      bookingsList.addEventListener("click", (e) => {
        const viewBtn = e.target.closest('[data-action="view-pass"]');
        if (viewBtn) {
          this.viewPassFromBooking(viewBtn.dataset.regId);
          return;
        }

        const cancelBtn = e.target.closest('[data-action="cancel-booking"]');
        if (cancelBtn) {
          this.cancelBooking(cancelBtn.dataset.regId);
        }
      });
    }

    // Ticket Actions: Print & Add to Calendar
    const printBtn = document.getElementById("btn-print-ticket");
    if (printBtn) {
      printBtn.addEventListener("click", () => TicketManager.printTicket());
    }

    const calBtn = document.getElementById("btn-cal-ticket");
    if (calBtn) {
      calBtn.addEventListener("click", () => {
        if (this.selectedEvent) {
          TicketManager.addToGoogleCalendar(this.selectedEvent);
        }
      });
    }

    // Generic Modal Close Buttons & Backdrop Click
    document.querySelectorAll(".modal-close-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        if (modal) this.closeModal(modal.id);
      });
    });

    document.querySelectorAll(".modal").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Keyboard ESC to close active modal or drawer
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal.open").forEach(modal => this.closeModal(modal.id));
        this.closeDrawer();
      }
    });

    // Mobile Hamburger Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav-menu");
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
      });
    }

    // Hero Quick Search
    const heroSearchBtn = document.getElementById("hero-search-btn");
    const heroSearchInput = document.getElementById("hero-search-input");
    if (heroSearchBtn && heroSearchInput) {
      heroSearchBtn.addEventListener("click", () => {
        const val = heroSearchInput.value.trim();
        if (val) {
          this.searchQuery = val;
          const searchInputMain = document.getElementById("search-input");
          if (searchInputMain) searchInputMain.value = val;
          this.renderEvents();
          const target = document.getElementById("events-section");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }
      });
      heroSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          heroSearchBtn.click();
        }
      });
    }

    // Hero CTA Button
    const heroExploreBtn = document.getElementById("hero-explore-btn");
    if (heroExploreBtn) {
      heroExploreBtn.addEventListener("click", () => {
        const target = document.getElementById("events-section");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Demo Reset Button
    const resetDemoBtn = document.getElementById("btn-reset-demo");
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        if (confirm("Reset demo data to default? This will clear test registrations and custom events.")) {
          StorageManager.resetDemoData();
          this.loadEvents();
          this.updateTicketsBadge();
          this.renderEvents();
          this.showToast("Demo data has been reset to defaults.", "info");
        }
      });
    }
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PulseApp();
});

