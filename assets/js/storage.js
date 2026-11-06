/**
 * PulseEvents - Storage Engine
 * Manages LocalStorage persistence for Registrations, Favorites, Custom Events, and Theme.
 */

const STORAGE_KEYS = {
  REGISTRATIONS: "pulse_events_registrations_v1",
  FAVORITES: "pulse_events_favorites_v1",
  CUSTOM_EVENTS: "pulse_events_custom_v1",
  THEME: "pulse_events_theme_v1"
};

const StorageManager = {
  /**
   * Fetch all events (combines initial dataset with user-created events)
   */
  getAllEvents() {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
      const customEvents = customRaw ? JSON.parse(customRaw) : [];
      return [...INITIAL_EVENTS, ...customEvents];
    } catch (e) {
      console.warn("StorageManager: Failed to read custom events", e);
      return [...INITIAL_EVENTS];
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
   * Create a new custom event (Organizer Mode)
   */
  createEvent(eventData) {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
      const customEvents = customRaw ? JSON.parse(customRaw) : [];
      
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
            company: "Pulse Community",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
          }
        ],
        tags: [eventData.category, "Campus", "PulseEvent"],
        ...eventData
      };

      customEvents.unshift(newEvent);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(customEvents));
      return newEvent;
    } catch (e) {
      console.error("StorageManager: Failed to save custom event", e);
      return null;
    }
  },

  /**
   * Retrieve all saved registrations
   */
  getRegistrations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("StorageManager: Failed to get registrations", e);
      return [];
    }
  },

  /**
   * Save a new registration
   */
  saveRegistration(data) {
    try {
      const registrations = this.getRegistrations();
      
      const registration = {
        id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
        bookingRef: "KP-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
        bookedAt: new Date().toISOString(),
        ...data
      };

      registrations.unshift(registration);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
      
      // Update registration counter on custom events or memory
      this.incrementAttendeeCount(data.eventId, data.ticketQuantity || 1);
      
      return registration;
    } catch (e) {
      console.error("StorageManager: Failed to save registration", e);
      return null;
    }
  },

  /**
   * Cancel an existing registration
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
      r => r.email.toLowerCase().trim() === email.toLowerCase().trim() && r.eventId === eventId
    );
  },

  /**
   * Adjust attendee count on custom events or trigger event refresh
   */
  incrementAttendeeCount(eventId, count) {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
      if (!customRaw) return;
      const customEvents = JSON.parse(customRaw);
      const found = customEvents.find(e => e.id === eventId);
      if (found) {
        found.registered = Math.max(0, (found.registered || 0) + count);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(customEvents));
      }
    } catch (e) {
      console.warn("StorageManager: Increment attendee count failed", e);
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
   * Reset Demo Data (Clears registrations, favorites, and user-published events)
   */
  resetDemoData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_EVENTS);
      return true;
    } catch (e) {
      console.warn("StorageManager: Failed to reset demo data", e);
      return false;
    }
  }
};

