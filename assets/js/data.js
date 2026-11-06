/**
 * PulseEvents - Initial Events Data Store
 * Rich and realistic event listings with comprehensive metadata.
 */

const INITIAL_EVENTS = [
  {
    id: "evt-tech-2026-01",
    title: "AI & Next-Gen Cloud Summit 2026",
    category: "tech",
    categoryLabel: "Technology & AI",
    date: "2026-11-20",
    displayDate: "Friday, Nov 20, 2026",
    time: "09:30 AM - 05:30 PM IST",
    venue: "Main Convention Center, Silicon Hall",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    price: 0,
    priceLabel: "Free",
    capacity: 350,
    registered: 308,
    isFeatured: true,
    shortDescription: "Explore agentic AI architectures, large multimodal models, and next-generation cloud infrastructure with global tech pioneers.",
    fullDescription: "Join developers, AI researchers, and engineering leads for the premier Artificial Intelligence and Cloud Computing convention of 2026. This summit dives deep into agentic workflows, scalable vector databases, autonomous coding systems, and enterprise LLM deployment patterns. Enjoy hands-on architectural breakdowns, interactive demos, and high-impact networking with industry visionaries.",
    highlights: [
      "Keynote addresses from AI engineers at top research labs",
      "Live interactive demonstrations of multi-agent architectures",
      "Dedicated developer lounge with real-time coding challenges",
      "Exclusive networking lunch and career opportunities booth",
      "Free swags, certificates of participation, and premium access credits"
    ],
    agenda: [
      { time: "09:30 AM", title: "Registrations & Welcome Breakfast", speaker: "Organizing Committee" },
      { time: "10:30 AM", title: "Keynote: The Horizon of Autonomous Agentic Intelligence", speaker: "Dr. Ananya Roy, AI Lead" },
      { time: "12:00 PM", title: "Scaling High-Throughput Inference on Hybrid Clouds", speaker: "Vikram Malhotra, Principal Architect" },
      { time: "01:30 PM", title: "Networking Lunch & Project Showcases", speaker: "Open Exhibition Hall" },
      { time: "02:45 PM", title: "Hands-on Panel: From Monoliths to Autonomous Agent Swarms", speaker: "Industry Panelists" },
      { time: "04:30 PM", title: "Fireside Chat, Audience Q&A, and Awards Ceremony", speaker: "Host & Guests" }
    ],
    speakers: [
      {
        name: "Dr. Ananya Roy",
        role: "Chief AI Scientist",
        company: "DeepNeural Labs",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Vikram Malhotra",
        role: "VP of Cloud Engineering",
        company: "HyperScale Infrastructure",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Sarah Jenkins",
        role: "Founding Engineer",
        company: "Agentic Systems",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["AI", "Cloud", "MachineLearning", "Web3", "Networking"]
  },
  {
    id: "evt-music-2026-02",
    title: "PulseWave: Indie & Electronic Music Carnival",
    category: "music",
    categoryLabel: "Music & Cultural",
    date: "2026-11-28",
    displayDate: "Saturday, Nov 28, 2026",
    time: "05:00 PM - 11:30 PM IST",
    venue: "Open Air Amphitheatre, Green Campus Ground",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    price: 499,
    priceLabel: "₹499",
    capacity: 1200,
    registered: 980,
    isFeatured: true,
    shortDescription: "An electrifying open-air musical night featuring India's top indie-pop artists, electronic music producers, and immersive laser visuals.",
    fullDescription: "PulseWave 2026 unites sound enthusiasts, college bands, and premier electronic artists for a 6-hour sonic celebration under the stars. Experience breathtaking surround sound acoustics, synchronized LED light arrays, art installations, artisan food stalls, and an energetic youth community enjoying music at its peak.",
    highlights: [
      "3 dynamic stages: Indie Acoustic Stage, Bass & Synth Dome, and Main Arena",
      "Stunning 3D laser mapping and pyrotechnic visual displays",
      "Pop-up food trucks featuring global cuisines & artisan beverage bar",
      "Exclusive fan meet & greet for VIP pass holders",
      "Professional photo booths and interactive neon installations"
    ],
    agenda: [
      { time: "05:00 PM", title: "Gates Open & Ambient Sunset Soundscape", speaker: "DJ Chrono" },
      { time: "06:15 PM", title: "Opening Act: The Cosmic Drift (Indie Fusion)", speaker: "The Cosmic Drift Band" },
      { time: "07:45 PM", title: "Electropop Headliner Performance", speaker: "Rhea Sen & Band" },
      { time: "09:15 PM", title: "Hyper-Visual EDM Set with Laser Choreography", speaker: "DJ K-Sonic" },
      { time: "11:00 PM", title: "Grand Finale Fireworks & Encore", speaker: "All Artists" }
    ],
    speakers: [
      {
        name: "Rhea Sen",
        role: "Indie Singer-Songwriter",
        company: "Warner Music Artist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "DJ K-Sonic",
        role: "Electronic Producer",
        company: "Pulse Beats Collective",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Concert", "EDM", "IndieMusic", "LiveBand", "CampusFest"]
  },
  {
    id: "evt-gaming-2026-03",
    title: "Battlegrounds & Cyber Clash 2026",
    category: "gaming",
    categoryLabel: "Gaming & Esports",
    date: "2026-12-05",
    displayDate: "Saturday, Dec 05, 2026",
    time: "10:00 AM - 08:00 PM IST",
    venue: "Indoor Sports Complex & Esports Arena",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    price: 199,
    priceLabel: "₹199",
    capacity: 500,
    registered: 440,
    isFeatured: false,
    shortDescription: "High-octane national collegiate esports tournament featuring Valorant, BGMI, EA Sports FC 26, and Fighting Games.",
    fullDescription: "Step into the ultimate battle zone! The Cyber Clash 2026 brings together the sharpest tactical gamers and esports competitors to battle on tournament-grade 240Hz setups with live commentary, professional broadcast production, and a ₹1,00,000 prize pool. Spectators can participate in audience mini-tourneys, VR experiential zones, and meet leading gaming creators.",
    highlights: [
      "₹1,00,000 total cash prize pool across all game titles",
      "State-of-the-art gaming stations with zero-latency fiber network",
      "Live shoutcasting on high-definition jumbotron display walls",
      "Interactive VR simulation booth and retro arcade corner",
      "Exclusive merchandise giveaways and pro-gaming gear raffle"
    ],
    agenda: [
      { time: "10:00 AM", title: "Player Check-In & Bracket Seeding", speaker: "Esports Marshals" },
      { time: "11:00 AM", title: "Valorant Quarter-Finals & Semi-Finals", speaker: "Main Arena 1" },
      { time: "02:30 PM", title: "BGMI Invitational Battle Royale Showdown", speaker: "Jumbotron Arena" },
      { time: "05:00 PM", title: "EA Sports FC 26 Championship Match", speaker: "Grand Stage" },
      { time: "06:30 PM", title: "Grand Finals & Prize Distribution Ceremony", speaker: "Special Guest Streamers" }
    ],
    speakers: [
      {
        name: "Arjun 'Shadow' Rao",
        role: "Professional Caster & Analyst",
        company: "Esports Arena India",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Meera 'Valkyrie' Das",
        role: "National Valorant Champion",
        company: "Team Velocity",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Esports", "Valorant", "BGMI", "Gaming", "Tournament"]
  },
  {
    id: "evt-hack-2026-04",
    title: "CodeGenesis: 36-Hour National Hackathon",
    category: "workshop",
    categoryLabel: "Workshops & Hackathons",
    date: "2026-12-12",
    displayDate: "Saturday, Dec 12, 2026",
    time: "08:00 AM (36 Hours Continuous)",
    venue: "Innovation & Incubation Hub, Block 4",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    price: 0,
    priceLabel: "Free",
    capacity: 250,
    registered: 215,
    isFeatured: true,
    shortDescription: "36 hours of non-stop coding, innovating, and building groundbreaking solutions in Web3, HealthTech, AI Agents, and GreenTech.",
    fullDescription: "CodeGenesis 2026 invites student developers, product designers, and innovators from across the country to solve real-world industry challenges. Work with top mentors from leading tech companies, access unlimited caffeine, high-speed connectivity, hardware kits, and pitch your prototypes to venture capitalists for angel funding and incubation support.",
    highlights: [
      "Mentorship sessions with senior engineers from Google, Microsoft, and startups",
      "Over ₹2,50,000 in bounties, cloud credits, and accelerator access",
      "Free 24/7 food, midnight pizza, energy drinks, and rest zones",
      "API workshops on cutting-edge agentic toolkits and LLM frameworks",
      "Direct fast-track interview opportunities for outstanding builders"
    ],
    agenda: [
      { time: "Day 1, 08:00 AM", title: "Team Registration & Problem Statement Reveal", speaker: "Hackathon Directors" },
      { time: "Day 1, 10:00 AM", title: "Hackathon Starts: Hacking Window Opens", speaker: "All Teams" },
      { time: "Day 1, 04:00 PM", title: "Round 1 Mentorship & Architecture Review", speaker: "Mentors" },
      { time: "Day 2, 02:00 AM", title: "Midnight Trivia & De-stress Gaming Break", speaker: "Student Leads" },
      { time: "Day 2, 12:00 PM", title: "Final Code Freeze & Prototype Submissions", speaker: "Evaluation Portal" },
      { time: "Day 2, 02:30 PM", title: "Pitching to VC Judges & Grand Winner Awards", speaker: "Judges Panel" }
    ],
    speakers: [
      {
        name: "Devendra Patel",
        role: "Partner & Tech Angel",
        company: "SeedScale Ventures",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Pooja Krishnan",
        role: "Staff Developer Advocate",
        company: "CloudNative Foundation",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Hackathon", "Coding", "Startups", "Innovation", "Mentorship"]
  },
  {
    id: "evt-design-2026-05",
    title: "DesignCraft: Masterclass in Modern UI/UX & Design Systems",
    category: "workshop",
    categoryLabel: "Workshops & Hackathons",
    date: "2026-11-22",
    displayDate: "Sunday, Nov 22, 2026",
    time: "10:30 AM - 04:30 PM IST",
    venue: "Design Studio & Digital Lab 3",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    price: 249,
    priceLabel: "₹249",
    capacity: 120,
    registered: 95,
    isFeatured: false,
    shortDescription: "Hands-on intensive masterclass on micro-interactions, Figma component architectures, and building production-grade accessible design systems.",
    fullDescription: "Elevate your visual taste and engineering-design alignment. DesignCraft walks you through the practical mechanics of building cohesive design tokens, micro-animations, glassmorphic interfaces, accessibility standards (WCAG AAA), and prototyping workflows that developers can actually implement effortlessly.",
    highlights: [
      "Step-by-step creation of a complete interactive design system in Figma",
      "Practical workshops on CSS animations and SVG transitions",
      "1-on-1 portfolio reviews with lead product designers",
      "Access to premium UI component kit and typography presets",
      "Verified Certificate of Completion from Design Guild"
    ],
    agenda: [
      { time: "10:30 AM", title: "Principles of Emotional Design & Micro-interactions", speaker: "Tanvi Sharma" },
      { time: "12:00 PM", title: "Architecting Design Tokens in Figma & CSS Variables", speaker: "Tanvi Sharma" },
      { time: "01:30 PM", title: "Catered Lunch & Portfolio Showcase", speaker: "Open Floor" },
      { time: "02:30 PM", title: "Building Accessible, Responsive Web Layouts Live", speaker: "Rohan Varma" },
      { time: "04:00 PM", title: "Live Portfolio Teardowns & Feedback", speaker: "Panel" }
    ],
    speakers: [
      {
        name: "Tanvi Sharma",
        role: "Head of Product Design",
        company: "CraftStudio",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Rohan Varma",
        role: "Principal UI Architect",
        company: "Interface Lab",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["UIUX", "Figma", "DesignSystems", "ProductDesign", "CSS"]
  },
  {
    id: "evt-sports-2026-06",
    title: "K-Challengers: Inter-University Futsal & Athletics Cup",
    category: "sports",
    categoryLabel: "Sports & Fitness",
    date: "2026-11-25",
    displayDate: "Wednesday, Nov 25, 2026",
    time: "07:30 AM - 06:00 PM IST",
    venue: "Main Stadium Turf & Athletics Track",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    price: 0,
    priceLabel: "Free",
    capacity: 800,
    registered: 650,
    isFeatured: false,
    shortDescription: "Experience high-energy 5v5 futsal clashes, 100m sprint heats, and crossfit relay challenges between 16 top university squads.",
    fullDescription: "Cheer on the fastest runners and most agile futsal players in the region! K-Challengers 2026 unites collegiate athletes for a day packed with competitive spirit, fitness challenges, hydration zones, live acoustic sports anthems, and official scouts looking for collegiate athletic talent.",
    highlights: [
      "16 university futsal teams competing in lightning knockout rounds",
      "Sprint, relay, and long jump track and field showdowns",
      "Public fitness obstacle course with instant prizes for high scorers",
      "Certified sports physiotherapists and recovery lounge on-site",
      "Trophy presentation with honorary state sports guests"
    ],
    agenda: [
      { time: "07:30 AM", title: "Athlete Warm-up & March Past Ceremony", speaker: "Sports Council" },
      { time: "08:30 AM", title: "Futsal Group Stage Matches (Pitch 1 & 2)", speaker: "Tournament Referees" },
      { time: "11:30 AM", title: "Track & Field Sprint Heats (100m & 4x100m)", speaker: "Athletics Track" },
      { time: "02:30 PM", title: "Futsal Semi-Finals & Crossfit Challenge", speaker: "Main Turf" },
      { time: "04:30 PM", title: "Grand Final Match & Closing Ceremony", speaker: "Chief Guest" }
    ],
    speakers: [
      {
        name: "Coach Rajesh Mohanty",
        role: "Former National Football Player",
        company: "Athletics Federation",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Sports", "Futsal", "Fitness", "Athletics", "CollegeCup"]
  },
  {
    id: "evt-music-2026-07",
    title: "Harmony & Beats: Classical Fusion & Sufi Night",
    category: "music",
    categoryLabel: "Music & Cultural",
    date: "2026-12-18",
    displayDate: "Friday, Dec 18, 2026",
    time: "06:30 PM - 10:30 PM IST",
    venue: "Heritage Heritage Garden & Open Pavilion",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    price: 299,
    priceLabel: "₹299",
    capacity: 600,
    registered: 490,
    isFeatured: false,
    shortDescription: "A serene and soulful evening of traditional sitar melodies, mystic sufi poetry, tabla rhythms, and modern ambient fusion.",
    fullDescription: "Immerse yourself in tranquil harmonies as world-renowned instrumentalists collaborate with vocal masters for an enchanting musical journey under fairy-lit banyan trees. Enjoy authentic Indian classical ragas transitioning seamlessly into modern meditative ambient soundscapes.",
    highlights: [
      "Soulful sufi renditions and jugalbandi between Sitar and Spanish Flamenco guitar",
      "Traditional earthen tea stalls with warm kulhad chai and delicacies",
      "Ambient fairy-lit open seating with comfortable cushions and floor rugs",
      "Artist storytelling sessions explaining the poetic origins of classical ragas"
    ],
    agenda: [
      { time: "06:30 PM", title: "Welcome Ragas & Evening Sitar Recital", speaker: "Pandit S. Mukherjee" },
      { time: "07:45 PM", title: "Sufi Mystic Poetry & Qawwali Ensemble", speaker: "Niazi Qawwals" },
      { time: "09:15 PM", title: "Acoustic Jugalbandi: Sitar meets Cello", speaker: "Ensemble Collaboration" },
      { time: "10:15 PM", title: "Closing Meditative Sound Bath", speaker: "All Artists" }
    ],
    speakers: [
      {
        name: "Pandit S. Mukherjee",
        role: "Master Sitar Virtuoso",
        company: "Sangeet Kala Kendra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Sufi", "Classical", "LiveMusic", "Acoustic", "Cultural"]
  },
  {
    id: "evt-tech-2026-08",
    title: "Quantum Leap: Cybersecurity & Ethical Hacking Forum",
    category: "tech",
    categoryLabel: "Technology & AI",
    date: "2026-12-22",
    displayDate: "Tuesday, Dec 22, 2026",
    time: "10:00 AM - 05:00 PM IST",
    venue: "Cyber Defense Research Wing, Hall 2",
    city: "Bhubaneswar",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    price: 0,
    priceLabel: "Free",
    capacity: 280,
    registered: 245,
    isFeatured: false,
    shortDescription: "Learn penetration testing, post-quantum encryption, zero-trust cloud defense, and live capture-the-flag (CTF) demonstrations.",
    fullDescription: "Gain battle-tested knowledge from cybersecurity engineers defending top financial infrastructure and cloud clusters. Witness live red-team vs. blue-team simulations, explore automated vulnerability scanners, and discover career paths in security architecture and digital forensics.",
    highlights: [
      "Live hacking demonstrations of modern web application vulnerabilities",
      "Zero-Trust security implementation patterns for microservices",
      "Hands-on mini CTF (Capture The Flag) with cash prizes and certs",
      "Direct guidance on CEH, OSCP, and cloud security certifications"
    ],
    agenda: [
      { time: "10:00 AM", title: "Keynote: Threat Landscape in the Age of Generative AI", speaker: "Karan Singhania" },
      { time: "11:30 AM", title: "Live Attack & Defense: Breaking Modern API Gateways", speaker: "Red Team Lab" },
      { time: "01:00 PM", title: "Lunch Break & Hardware Hacking Booth", speaker: "Security Village" },
      { time: "02:15 PM", title: "Zero Trust Architecture in Kubernetes & Cloud", speaker: "Aditi Sen" },
      { time: "03:45 PM", title: "Mini CTF Challenge & Winners Announcement", speaker: "CTF Lead" }
    ],
    speakers: [
      {
        name: "Karan Singhania",
        role: "Chief Information Security Officer",
        company: "SecureNet Global",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Aditi Sen",
        role: "Lead Cloud Security Researcher",
        company: "CyberArmor Labs",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      }
    ],
    tags: ["Cybersecurity", "EthicalHacking", "CTF", "ZeroTrust", "Infosec"]
  }
];

// Fallback images in case external network is offline
const FALLBACK_CATEGORY_IMAGES = {
  tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
  gaming: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
  workshop: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80"
};
