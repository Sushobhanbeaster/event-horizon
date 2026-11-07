/**
 * Event Horizon - Storage Engine & Cross-Device Cloud Sync
 * Manages LocalStorage persistence and Global Cloud Sync across all devices
 * for Registrations, Favorites, Custom Events, and Theme.
 */

const STORAGE_KEYS = {
  REGISTRATIONS: "event_horizon_registrations_v2",
  LEGACY_REGISTRATIONS: "pulse_events_registrations_v1",
  FAVORITES: "event_horizon_favorites_v2",
  CUSTOM_EVENTS: "event_horizon_custom_v2",
  THEME: "event_horizon_theme_v2"
};

const CLOUD_CONFIG = {
  BOOKINGS_URL: "https://kvdb.io/Jki2K64afcgKDvMfb37KMc/event_horizon_bookings",
  CUSTOM_EVENTS_URL: "https://kvdb.io/Jki2K64afcgKDvMfb37KMc/event_horizon_custom_events"
};

const StorageManager = {
  /**
   * Fetch all events (combines initial dataset with user-created events)
   */
  getAllEvents() {
    try {
      const customEvents = this.getCustomEvents();
      return [...customEvents, ...INITIAL_EVENTS];
    } catch (e) {
      console.warn("StorageManager: Failed to read custom events", e);
      return [...INITIAL_EVENTS];
    }
  },

  /**
   * Get custom events created by organizers
   */
  getCustomEvents() {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
      return customRaw ? JSON.parse(customRaw) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Get an event by its ID
   */
  getEventById(id) {
    const all = this.getAllEvents();
    return all.find(e => e.id === id) || null;
  },

  /**
   * Create a new custom event (Organizer Mode) with Cross-Device Cloud Sync
   */
  createEvent(eventData) {
    try {
      const customEvents = this.getCustomEvents();
      
      const newEvent = {
        id: "evt-custom-" + Date.now(),
        registered: 0,
        isFeatured: false,
        highlights: eventData.highlights || ["Exclusive community access", "Interactive Q&A session", "Complimentary refreshments"],
        agenda: eventData.agenda || [
          { time: "Start", title: "Registration & Welcome", speaker: "Host" },
          { time: "Mid", title: "Main Event Session", speaker: "Guest Speaker" },
          { time: "End", title: "Networking & Conclusion", speaker: "Organizers" }
        ],
        speakers: eventData.speakers || [
          {
            name: eventData.organizer || "Event Organizing Committee",
            role: "Host & Coordinator",
            company: "Event Horizon Community",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
          }
        ],
        tags: [eventData.category, "Campus", "EventHorizon"],
        ...eventData
      };

      customEvents.unshift(newEvent);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(customEvents));
      
      // Sync new custom event to cloud across all devices
      this.saveCustomEventsToCloud(customEvents);

      return newEvent;
    } catch (e) {
      console.error("StorageManager: Failed to save custom event", e);
      return null;
    }
  },

  /**
   * Retrieve all saved registrations (with legacy migration support)
   */
  getRegistrations() {
    try {
      let raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (!raw) {
        // Fallback check legacy key
        raw = localStorage.getItem(STORAGE_KEYS.LEGACY_REGISTRATIONS);
        if (raw) {
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, raw);
        }
      }
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("StorageManager: Failed to get registrations", e);
      return [];
    }
  },

  /**
   * Save a new registration locally and sync globally across devices
   */
  saveRegistration(data) {
    try {
      const registrations = this.getRegistrations();
      
      const registration = {
        id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
        bookingRef: "EH-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
        bookedAt: new Date().toISOString(),
        ...data
      };

      registrations.unshift(registration);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
      
      // Update registration counter on custom events or memory
      this.incrementAttendeeCount(data.eventId, data.ticketQuantity || 1);

      // Instantly sync to Global Cloud Store
      this.saveBookingsToCloud(registrations);
      
      return registration;
    } catch (e) {
      console.error("StorageManager: Failed to save registration", e);
      return null;
    }
  },

  /**
   * Cancel an existing registration locally and in the cloud
   */
  cancelRegistration(id) {
    try {
      const registrations = this.getRegistrations();
      const target = registrations.find(r => r.id === id);
      const updated = registrations.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));

      if (target) {
        this.incrementAttendeeCount(target.eventId, -(target.ticketQuantity || 1));
      }

      // Sync removal to Global Cloud Store
      this.saveBookingsToCloud(updated);
      return true;
    } catch (e) {
      console.error("StorageManager: Failed to cancel registration", e);
      return false;
    }
  },

  /**
   * Check if a specific email is already registered for this event
   */
  isAlreadyRegistered(email, eventId) {
    const list = this.getRegistrations();
    return list.some(
      r => r.email && r.email.toLowerCase().trim() === email.toLowerCase().trim() && r.eventId === eventId
    );
  },

  /**
   * Adjust attendee count on custom events or trigger event refresh
   */
  incrementAttendeeCount(eventId, count) {
    try {
      const customEvents = this.getCustomEvents();
      const found = customEvents.find(e => e.id === eventId);
      if (found) {
        found.registered = Math.max(0, (found.registered || 0) + count);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(customEvents));
        this.saveCustomEventsToCloud(customEvents);
      }
    } catch (e) {
      console.warn("StorageManager: Increment attendee count failed", e);
    }
  },

  /**
   * ==============================================================
   * GLOBAL CLOUD SYNCHRONIZATION ENGINE
   * Syncs bookings and custom events across phones, laptops, and PCs
   * ==============================================================
   */

  /**
   * Push current registrations array to the Global Cloud Store
   */
  async saveBookingsToCloud(registrationsList) {
    try {
      await fetch(CLOUD_CONFIG.BOOKINGS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationsList)
      });
    } catch (e) {
      console.warn("StorageManager: Background cloud bookings sync deferred", e);
    }
  },

  /**
   * Push custom events array to the Global Cloud Store
   */
  async saveCustomEventsToCloud(customEventsList) {
    try {
      await fetch(CLOUD_CONFIG.CUSTOM_EVENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customEventsList)
      });
    } catch (e) {
      console.warn("StorageManager: Background cloud events sync deferred", e);
    }
  },

  /**
   * Pull and merge data from the Global Cloud Store into LocalStorage
   */
  async syncFromCloud() {
    try {
      const [bookingsRes, customEventsRes] = await Promise.allSettled([
        fetch(CLOUD_CONFIG.BOOKINGS_URL, { cache: "no-store" }),
        fetch(CLOUD_CONFIG.CUSTOM_EVENTS_URL, { cache: "no-store" })
      ]);

      let cloudBookings = [];
      if (bookingsRes.status === "fulfilled" && bookingsRes.value.ok) {
        try {
          const parsed = await bookingsRes.value.json();
          if (Array.isArray(parsed)) cloudBookings = parsed;
        } catch (_) {}
      }

      let cloudCustom = [];
      if (customEventsRes.status === "fulfilled" && customEventsRes.value.ok) {
        try {
          const parsed = await customEventsRes.value.json();
          if (Array.isArray(parsed)) cloudCustom = parsed;
        } catch (_) {}
      }

      // Merge Bookings: Deduplicate by id and bookingRef
      const localBookings = this.getRegistrations();
      const bookingMap = new Map();

      // Cloud bookings first (authoritative server records)
      cloudBookings.forEach(b => {
        if (b && (b.id || b.bookingRef)) {
          const key = b.id || b.bookingRef;
          bookingMap.set(key, b);
        }
      });

      // Merge any local bookings not yet in cloud
      let localHasNew = false;
      localBookings.forEach(b => {
        if (b && (b.id || b.bookingRef)) {
          const key = b.id || b.bookingRef;
          if (!bookingMap.has(key)) {
            bookingMap.set(key, b);
            localHasNew = true;
          }
        }
      });

      const mergedBookings = Array.from(bookingMap.values());
      // Sort newest first
      mergedBookings.sort((a, b) => new Date(b.bookedAt || 0) - new Date(a.bookedAt || 0));
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(mergedBookings));

      // If local had newly created offline bookings, push merged back to cloud
      if (localHasNew) {
        this.saveBookingsToCloud(mergedBookings);
      }

      // Merge Custom Events
      const localCustom = this.getCustomEvents();
      const customMap = new Map();

      cloudCustom.forEach(e => {
        if (e && e.id) customMap.set(e.id, e);
      });

      let customHasNew = false;
      localCustom.forEach(e => {
        if (e && e.id && !customMap.has(e.id)) {
          customMap.set(e.id, e);
          customHasNew = true;
        }
      });

      const mergedCustom = Array.from(customMap.values());
      localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(mergedCustom));

      if (customHasNew) {
        this.saveCustomEventsToCloud(mergedCustom);
      }

      return {
        success: true,
        registrations: mergedBookings,
        customEvents: mergedCustom
      };
    } catch (err) {
      console.warn("StorageManager: Cloud sync encountered an issue, using local cache", err);
      return {
        success: false,
        registrations: this.getRegistrations(),
        customEvents: this.getCustomEvents()
      };
    }
  },

  /**
   * Favorites / Bookmarks
   */
  getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  isFavorite(eventId) {
    const favs = this.getFavorites();
    return favs.includes(eventId);
  },

  toggleFavorite(eventId) {
    try {
      let favs = this.getFavorites();
      const exists = favs.includes(eventId);
      if (exists) {
        favs = favs.filter(id => id !== eventId);
      } else {
        favs.push(eventId);
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return !exists;
    } catch (e) {
      console.error("StorageManager: Failed to toggle favorite", e);
      return false;
    }
  },

  /**
   * Theme Management (Light / Dark)
   */
  getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || null;
    } catch (e) {
      return null;
    }
  },

  setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn("StorageManager: Failed to save theme", e);
    }
  },

  /**
   * Reset Demo Data (Clears local registrations, favorites, and cloud cache)
   */
  resetDemoData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_EVENTS);
      this.saveBookingsToCloud([]);
      this.saveCustomEventsToCloud([]);
      return true;
    } catch (e) {
      console.warn("StorageManager: Failed to reset demo data", e);
      return false;
    }
  }
};
