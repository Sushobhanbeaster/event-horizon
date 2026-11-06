/**
 * PulseEvents - 3D Animation & Interactive Experience Module
 * 1. 3D Interactive Particle Constellation & Polyhedron Sphere in Hero Canvas
 * 2. 3D Card Tilt & Parallax Glare Effect
 * 3. 3D Ticket Flip & Perspective
 */

const Scene3D = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  nodes: [],
  nodeCount: 75,
  polyVertices: [],
  angleX: 0,
  angleY: 0,
  targetAngleX: 0,
  targetAngleY: 0,
  mouseX: 0,
  mouseY: 0,
  isHovering: false,
  animId: null,

  /**
   * Initialize 3D Hero Scene
   */
  initHero() {
    this.canvas = document.getElementById("hero-3d-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Generate 3D point cloud
    this.nodes = [];
    const radius = Math.min(this.width, this.height) * 0.45;
    for (let i = 0; i < this.nodeCount; i++) {
      // Fibonacci sphere distribution for uniform 3D sphere point sampling
      const phi = Math.acos(-1 + (2 * i) / this.nodeCount);
      const theta = Math.sqrt(this.nodeCount * Math.PI) * phi;
      const r = radius * (0.65 + Math.random() * 0.35);

      this.nodes.push({
        x: r * Math.cos(theta) * Math.sin(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi),
        size: Math.random() * 2.5 + 1.5,
        speed: (Math.random() - 0.5) * 0.005,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Generate 3D Icosahedron Core Wireframe
    this.initPolyhedron();

    // Mouse Tracking for 3D Camera Tilt
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        this.targetAngleY = x * 0.85;
        this.targetAngleX = -y * 0.85;
        this.isHovering = true;
      });

      heroSection.addEventListener("mouseleave", () => {
        this.targetAngleX = 0;
        this.targetAngleY = 0;
        this.isHovering = false;
      });
    }

    // Start 60fps Render Loop
    this.render();

    // Initialize 3D Card Tilt
    this.initCardTilt();
  },

  /**
   * Setup 3D Polyhedron core
   */
  initPolyhedron() {
    const t = (1 + Math.sqrt(5)) / 2;
    const s = 110; // scale
    const rawVertices = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];

    this.polyVertices = rawVertices.map(v => ({
      x: v[0] * s,
      y: v[1] * s,
      z: v[2] * s
    }));
  },

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.offsetWidth : window.innerWidth;
    this.height = parent ? parent.offsetHeight : 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  /**
   * 3D Rotation Matrix Calculation & Projection
   */
  render() {
    if (!this.ctx || !this.canvas) return;

    // Smooth inertia camera rotation
    this.angleX += (this.targetAngleX - this.angleX) * 0.05 + 0.0018;
    this.angleY += (this.targetAngleY - this.angleY) * 0.05 + 0.0035;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const focalLength = 480;

    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const primaryColor = isDark ? "rgba(99, 102, 241," : "rgba(79, 70, 229,";
    const accentColor = isDark ? "rgba(236, 72, 153," : "rgba(219, 39, 119,";
    const cyanColor = isDark ? "rgba(6, 182, 212," : "rgba(8, 145, 178,";

    // Project nodes
    const projected = this.nodes.map(node => {
      // Rotate Y
      const x1 = node.x * cosY + node.z * sinY;
      const z1 = -node.x * sinY + node.z * cosY;

      // Rotate X
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const scale = focalLength / (focalLength + z2 + 350);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;
      const alpha = Math.max(0.08, Math.min(0.9, (z2 + 250) / 500));

      return { px, py, scale, z: z2, alpha, size: node.size };
    });

    // Draw connecting 3D constellation lines
    this.ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const p1 = projected[i];
        const p2 = projected[j];
        const dx = p1.px - p2.px;
        const dy = p1.py - p2.py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 95) {
          const lineAlpha = (1 - dist / 95) * 0.22 * Math.min(p1.alpha, p2.alpha);
          this.ctx.strokeStyle = `${primaryColor} ${lineAlpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.px, p1.py);
          this.ctx.lineTo(p2.px, p2.py);
          this.ctx.stroke();
        }
      }
    }

    // Draw 3D nodes
    projected.forEach((p, idx) => {
      const radius = Math.max(1, p.size * p.scale);
      const color = idx % 3 === 0 ? accentColor : idx % 2 === 0 ? cyanColor : primaryColor;
      
      this.ctx.fillStyle = `${color} ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Glowing aura for closest foreground nodes
      if (p.z > 80) {
        this.ctx.fillStyle = `${color} ${p.alpha * 0.35})`;
        this.ctx.beginPath();
        this.ctx.arc(p.px, p.py, radius * 2.8, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Draw central 3D Polyhedron wireframe
    const polyProjected = this.polyVertices.map(v => {
      const x1 = v.x * cosY + v.z * sinY;
      const z1 = -v.x * sinY + v.z * cosY;
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;
      const scale = focalLength / (focalLength + z2 + 350);
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        alpha: Math.max(0.15, (z2 + 200) / 400)
      };
    });

    this.ctx.strokeStyle = isDark ? "rgba(139, 92, 246, 0.25)" : "rgba(124, 58, 237, 0.2)";
    this.ctx.lineWidth = 1.2;
    for (let i = 0; i < polyProjected.length; i++) {
      for (let j = i + 1; j < polyProjected.length; j++) {
        const dx = polyProjected[i].px - polyProjected[j].px;
        const dy = polyProjected[i].py - polyProjected[j].py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          this.ctx.beginPath();
          this.ctx.moveTo(polyProjected[i].px, polyProjected[i].py);
          this.ctx.lineTo(polyProjected[j].px, polyProjected[j].py);
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.render());
  },

  /**
   * 3D Perspective Card Tilt on Mouse Move
   */
  initCardTilt() {
    const container = document.getElementById("events-container");
    if (!container) return;

    // Delegate mousemove on cards
    container.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".event-card");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic Glare effect
      let glare = card.querySelector(".card-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "card-glare";
        card.appendChild(glare);
      }

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
      glare.style.opacity = "1";
    });

    container.addEventListener("mouseleave", (e) => {
      const card = e.target.closest(".event-card");
      if (!card) return;
      this.resetCardTilt(card);
    }, true);

    // Reset when mouse leaves a specific card
    container.querySelectorAll(".event-card").forEach(card => {
      card.addEventListener("mouseleave", () => this.resetCardTilt(card));
    });
  },

  resetCardTilt(card) {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    const glare = card.querySelector(".card-glare");
    if (glare) {
      glare.style.opacity = "0";
    }
  }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => Scene3D.initHero(), 100);
});
