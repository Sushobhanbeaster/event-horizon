/**
 * PulseEvents - Bold 3D Holographic Engine & Spatial 3D Parallax
 * Features:
 * 1. 3D Rotating Gyroscope Rings & Shaded Polyhedral Core (True 3D Depth)
 * 2. Interactive Drag-to-Rotate in 3D Space with Inertia
 * 3. 3D Spatial Layer Parallax on Event Cards (translateZ multi-plane pop)
 * 4. 3D Ticket Flip & Perspective
 */

const Scene3D = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  rotX: 0.35,
  rotY: 0.5,
  velX: 0.004,
  velY: 0.008,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
  particles: [],
  gyroRings: [],
  polyFaces: [],
  polyVertices: [],
  animId: null,

  initHero() {
    this.canvas = document.getElementById("hero-3d-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Build 3D Gyroscope Rings
    this.initGyroscope();

    // Build 3D Shaded Polyhedron Gem
    this.initPolyhedron();

    // Build 3D Orbiting Particle Field
    this.initParticles();

    // Bind Interactive Drag & Touch in 3D Space
    this.bindControls();

    // Start 60fps Loop
    this.render();

    // Bind Deep 3D Card Layer Parallax
    this.initCard3DParallax();
  },

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.offsetWidth : window.innerWidth;
    this.height = parent ? parent.offsetHeight : 680;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  /**
   * 3D Gyroscope Rings (Planetary Gimbal Rings)
   */
  initGyroscope() {
    this.gyroRings = [
      { radius: 220, tiltX: 0.3, tiltY: 0.2, tiltZ: 0, speed: 0.012, color: "#6366f1", points: 48 },
      { radius: 180, tiltX: 1.1, tiltY: 0.6, tiltZ: 0.4, speed: -0.016, color: "#06b6d4", points: 40 },
      { radius: 140, tiltX: 0.6, tiltY: 1.3, tiltZ: 0.8, speed: 0.02, color: "#ec4899", points: 36 }
    ];
  },

  /**
   * 3D Icosahedron Core with Faces & Edges
   */
  initPolyhedron() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = 75;

    // 12 Vertices
    this.polyVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(v => ({ x: v[0] * scale, y: v[1] * scale, z: v[2] * scale }));

    // 20 Triangular Faces
    this.polyFaces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
  },

  /**
   * 3D Orbiting Cloud of Luminous Nodes
   */
  initParticles() {
    this.particles = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const radius = 100 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      this.particles.push({
        x: radius * Math.cos(theta) * Math.cos(phi),
        y: radius * Math.sin(phi),
        z: radius * Math.sin(theta) * Math.cos(phi),
        size: Math.random() * 3 + 2,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadius: radius,
        angle: theta,
        elevation: phi,
        color: i % 3 === 0 ? "#ec4899" : i % 2 === 0 ? "#06b6d4" : "#818cf8"
      });
    }
  },

  bindControls() {
    const hero = document.querySelector(".hero-section");
    if (!hero) return;

    // Mouse Drag to Rotate 3D Core
    hero.addEventListener("mousedown", (e) => {
      // Don't drag if clicking buttons, inputs, etc.
      if (e.target.closest("input, button, a, select")) return;
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      hero.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.rotY += dx * 0.008;
        this.rotX += dy * 0.008;
        this.velY = dx * 0.002;
        this.velX = dy * 0.002;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      } else {
        // Subtle cursor parallax when hovering
        const rect = hero.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        this.rotY += (nx * 0.02 - this.velY) * 0.05;
        this.rotX += (ny * 0.02 - this.velX) * 0.05;
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        hero.style.cursor = "default";
      }
    });

    // Touch Support for Mobile 3D Rotation
    hero.addEventListener("touchstart", (e) => {
      if (e.target.closest("input, button, a, select")) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    hero.addEventListener("touchmove", (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.rotY += dx * 0.01;
        this.rotX += dy * 0.01;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    hero.addEventListener("touchend", () => {
      this.isDragging = false;
    });
  },

  /**
   * Main 3D Rendering Pipeline
   */
  render() {
    if (!this.ctx || !this.canvas) return;

    // Apply inertia or continuous gentle spin
    if (!this.isDragging) {
      this.rotY += 0.006;
      this.rotX += 0.003;
      this.velX *= 0.94;
      this.velY *= 0.94;
      this.rotX += this.velX;
      this.rotY += this.velY;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    // Position 3D core slightly behind and above center
    const cy = Math.min(this.height * 0.45, 300);
    const focalLength = 550;

    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);

    // 3D Transform Function
    const project = (x, y, z) => {
      // Rotate Y
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate X
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = focalLength / (focalLength + z2 + 300);
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        scale,
        z: z2
      };
    };

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";

    // ----------------------------------------------------
    // 1. Draw 3D Orbiting Cloud Particles (Behind Objects)
    // ----------------------------------------------------
    this.particles.forEach(p => {
      p.angle += p.speed;
      p.x = p.orbitRadius * Math.cos(p.angle) * Math.cos(p.elevation);
      p.z = p.orbitRadius * Math.sin(p.angle) * Math.cos(p.elevation);

      const proj = project(p.x, p.y, p.z);
      p.proj = proj;

      if (proj.z < 0) {
        this.drawParticle(p, isDark);
      }
    });

    // ----------------------------------------------------
    // 2. Draw 3D Gyroscope Rings (Concentric Gimbal Rings)
    // ----------------------------------------------------
    this.gyroRings.forEach(ring => {
      ring.tiltZ += ring.speed;
      const ringCos = Math.cos(ring.tiltZ);
      const ringSin = Math.sin(ring.tiltZ);

      const pts = [];
      for (let i = 0; i <= ring.points; i++) {
        const u = (i / ring.points) * Math.PI * 2;
        // Ring in local plane rotated by tilt
        const lx = ring.radius * Math.cos(u);
        const ly = ring.radius * Math.sin(u) * Math.cos(ring.tiltX);
        const lz = ring.radius * Math.sin(u) * Math.sin(ring.tiltX);

        // Rotate in ring plane
        const rx = lx * ringCos - lz * ringSin;
        const rz = lx * ringSin + lz * ringCos;

        pts.push(project(rx, ly, rz));
      }

      // Draw Ring Stroke with 3D Depth Glow
      this.ctx.beginPath();
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = 2.2;
      this.ctx.globalAlpha = isDark ? 0.75 : 0.6;
      this.ctx.shadowColor = ring.color;
      this.ctx.shadowBlur = 12;

      for (let i = 0; i < pts.length; i++) {
        if (i === 0) this.ctx.moveTo(pts[i].px, pts[i].py);
        else this.ctx.lineTo(pts[i].px, pts[i].py);
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;

      // Draw Orbiting Luminous Beads on Rings
      const beadIndex = Math.floor(((Date.now() * 0.001 * Math.abs(ring.speed) * 30) % pts.length));
      const bead = pts[beadIndex];
      if (bead) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.shadowColor = ring.color;
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(bead.px, bead.py, 4.5 * bead.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // ----------------------------------------------------
    // 3. Draw 3D Shaded Polyhedron Gem (Core)
    // ----------------------------------------------------
    const transformedVertices = this.polyVertices.map(v => project(v.x, v.y, v.z));

    // Calculate face depths and normals for 3D Painter's Algorithm
    const faceData = this.polyFaces.map(face => {
      const v0 = transformedVertices[face[0]];
      const v1 = transformedVertices[face[1]];
      const v2 = transformedVertices[face[2]];

      const avgZ = (v0.z + v1.z + v2.z) / 3;

      // 2D Normal Cross Product for Backface Culling & Shading
      const ux = v1.px - v0.px;
      const uy = v1.py - v0.py;
      const vx = v2.px - v0.px;
      const vy = v2.py - v0.py;
      const crossZ = ux * vy - uy * vx;

      return {
        face,
        avgZ,
        crossZ,
        v0, v1, v2
      };
    });

    // Sort faces from back to front (Painter's Algorithm)
    faceData.sort((a, b) => a.avgZ - b.avgZ);

    faceData.forEach(item => {
      // Backface Culling: Only draw visible facing planes
      if (item.crossZ > 0) {
        // Lighting calculation based on orientation
        const intensity = Math.min(1, Math.max(0.15, item.crossZ / 3500));
        
        // Translucent Glowing 3D Facet
        this.ctx.beginPath();
        this.ctx.moveTo(item.v0.px, item.v0.py);
        this.ctx.lineTo(item.v1.px, item.v1.py);
        this.ctx.lineTo(item.v2.px, item.v2.py);
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(item.v0.px, item.v0.py, item.v2.px, item.v2.py);
        if (isDark) {
          grad.addColorStop(0, `rgba(99, 102, 241, ${0.25 + intensity * 0.45})`);
          grad.addColorStop(1, `rgba(236, 72, 153, ${0.15 + intensity * 0.35})`);
        } else {
          grad.addColorStop(0, `rgba(79, 70, 229, ${0.2 + intensity * 0.35})`);
          grad.addColorStop(1, `rgba(6, 182, 212, ${0.15 + intensity * 0.3})`);
        }

        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // 3D Wireframe Edge Highlight
        this.ctx.strokeStyle = isDark ? `rgba(165, 180, 252, ${0.4 + intensity * 0.5})` : `rgba(67, 56, 202, ${0.35 + intensity * 0.4})`;
        this.ctx.lineWidth = 1.6;
        this.ctx.stroke();
      }
    });

    // Draw Glowing 3D Vertices
    transformedVertices.forEach(v => {
      if (v.z > -40) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.shadowColor = "#818cf8";
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(v.px, v.py, 3.2 * v.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // ----------------------------------------------------
    // 4. Draw Foreground 3D Particles
    // ----------------------------------------------------
    this.particles.forEach(p => {
      if (p.proj && p.proj.z >= 0) {
        this.drawParticle(p, isDark);
      }
    });

    this.animId = requestAnimationFrame(() => this.render());
  },

  drawParticle(p, isDark) {
    const radius = Math.max(1.2, p.size * p.proj.scale);
    const alpha = Math.max(0.2, Math.min(0.95, (p.proj.z + 200) / 450));

    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = alpha;
    this.ctx.beginPath();
    this.ctx.arc(p.proj.px, p.proj.py, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Foreground particle soft glow halo
    if (p.proj.z > 80) {
      this.ctx.globalAlpha = alpha * 0.35;
      this.ctx.beginPath();
      this.ctx.arc(p.proj.px, p.proj.py, radius * 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  },

  /**
   * 3D Spatial Multi-Layer Parallax for Event Cards
   */
  initCard3DParallax() {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".event-card");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Tilt angles (up to 16 degrees for bold 3D perspective)
      const rotateX = ((cy - y) / cy) * 14;
      const rotateY = ((x - cx) / cx) * 14;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

      // Dynamic Glare
      let glare = card.querySelector(".card-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "card-glare";
        card.appendChild(glare);
      }

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, transparent 65%)`;
      glare.style.opacity = "1";
    });

    const resetCard = (card) => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      const glare = card.querySelector(".card-glare");
      if (glare) glare.style.opacity = "0";
    };

    container.addEventListener("mouseleave", (e) => {
      const card = e.target.closest(".event-card");
      if (card) resetCard(card);
    }, true);

    container.querySelectorAll(".event-card").forEach(card => {
      card.addEventListener("mouseleave", () => resetCard(card));
    });
  }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => Scene3D.initHero(), 80);
});
