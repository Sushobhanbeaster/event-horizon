/**
 * PulseEvents - Ticket Generation & Celebration Module
 * Renders dynamic tickets, generates visual QR codes, and triggers confetti celebration.
 */

const TicketManager = {
  /**
   * Generates a high-contrast procedural QR code on a Canvas element
   * Creates an authentic QR pattern with position markers and data modules
   */
  renderQRCode(canvas, dataString) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width || 160;
    canvas.height = size;

    // Reset background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random generator based on data string hash
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = (hash << 5) - hash + dataString.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 21; // 21x21 QR Version 1 grid
    const cellSize = size / gridSize;

    function pseudoRandom() {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    }

    // Draw finder pattern (the 3 corner squares)
    function drawFinder(rX, rY) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(rX * cellSize, rY * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect((rX + 1) * cellSize, (rY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect((rX + 2) * cellSize, (rY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    drawFinder(0, 0);                 // Top-Left
    drawFinder(gridSize - 7, 0);      // Top-Right
    drawFinder(0, gridSize - 7);      // Bottom-Left

    // Draw timing patterns
    ctx.fillStyle = "#0f172a";
    for (let i = 8; i < gridSize - 8; i += 2) {
      ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
    }

    // Fill data area with pseudo-random pattern based on string hash
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= gridSize - 8;
        const inBL = r >= gridSize - 8 && c < 8;
        const inTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !inTiming) {
          if (pseudoRandom() > 0.46) {
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.2, cellSize - 0.2);
          }
        }
      }
    }
  },

  /**
   * Pure JS Canvas Confetti Celebration
   */
  launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#38bdf8", "#8b5cf6"];
    const particles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 100,
        radius: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18 - 4,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
          ctx.restore();
        }
      });

      frames++;
      if (active && frames < 240) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    render();
  },

  /**
   * Render Digital Boarding Pass Ticket into DOM
   */
  renderTicketPass(registration, event) {
    const container = document.getElementById("ticket-pass-content");
    if (!container) return;

    const qrData = JSON.stringify({
      ref: registration.bookingRef,
      name: registration.fullName,
      evt: event.title,
      dt: event.date
    });

    const isFree = event.price === 0;
    const tierName = registration.ticketTier || "General Admission";

    container.innerHTML = `
      <div class="ticket-card" id="printable-ticket">
        <div class="ticket-header">
          <div class="ticket-brand">
            <span class="ticket-logo-icon">⚡</span>
            <div>
              <div class="ticket-brand-name">K-Pulse Events Pass</div>
              <div class="ticket-badge">CONFIRMED ATTENDEE</div>
            </div>
          </div>
          <div class="ticket-ref">
            <span class="ref-label">REF #</span>
            <span class="ref-number">${registration.bookingRef}</span>
          </div>
        </div>

        <div class="ticket-body">
          <div class="ticket-event-info">
            <span class="ticket-tag">${event.categoryLabel}</span>
            <h3 class="ticket-event-title">${event.title}</h3>
            <p class="ticket-event-desc">${event.shortDescription}</p>
          </div>

          <div class="ticket-details-grid">
            <div class="detail-item">
              <span class="detail-label">ATTENDEE</span>
              <span class="detail-val">${registration.fullName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">PASS TIER</span>
              <span class="detail-val highlight-tier">${tierName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">DATE & TIME</span>
              <span class="detail-val">${event.displayDate}</span>
              <span class="detail-sub">${event.time}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">VENUE</span>
              <span class="detail-val">${event.venue}</span>
              <span class="detail-sub">${event.city}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">SEATS BOOKED</span>
              <span class="detail-val">${registration.ticketQuantity || 1} Pass(es)</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">PRICE STATUS</span>
              <span class="detail-val status-paid">${isFree ? "Free Entry" : "₹" + (event.price * (registration.ticketQuantity || 1)) + " (Paid)"}</span>
            </div>
          </div>
        </div>

        <div class="ticket-perforation">
          <div class="notch notch-left"></div>
          <div class="dash-line"></div>
          <div class="notch notch-right"></div>
        </div>

        <div class="ticket-footer">
          <div class="ticket-qr-section">
            <canvas id="ticket-qr-canvas" width="130" height="130" class="qr-canvas"></canvas>
            <span class="qr-caption">Scan at gate to enter</span>
          </div>
          <div class="ticket-barcode-section">
            <div class="barcode-visual">
              <span class="bar b1"></span><span class="bar b3"></span><span class="bar b2"></span>
              <span class="bar b1"></span><span class="bar b4"></span><span class="bar b2"></span>
              <span class="bar b3"></span><span class="bar b1"></span><span class="bar b2"></span>
              <span class="bar b4"></span><span class="bar b1"></span><span class="bar b3"></span>
              <span class="bar b2"></span><span class="bar b4"></span><span class="bar b1"></span>
              <span class="bar b3"></span><span class="bar b2"></span><span class="bar b1"></span>
            </div>
            <div class="ticket-id-code">${registration.id}</div>
            <div class="ticket-notice">Present this digital pass or printed copy along with valid College / Photo ID at the gate.</div>
          </div>
        </div>
      </div>
    `;

    // Render Canvas QR Code
    setTimeout(() => {
      const qrCanvas = document.getElementById("ticket-qr-canvas");
      if (qrCanvas) {
        this.renderQRCode(qrCanvas, qrData);
      }
    }, 50);
  },

  /**
   * Trigger native browser print formatted for ticket
   */
  printTicket() {
    window.print();
  },

  /**
   * Generate calendar (.ics) file or Google Calendar link
   */
  addToGoogleCalendar(event) {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.shortDescription + "\nVenue: " + event.venue);
    const location = encodeURIComponent(event.venue + ", " + event.city);
    
    // Format YYYYMMDD
    const rawDate = event.date ? event.date.replace(/-/g, "") : "20261120";
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${rawDate}T093000Z/${rawDate}T173000Z&details=${details}&location=${location}`;
    
    window.open(gCalUrl, "_blank");
  }
};
