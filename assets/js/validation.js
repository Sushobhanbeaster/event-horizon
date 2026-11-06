/**
 * PulseEvents - Form Validation Module
 * Provides real-time field validation, error rendering, and full-form verification.
 */

const FormValidator = {
  // Regular expressions for field validation
  rules: {
    name: {
      regex: /^[a-zA-Z\s'.]{3,50}$/,
      message: "Please enter a valid full name (at least 3 alphabetical characters)."
    },
    email: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please enter a valid email address (e.g., alex@example.com)."
    },
    phone: {
      regex: /^[6-9]\d{9}$/, // Standard 10-digit mobile number
      message: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9."
    }
  },

  /**
   * Validate a single input field
   * @param {HTMLInputElement|HTMLSelectElement} input 
   * @param {string} [eventId] Optional event ID for duplicate registration check
   * @returns {{isValid: boolean, error: string}}
   */
  validateField(input, eventId = null) {
    const name = input.name;
    const value = input.value ? input.value.trim() : "";
    let isValid = true;
    let error = "";

    // Required check
    if (input.required && (!value || (input.type === "checkbox" && !input.checked))) {
      isValid = false;
      error = "This field is required.";
      this.renderFieldError(input, error);
      return { isValid, error };
    }

    // Specific field type rules
    if (name === "fullName" && value) {
      if (value.length < 3) {
        isValid = false;
        error = "Name must be at least 3 characters long.";
      } else if (!this.rules.name.regex.test(value)) {
        isValid = false;
        error = this.rules.name.message;
      }
    } else if (name === "email" && value) {
      if (!this.rules.email.regex.test(value)) {
        isValid = false;
        error = this.rules.email.message;
      } else if (eventId && StorageManager.isAlreadyRegistered(value, eventId)) {
        isValid = false;
        error = "This email is already registered for this event. Check 'My Tickets'.";
      }
    } else if (name === "phone" && value) {
      // Clean up common separators (spaces, hyphens, +91)
      const cleanPhone = value.replace(/^(\+91|0)/, "").replace(/[\s-]/g, "");
      if (!this.rules.phone.regex.test(cleanPhone)) {
        isValid = false;
        error = this.rules.phone.message;
      }
    } else if (name === "ticketQuantity") {
      const qty = parseInt(value, 10);
      if (isNaN(qty) || qty < 1 || qty > 5) {
        isValid = false;
        error = "Please select between 1 and 5 tickets.";
      }
    } else if (name === "terms") {
      if (!input.checked) {
        isValid = false;
        error = "You must agree to the terms and code of conduct.";
      }
    }

    if (isValid) {
      this.clearFieldError(input);
    } else {
      this.renderFieldError(input, error);
    }

    return { isValid, error };
  },

  /**
   * Render error UI for an input field
   */
  renderFieldError(input, message) {
    input.classList.add("input-error");
    input.classList.remove("input-valid");
    input.setAttribute("aria-invalid", "true");

    const parent = input.closest(".form-group") || input.parentElement;
    let errorEl = parent.querySelector(".field-error-msg");
    
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "field-error-msg";
      errorEl.setAttribute("role", "alert");
      parent.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  },

  /**
   * Clear error UI for an input field
   */
  clearFieldError(input) {
    input.classList.remove("input-error");
    if (input.value && input.value.trim() !== "") {
      input.classList.add("input-valid");
    } else {
      input.classList.remove("input-valid");
    }
    input.removeAttribute("aria-invalid");

    const parent = input.closest(".form-group") || input.parentElement;
    const errorEl = parent.querySelector(".field-error-msg");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  },

  /**
   * Validate entire form on submit
   * @param {HTMLFormElement} form 
   * @param {string} [eventId]
   * @returns {boolean}
   */
  validateForm(form, eventId = null) {
    let formIsValid = true;
    let firstInvalidInput = null;

    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      // Don't validate hidden or disabled inputs
      if (input.type === "hidden" || input.disabled) return;

      const result = this.validateField(input, eventId);
      if (!result.isValid) {
        formIsValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      if (typeof firstInvalidInput.scrollIntoView === "function") {
        firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return formIsValid;
  },

  /**
   * Attach live validation listeners to form inputs
   */
  bindLiveValidation(form, getActiveEventId) {
    const inputs = form.querySelectorAll("input, select");
    
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener("blur", () => {
        const eventId = typeof getActiveEventId === "function" ? getActiveEventId() : null;
        this.validateField(input, eventId);
      });

      // Clear error on input/change if now valid
      input.addEventListener("input", () => {
        if (input.classList.contains("input-error")) {
          const eventId = typeof getActiveEventId === "function" ? getActiveEventId() : null;
          this.validateField(input, eventId);
        }
      });
    });
  }
};
