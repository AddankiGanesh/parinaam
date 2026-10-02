import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface MockUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string | null;
  role: 'student' | 'club_admin' | 'super_admin';
  club_id?: string | null;
  college_name?: string | null;
  is_amrita_student: boolean;
  roll_number?: string | null;
  department?: string | null;
  year_of_study?: string | null;
  city?: string | null;
  id_card_url?: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_note?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  platform_fee_paid: boolean;
  platform_payment_id?: string | null;
  platform_fee_paid_at?: string | null;
  qr_token: string;
  pass_type: string;
  avatar_url?: string | null;
  email_verified: boolean;
  email_verify_token?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockClub {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_url?: string | null;
  banner_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockEvent {
  id: string;
  club_id: string;
  created_by: string;
  name: string;
  event_code: string;
  tagline: string;
  short_description: string;
  full_description: string;
  category: string;
  tags: string[];
  venue: string;
  date_start: string;
  date_end: string;
  start_time: string;
  end_time: string;
  day_number: number;
  min_team_size: number;
  max_team_size: number;
  capacity: number;
  enrolled: number;
  fee: number;
  prize_pool: string;
  eligibility: string;
  rules: string[];
  rounds: any[];
  coordinators: any[];
  poster_url: string;
  rulebook_url: string;
  status: string;
  registration_open: boolean;
  is_popular: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Fixed Password hash for 'Admin@123'
const ADMIN_PASSWORD_HASH = '$2b$10$oVTYvxiKT8AVrgLI6FDkduvkxf7ZAOMPBLpJYn4PvqSgUO7lcUUIS';

// 12 CLUBS
const CLUBS_DATA: MockClub[] = [
  { id: 'club-1', name: 'Chakravyuha', slug: 'chakravyuha', description: 'Technical, Hackathons & Coding Events', color: '#6366f1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-2', name: 'Prachurya', slug: 'prachurya', description: 'Cultural, Fine Arts & Literary Competitions', color: '#f59e0b', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-3', name: 'ReLU', slug: 'relu', description: 'AI/ML, Data Analytics & Deep Learning Hackathons', color: '#10b981', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-4', name: 'Avisruta', slug: 'avisruta', description: 'Battle of Bands, Solo Vocals & Instrumental', color: '#8b5cf6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-5', name: 'Salesforce AgentBlazer', slug: 'salesforce-agentblazer', description: 'Cloud Computing, Enterprise Solutions & Case Studies', color: '#3b82f6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-6', name: 'Saptaswara', slug: 'saptaswara', description: 'Performing Arts, Classical Music & Choir', color: '#ec4899', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-7', name: 'Robotics', slug: 'robotics', description: 'RoboWars, Line Follower & Drone Challenges', color: '#f97316', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-8', name: 'IEEE', slug: 'ieee', description: 'Electrical & Electronics Circuit Battles', color: '#06b6d4', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-9', name: 'Avinya', slug: 'avinya', description: 'Innovation, Shark Tank & Entrepreneurship', color: '#84cc16', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-10', name: 'Adivika', slug: 'adivika', description: 'Street Play, Drama, Mime & Heritage Arts', color: '#e11d48', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-11', name: 'Nrityasparsh', slug: 'nrityasparsh', description: 'Dance Battles, Solo, Duet & Group Choreography', color: '#a855f7', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-12', name: 'Drisya', slug: 'drisya', description: 'Film Making, Photography, Reels & Visual Media', color: '#14b8a6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Initial seeded users
const USERS_DATA: MockUser[] = [
  // Super Admin
  {
    id: 'usr-superadmin',
    email: 'superadmin@parinaam.fest',
    password_hash: ADMIN_PASSWORD_HASH,
    full_name: 'Parinaam Super Admin',
    phone: '+91 9999900000',
    role: 'super_admin',
    club_id: null,
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    is_amrita_student: true,
    verification_status: 'verified',
    platform_fee_paid: true,
    qr_token: 'qr-superadmin-token-001',
    pass_type: 'ALL ACCESS VIP PASS',
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // 12 Club Admins
  ...CLUBS_DATA.map((club, idx) => ({
    id: `usr-admin-${club.slug}`,
    email: `admin.${club.slug}@parinaam.fest`,
    password_hash: ADMIN_PASSWORD_HASH,
    full_name: `${club.name} Admin`,
    phone: `+91 98888000${(idx + 1).toString().padStart(2, '0')}`,
    role: 'club_admin' as const,
    club_id: club.id,
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    is_amrita_student: true,
    verification_status: 'verified' as const,
    platform_fee_paid: true,
    qr_token: `qr-admin-${club.slug}-001`,
    pass_type: 'ORGANIZER PASS',
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
];

// 14 Official Parinaam 2026 Festival Competitions across 12 Clubs
const EVENTS_DATA: MockEvent[] = [
  {
    id: 'evt-01',
    club_id: 'club-1',
    created_by: 'usr-admin-chakravyuha',
    name: 'Code Red: The Hackathon Murder Mystery',
    event_code: 'TECH-RED-01',
    tagline: 'Crack the Code. Analyze Forensics. Solve the Mystery.',
    short_description: 'A 24-hour hackathon-style event combining coding, cyber forensics, and an immersive murder-mystery investigation.',
    full_description: 'Code Red is an exhilarating hackathon murder mystery where participants act as elite digital forensic sleuths. You will analyze suspicious code repositories, decode cryptographic ciphers, query compromised server logs, and engineer automation scripts to uncover clues and unmask the digital culprit before the clock runs out.',
    category: 'Coding & Hackathon',
    tags: ['hackathon', 'cybersecurity', 'forensics', 'python', 'ciphers'],
    venue: 'Innovation Complex - Forensic Cyber Lab',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '10:00 AM',
    end_time: '05:30 PM',
    day_number: 1,
    min_team_size: 2,
    max_team_size: 4,
    capacity: 200,
    enrolled: 74,
    fee: 300,
    prize_pool: '₹1,50,000',
    eligibility: 'Open to all college students with valid student ID.',
    rules: [
      'Teams must solve narrative-driven coding challenges to unlock each sequential forensic clue.',
      'Programming languages permitted: Python, C++, Go, JavaScript, and Bash.',
      'Forensic log analysis, payload decryption, and algorithm design evaluated on speed and accuracy.',
      'External assistance or sharing solutions between teams results in immediate disqualification.'
    ],
    rounds: [
      { name: 'Round 1: Digital Crime Scene', description: 'Log parsing, header decoding, and finding initial breach vector', date: 'Oct 11, 10:00 AM' },
      { name: 'Round 2: Cipher Matrix', description: 'Cracking encrypted memory dumps and malware staging scripts', date: 'Oct 11, 01:30 PM' },
      { name: 'Final Round: Unmask the Culprit', description: 'Live automated exploitation mitigation and forensic indictment report', date: 'Oct 11, 04:00 PM' }
    ],
    coordinators: [
      { name: 'Kavya Raman', role: 'Event Lead', phone: '+91 98765 11001', email: 'codered@parinaamfest.org' },
      { name: 'Dr. Suresh V', role: 'Faculty Mentor', phone: '+91 94433 11002' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-02',
    club_id: 'club-3',
    created_by: 'usr-admin-relu',
    name: 'AgentForge – Autonomous AI Agents Challenge',
    event_code: 'AI-AGENT-02',
    tagline: 'Architect Autonomous Intelligence & Multi-Agent Swarms',
    short_description: 'Build practical multi-agent AI solutions using LangChain, CrewAI, AutoGen, and LLM reasoning pipelines.',
    full_description: 'AgentForge challenges developers to architect autonomous AI agents capable of high-level reasoning, web browsing, self-reflection, and tool invocation. Teams will tackle real-world enterprise automation scenarios using modern LLM APIs and open-weight models.',
    category: 'Technical',
    tags: ['ai', 'agents', 'llm', 'langchain', 'crewai'],
    venue: 'Computing Hub - AI Intelligence Lab',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '11:00 AM',
    end_time: '05:00 PM',
    day_number: 1,
    min_team_size: 1,
    max_team_size: 3,
    capacity: 120,
    enrolled: 48,
    fee: 250,
    prize_pool: '₹1,20,000',
    eligibility: 'Open to developers passionate about generative AI and autonomous agents.',
    rules: [
      'Agents must perform end-to-end task execution autonomously with human-in-the-loop fallback.',
      'Evaluated on tool reliability, latency, multi-agent communication harmony, and task success rate.',
      'Open-source and closed API models (Claude, Gemini, OpenAI, Ollama) are permitted.'
    ],
    rounds: [
      { name: 'Sprint 1: Tool Harness & Memory', description: 'Equip agent with custom search tools and persistent state store', date: 'Oct 11, 11:00 AM' },
      { name: 'Sprint 2: Multi-Agent Swarm', description: 'Coordinate orchestrator and worker agents to solve complex workflows', date: 'Oct 11, 02:00 PM' }
    ],
    coordinators: [
      { name: 'Ananya Sharma', role: 'AI Track Head', phone: '+91 98765 11003', email: 'relu.ai@parinaamfest.org' },
      { name: 'Prof. Ramesh K', role: 'Faculty Advisor', phone: '+91 94433 11004' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-03',
    club_id: 'club-7',
    created_by: 'usr-admin-robotics',
    name: 'RoboWars: Steel Carnage',
    event_code: 'ROBO-WARS-03',
    tagline: 'Full Metal Combat. 15kg & 30kg Bot Deathmatch.',
    short_description: 'High-octane combat robotics in an armored bulletproof polycarbonate arena with spinners, flippers, and hammers.',
    full_description: 'Enter the steel arena where battle-hardened robotic weapons clash at violent RPMs. Custom-engineered 15kg and 30kg combat robots will duel across knockout brackets in front of thousands of roaring spectators.',
    category: 'Robotics',
    tags: ['robotics', 'combat', 'mechanical', 'electronics', 'hardware'],
    venue: 'Central Arena - Armored Hexagonal Ring',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '01:00 PM',
    end_time: '07:00 PM',
    day_number: 2,
    min_team_size: 2,
    max_team_size: 5,
    capacity: 64,
    enrolled: 32,
    fee: 500,
    prize_pool: '₹1,00,000',
    eligibility: 'All collegiate robotics teams with combat-ready radio-controlled robots complying with safety guidelines.',
    rules: [
      'Weight categories strictly enforced: 15kg Featherweight and 30kg Middleweight.',
      'Active weapon mandatory (drum spinner, horizontal bar, pneumatic flipper, or crusher).',
      'Failsafe RF radio control verification required during safety inspection before match entry.'
    ],
    rounds: [
      { name: 'Safety & Weapon Scrutiny', description: 'RF failsafe, armor thickness, and weight compliance inspection', date: 'Oct 12, 10:00 AM' },
      { name: 'Elimination Brackets', description: '3-minute deathmatches inside the bulletproof arena', date: 'Oct 12, 01:00 PM' },
      { name: 'Grand Championship Finals', description: 'Top 4 bots duel for the National Steel Carnage Trophy', date: 'Oct 12, 05:30 PM' }
    ],
    coordinators: [
      { name: 'Vikramaditya Rao', role: 'Robotics Lead', phone: '+91 98765 11005', email: 'robotics@parinaamfest.org' },
      { name: 'Dr. Anand Kumar', role: 'Faculty Mentor', phone: '+91 94433 11006' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-04',
    club_id: 'club-4',
    created_by: 'usr-admin-avisruta',
    name: 'Battle of the Bands: Sound Clash',
    event_code: 'CULT-BAND-04',
    tagline: 'Turn Up the Amps. Rock the Open Amphitheatre.',
    short_description: 'Collegiate rock, metal, indie, and fusion bands battle it out on the festival grand concert stage.',
    full_description: 'The ultimate rock battle of Southern India techfests. Avisruta hosts top student musical bands for an electric evening of roaring guitar solos, explosive drum breaks, and vocal showmanship evaluated by industry musicians.',
    category: 'Cultural',
    tags: ['music', 'rock', 'band', 'live', 'concert'],
    venue: 'Main Open Air Amphitheatre',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '06:00 PM',
    end_time: '10:00 PM',
    day_number: 1,
    min_team_size: 3,
    max_team_size: 8,
    capacity: 25,
    enrolled: 18,
    fee: 400,
    prize_pool: '₹80,000',
    eligibility: 'Open to college musical bands. At least 3 live instruments required.',
    rules: [
      'Each band is allocated 20 minutes (15 mins performance + 5 mins sound check).',
      'At least one original composition or creative adaptation strongly recommended.',
      'Standard drum kit, bass amp, and PA provided; bands bring their own guitars, pedals, and brass.'
    ],
    rounds: [
      { name: 'Stage Sound Check', description: 'Level adjustment, DI routing, and drum mic tuning', date: 'Oct 11, 04:00 PM' },
      { name: 'Live Concert Showcase', description: '15-minute high-energy sets in front of 4,000+ attendees', date: 'Oct 11, 06:00 PM' }
    ],
    coordinators: [
      { name: 'Karthik Nambiar', role: 'Music Coordinator', phone: '+91 98765 11007', email: 'avisruta@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-05',
    club_id: 'club-8',
    created_by: 'usr-admin-ieee',
    name: 'Circuit Master: Silicon & FPGA Hack',
    event_code: 'TECH-CIRC-05',
    tagline: 'Design, Debug, and Deploy on Real Silicon',
    short_description: 'Hardware breadboard debugging, Verilog/VHDL FPGA synthesis, and PCB routing speed trials.',
    full_description: 'Test your fundamental electrical and computer engineering skills. Contestants receive complex malfunctioning schematic layouts, breadboard modules, and FPGA development boards to troubleshoot glitching clock signals and logic hazards.',
    category: 'Technical',
    tags: ['electronics', 'fpga', 'circuits', 'verilog', 'hardware'],
    venue: 'VLSI & Embedded Systems Laboratory',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '10:30 AM',
    end_time: '03:30 PM',
    day_number: 1,
    min_team_size: 1,
    max_team_size: 3,
    capacity: 60,
    enrolled: 24,
    fee: 200,
    prize_pool: '₹60,000',
    eligibility: 'Open to ECE, EEE, CSE, and all engineering students.',
    rules: [
      'Round 1: Rapid hardware bug isolation on oscilloscope and logic analyzer.',
      'Round 2: FPGA implementation of high-throughput state machine and signal filter.'
    ],
    rounds: [
      { name: 'Round 1: Circuit Glitch Hunter', description: 'Identify and solder fix malfunctioning mixed-signal PCB', date: 'Oct 11, 10:30 AM' },
      { name: 'Round 2: FPGA Synthesis Challenge', description: 'Write Verilog to drive a dual-channel real-time DSP filter', date: 'Oct 11, 01:00 PM' }
    ],
    coordinators: [
      { name: 'Siddharth Iyer', role: 'IEEE Student Chair', phone: '+91 98765 11009', email: 'ieee@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-06',
    club_id: 'club-5',
    created_by: 'usr-admin-salesforce-agentblazer',
    name: 'Cloud Architect Sprint: Enterprise Scale',
    event_code: 'TECH-CLOUD-06',
    tagline: 'Modern Cloud Native Architecture & Microservices at Scale',
    short_description: 'Hands-on enterprise cloud challenge building resilient serverless architectures, event pipelines, and CRM bots.',
    full_description: 'Sponsored by Salesforce AgentBlazer. Participants will engineer zero-downtime microservices on cloud infrastructure, build event-driven data integrations, and automate customer lifecycle workflows.',
    category: 'Workshops',
    tags: ['cloud', 'aws', 'salesforce', 'serverless', 'microservices'],
    venue: 'Cloud Innovation Center - Lab 402',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '09:30 AM',
    end_time: '02:30 PM',
    day_number: 2,
    min_team_size: 1,
    max_team_size: 2,
    capacity: 100,
    enrolled: 62,
    fee: 0,
    prize_pool: '₹75,000',
    eligibility: 'Open to all college students. Cloud credits provided free of cost.',
    rules: [
      'Cloud sandboxes will be provisioned on event day.',
      'Solutions must adhere to Well-Architected Framework: Security, Reliability, Cost, and Performance.'
    ],
    rounds: [
      { name: 'Phase 1: Architecture Blueprinting', description: 'Produce C4 model and infrastructure-as-code specification', date: 'Oct 12, 09:30 AM' },
      { name: 'Phase 2: Chaos Testing & Deployment', description: 'Simulate high load spikes and failover scenarios live', date: 'Oct 12, 12:00 PM' }
    ],
    coordinators: [
      { name: 'Meera Namboodiri', role: 'Cloud Lead', phone: '+91 98765 11011', email: 'agentblazer@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-07',
    club_id: 'club-9',
    created_by: 'usr-admin-avinya',
    name: 'Shark Tank Parinaam: Seed Venture Pitch',
    event_code: 'MGMT-PITCH-07',
    tagline: 'Pitch Your Startup. Win Angel Grants & Mentorship.',
    short_description: 'The marquee startup pitch contest connecting promising student founders with seasoned venture capitalists.',
    full_description: 'Avinya presents Shark Tank Parinaam! Student entrepreneurs with high-potential tech, deeptech, healthtech, and consumer ideas will pitch live before a panel of prominent venture capitalists, angel investors, and startup mentors.',
    category: 'Management',
    tags: ['startup', 'entrepreneurship', 'pitch', 'funding', 'business'],
    venue: 'Executive Auditorium 2',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '10:00 AM',
    end_time: '04:00 PM',
    day_number: 2,
    min_team_size: 1,
    max_team_size: 4,
    capacity: 40,
    enrolled: 28,
    fee: 250,
    prize_pool: '₹1,00,000',
    eligibility: 'Student startups, early prototypes, and innovative product concepts.',
    rules: [
      '5-minute pitch deck presentation followed by 5 minutes of rigorous Q&A with the investors.',
      'Submissions must include market sizing, unit economics, tech stack defensibility, and traction metrics.'
    ],
    rounds: [
      { name: 'Closed-Door Pitch Screening', description: 'Review of financial viability and prototype demos', date: 'Oct 12, 10:00 AM' },
      { name: 'Live Shark Tank Spotlight', description: 'Stage presentation before VC judges and term sheet offers', date: 'Oct 12, 01:30 PM' }
    ],
    coordinators: [
      { name: 'Rohan Deshmukh', role: 'E-Cell President', phone: '+91 98765 11013', email: 'avinya@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-08',
    club_id: 'club-11',
    created_by: 'usr-admin-nrityasparsh',
    name: 'Nritya Sangram: Western & Folk Dance Clash',
    event_code: 'CULT-DANCE-08',
    tagline: 'Electrifying Choreography, Sync, and Stage Presence',
    short_description: 'High-energy dance showdown featuring hip-hop crews, contemporary duos, and vibrant Indian classical/folk teams.',
    full_description: 'Nrityasparsh hosts the premier dance battle of Parinaam 2026. Witness jaw-dropping synchronization, stunts, theatrical storytelling, and street-style 1v1 cyphers under stage lighting.',
    category: 'Cultural',
    tags: ['dance', 'choreography', 'hiphop', 'cultural', 'stage'],
    venue: 'Auditorium Main Stage',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '02:00 PM',
    end_time: '08:00 PM',
    day_number: 2,
    min_team_size: 4,
    max_team_size: 12,
    capacity: 30,
    enrolled: 22,
    fee: 350,
    prize_pool: '₹70,000',
    eligibility: 'Open to college dance teams and registered crews.',
    rules: [
      'Performance duration: 8 - 12 minutes per crew.',
      'Soundtracks must be submitted in MP3 format 3 hours before stage time.',
      'Props allowed upon prior safety check (no fire, liquids, or sharp metals).'
    ],
    rounds: [
      { name: 'Stage Rehearsal & Lighting Mark', description: 'Stage positioning and technical cue check', date: 'Oct 12, 11:00 AM' },
      { name: 'Grand Stage Showcase', description: 'Final adjudicated crew choreography battle', date: 'Oct 12, 02:00 PM' }
    ],
    coordinators: [
      { name: 'Pooja Hegde', role: 'Dance Lead', phone: '+91 98765 11015', email: 'nrityasparsh@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-09',
    club_id: 'club-12',
    created_by: 'usr-admin-drisya',
    name: 'Kala Drishti: 48-Hour Film Making Challenge',
    event_code: 'ARTS-FILM-09',
    tagline: 'Script, Shoot, Edit, and Screen in 48 Hours',
    short_description: 'Cinematic storytelling challenge where teams produce a compelling short film based on a surprise secret prop and theme.',
    full_description: 'Drisya invites filmmakers, cinematographers, and storytellers to test their creative instincts under tight deadlines. A secret prop, key dialogue, and genre constraint are revealed at kick-off.',
    category: 'Arts & Media',
    tags: ['film', 'cinema', 'video', 'editing', 'creativity'],
    venue: 'Media Studio & Campus Grounds',
    date_start: '2026-10-11',
    date_end: '2026-10-12',
    start_time: '09:00 AM',
    end_time: '09:00 AM (Oct 13)',
    day_number: 1,
    min_team_size: 2,
    max_team_size: 6,
    capacity: 50,
    enrolled: 19,
    fee: 300,
    prize_pool: '₹50,000',
    eligibility: 'Open to all aspiring filmmakers, editors, and scriptwriters.',
    rules: [
      'Total run-time of film: 3 to 7 minutes including titles and credits.',
      'Mandatory inclusion of the secret prop and dialogue announced at launch.',
      'All footage must be filmed during the 48-hour challenge window on campus grounds.'
    ],
    rounds: [
      { name: 'Theme & Secret Prop Reveal', description: 'Briefing, rule pack handoff, and timestamp token assignment', date: 'Oct 11, 09:00 AM' },
      { name: 'Final Premiere & Jury Screening', description: 'High-definition auditorium screening and director Q&A', date: 'Oct 12, 06:00 PM' }
    ],
    coordinators: [
      { name: 'Aditya Varma', role: 'Film Lead', phone: '+91 98765 11017', email: 'drisya@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-10',
    club_id: 'club-10',
    created_by: 'usr-admin-adivika',
    name: 'Natya Yatra: Street Play (Nukkad Natak) & Mime',
    event_code: 'CULT-DRAMA-10',
    tagline: 'Raw Voice, Powerful Rhythm, Social Awakening',
    short_description: 'Outdoor street theatre competition delivering thought-provoking social commentary through voice, beats, and expressions.',
    full_description: 'Experience the raw pulse of street theatre. Teams will gather at the Heritage Courtyard with dholaks, daflis, and resonating slogans to dramatize pressing modern socio-cultural themes.',
    category: 'Cultural',
    tags: ['theatre', 'drama', 'nukkad', 'streetplay', 'acting'],
    venue: 'Heritage Courtyard - Central Open Circle',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '02:30 PM',
    end_time: '06:30 PM',
    day_number: 1,
    min_team_size: 6,
    max_team_size: 15,
    capacity: 20,
    enrolled: 14,
    fee: 250,
    prize_pool: '₹40,000',
    eligibility: 'Open to collegiate street theatre and drama societies.',
    rules: [
      'Performance duration: 15 to 20 minutes.',
      'Acoustic instruments and live vocals only; no pre-recorded tracks or electronic amplification.',
      'Judged on script depth, voice projection, crowd engagement, and synchronization.'
    ],
    rounds: [
      { name: 'Nukkad Live Performance', description: 'Open-air courtyard performance evaluated by veteran theatre critics', date: 'Oct 11, 02:30 PM' }
    ],
    coordinators: [
      { name: 'Tarun Reddy', role: 'Theatre Lead', phone: '+91 98765 11019', email: 'adivika@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-11',
    club_id: 'club-6',
    created_by: 'usr-admin-saptaswara',
    name: 'Raga Symphony: Carnatic & Hindustani Fusion',
    event_code: 'CULT-RAGA-11',
    tagline: 'Tradition Meets Contemporary Resonance',
    short_description: 'Classical vocal and instrumental ensemble contest celebrating rich Indian ragas and experimental cross-genre fusion.',
    full_description: 'Saptaswara presents a prestigious platform for virtuoso instrumentalists and vocalists. Experience intricate swara kalpanas, jugalbandis, and soulful compositions evaluated by revered maestros.',
    category: 'Cultural',
    tags: ['classical', 'music', 'carnatic', 'hindustani', 'fusion'],
    venue: 'Saraswati Chamber - Music Wing',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '10:00 AM',
    end_time: '02:00 PM',
    day_number: 2,
    min_team_size: 1,
    max_team_size: 6,
    capacity: 35,
    enrolled: 16,
    fee: 200,
    prize_pool: '₹45,000',
    eligibility: 'Open to vocalists and acoustic instrumentalists across Indian and Western traditions.',
    rules: [
      'Performance duration: 10 - 15 minutes.',
      'Judging criteria: Shruti alignment, laya accuracy, raga bhava, and innovative improvisations.'
    ],
    rounds: [
      { name: 'Acoustic Jugalbandi', description: 'Solo or ensemble performance followed by impromptu raga elaboration', date: 'Oct 12, 10:00 AM' }
    ],
    coordinators: [
      { name: 'Gayatri Sundaram', role: 'Classical Music Head', phone: '+91 98765 11021', email: 'saptaswara@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-12',
    club_id: 'club-2',
    created_by: 'usr-admin-prachurya',
    name: 'Prachurya Quill: Parliamentary Debate & General Quiz',
    event_code: 'LIT-QUIZ-12',
    tagline: 'Wits, Rhetoric, and Intellectual Dominance',
    short_description: 'Dual-track intellectual tournament featuring British Parliamentary debate and a high-stakes mega general quiz.',
    full_description: 'Engage in fiercely contested arguments and mind-bending trivia rounds spanning science, pop culture, history, tech, and global politics under renowned quizmasters and adjudicators.',
    category: 'Quiz & Literary',
    tags: ['quiz', 'debate', 'literary', 'trivia', 'public-speaking'],
    venue: 'Seminar Hall Complex - Hall A',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '10:00 AM',
    end_time: '04:30 PM',
    day_number: 1,
    min_team_size: 1,
    max_team_size: 2,
    capacity: 80,
    enrolled: 42,
    fee: 150,
    prize_pool: '₹35,000',
    eligibility: 'Open to all quizzers, debaters, and thinkers.',
    rules: [
      'Debate format: 3v3 / 2v2 Parliamentary debate rounds with 15-minute prep.',
      'Quiz format: Written prelims followed by top 6 teams on-stage bounce-and-pounce finals.'
    ],
    rounds: [
      { name: 'Written Preliminary Round', description: '30 challenging audio-visual trivia questions', date: 'Oct 11, 10:00 AM' },
      { name: 'Stage Finals & BP Debate', description: 'Buzzer rounds, theme connections, and debate clash', date: 'Oct 11, 01:30 PM' }
    ],
    coordinators: [
      { name: 'Arjun Sen', role: 'Literary Secretary', phone: '+91 98765 11023', email: 'prachurya@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-13',
    club_id: 'club-1',
    created_by: 'usr-admin-chakravyuha',
    name: 'Valorant LAN Showdown: Tactical 5v5',
    event_code: 'GAME-VAL-13',
    tagline: 'Lock In. Plant the Spike. Claim the LAN Trophy.',
    short_description: 'Official 5v5 tactical shooter tournament played on 240Hz LAN esports stations with live cast commentary.',
    full_description: 'Enter the gaming arena for intense tactical warfare. Teams will battle through double-elimination brackets with tournament-grade displays, low latency gigabit networking, and live audience shoutcasting.',
    category: 'Gaming',
    tags: ['gaming', 'esports', 'valorant', 'lan', 'fps'],
    venue: 'Esports Gaming Arena - Room 301',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '10:00 AM',
    end_time: '06:30 PM',
    day_number: 2,
    min_team_size: 5,
    max_team_size: 5,
    capacity: 32,
    enrolled: 25,
    fee: 500,
    prize_pool: '₹50,000',
    eligibility: 'All collegiate 5-player teams. Players must bring personal peripherals (mouse, keyboard, headset).',
    rules: [
      'Tournament maps: Ascent, Bind, Haven, Lotus, Sunset.',
      'Single elimination until quarterfinals; Semi-finals and Grand Final are Best of 3.',
      'Strict anti-cheat protocols and referee supervision enforced.'
    ],
    rounds: [
      { name: 'Group Stage Qualifiers', description: 'Best of 1 round-robin matches across two groups', date: 'Oct 12, 10:00 AM' },
      { name: 'Main Stage Grand Finals', description: 'Best of 3 series streamed to the main campus display wall', date: 'Oct 12, 03:30 PM' }
    ],
    coordinators: [
      { name: 'Nikhil Varma', role: 'Esports Lead', phone: '+91 98765 11025', email: 'gaming@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-14',
    club_id: 'club-7',
    created_by: 'usr-admin-robotics',
    name: 'Drone Grand Prix: High-Speed FPV Sprint',
    event_code: 'ROBO-DRONE-14',
    tagline: 'Speed, Agility, and Acrobatic Navigation Through Neon Gates',
    short_description: 'First-person view (FPV) custom drone obstacle race navigating lighted hoops, chicanes, and dive gates.',
    full_description: 'Feel the adrenaline of acrobatic drone racing. Pilots wear immersive FPV goggles to maneuver quadcopters at blazing velocities through illuminated 3D neon obstacle courses set up inside an enclosed safety net.',
    category: 'Robotics',
    tags: ['drones', 'fpv', 'racing', 'aeromodelling', 'robotics'],
    venue: 'Outdoor Sports Pavilion - Net Enclosure',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '03:00 PM',
    end_time: '07:30 PM',
    day_number: 2,
    min_team_size: 1,
    max_team_size: 2,
    capacity: 40,
    enrolled: 18,
    fee: 300,
    prize_pool: '₹60,000',
    eligibility: 'Open to all certified FPV pilots with sub-250g or standard 5-inch racing quads.',
    rules: [
      'Drones must operate on 5.8GHz video transmission frequency bands assigned by marshals.',
      'Scoring based on fastest clean lap completion through all compulsory gate waypoints.',
      'Safety spotter required during all live flight attempts.'
    ],
    rounds: [
      { name: 'Time Trial Seeding', description: '3 solo laps through the neon ring course for bracket placement', date: 'Oct 12, 03:00 PM' },
      { name: '4-Drone Head-to-Head Heats', description: 'Simultaneous 4-quad bracket sprint under dusk illumination', date: 'Oct 12, 05:30 PM' }
    ],
    coordinators: [
      { name: 'Harish Chandra', role: 'Drone Track Lead', phone: '+91 98765 11027', email: 'drones@parinaamfest.org' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Global in-memory storage singleton
class MockDbEngine {
  users: MockUser[] = [...USERS_DATA];
  clubs: MockClub[] = [...CLUBS_DATA];
  events: MockEvent[] = [...EVENTS_DATA];
  registrations: any[] = [];
  attendance: any[] = [];
  payments: any[] = [];
  config: Record<string, string> = {
    platform_fee: '99',
    fest_name: 'PARINAAM 2026',
    fest_dates: 'October 11-12, 2026',
    registration_open: 'true',
    amrita_domain: 'av.students.amrita.edu',
  };

  private _filterEvents(qLower: string, params: any[] = []): MockEvent[] {
    let list = [...this.events];

    // Status filter
    if (qLower.includes('e.status =') || qLower.includes('status =')) {
      const statusParam = params.find(p => typeof p === 'string' && ['published', 'draft', 'archived'].includes(p.toLowerCase()));
      if (statusParam) {
        list = list.filter(e => e.status.toLowerCase() === statusParam.toLowerCase());
      } else {
        list = list.filter(e => e.status === 'published');
      }
    }

    // Club filter (by id or slug)
    if (qLower.includes('club_id =') || qLower.includes('e.club_id =')) {
      const clubIdParam = params.find(p => typeof p === 'string' && (this.clubs.some(c => c.id === p || c.slug === p) || p.startsWith('club-')));
      if (clubIdParam) {
        const targetClub = this.clubs.find(c => c.id === clubIdParam || c.slug === clubIdParam);
        const resolvedId = targetClub ? targetClub.id : clubIdParam;
        list = list.filter(e => e.club_id === resolvedId);
      }
    }

    // Category filter
    if (qLower.includes('category =') || qLower.includes('e.category =')) {
      const knownCats = ['technical', 'cultural', 'coding & hackathon', 'robotics', 'gaming', 'workshops', 'quiz & literary', 'arts & media', 'management'];
      const catParam = params.find(p => typeof p === 'string' && knownCats.includes(p.toLowerCase()));
      if (catParam) {
        list = list.filter(e => e.category.toLowerCase() === catParam.toLowerCase());
      }
    }

    // Search filter (ILIKE)
    if (qLower.includes('ilike')) {
      const searchParam = params.find(p => typeof p === 'string' && p.startsWith('%') && p.endsWith('%'));
      if (searchParam) {
        const cleanTerm = searchParam.replace(/%/g, '').toLowerCase().trim();
        if (cleanTerm) {
          list = list.filter(e => 
            (e.name || '').toLowerCase().includes(cleanTerm) ||
            (e.tagline || '').toLowerCase().includes(cleanTerm) ||
            (e.short_description || '').toLowerCase().includes(cleanTerm) ||
            (e.event_code || '').toLowerCase().includes(cleanTerm)
          );
        }
      }
    }

    return list;
  }

  async executeQuery(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    const q = text.trim();
    const qLower = q.toLowerCase();

    // 1. SELECT user by email
    if (qLower.includes('from users') && (qLower.includes('email =') || qLower.includes('email='))) {
      const email = params[0]?.toString().toLowerCase().trim();
      const user = this.users.find(u => u.email.toLowerCase() === email);
      if (!user) return { rows: [], rowCount: 0 };
      const club = this.clubs.find(c => c.id === user.club_id);
      const row = {
        ...user,
        club_name: club?.name || null,
        club_slug: club?.slug || null,
      };
      return { rows: [row], rowCount: 1 };
    }

    // 2. SELECT user by id
    if (qLower.includes('from users') && (qLower.includes('id = $') || qLower.includes('id=$') || qLower.includes('where id =') || qLower.includes('where u.id ='))) {
      const id = params[0]?.toString();
      const user = this.users.find(u => u.id === id);
      if (!user) return { rows: [], rowCount: 0 };
      const club = this.clubs.find(c => c.id === user.club_id);
      const row = {
        ...user,
        club_name: club?.name || null,
        club_slug: club?.slug || null,
      };
      return { rows: [row], rowCount: 1 };
    }

    // 3. SELECT user by qr_token
    if (qLower.includes('from users where qr_token =')) {
      const token = params[0]?.toString();
      const user = this.users.find(u => u.qr_token === token);
      const rows = user ? [{ ...user }] : [];
      return { rows, rowCount: rows.length };
    }

    // 4. INSERT into users
    if (qLower.startsWith('insert into users')) {
      const [
        email, passwordHash, full_name, phone,
        college_name, is_amrita_student, roll_number, department,
        year_of_study, city, verification_status, qr_token,
        email_verify_token, email_verified
      ] = params;

      const newUser: MockUser = {
        id: uuidv4(),
        email: email?.toString().toLowerCase().trim(),
        password_hash: passwordHash,
        full_name,
        phone: phone || null,
        role: 'student',
        club_id: null,
        college_name: college_name || (is_amrita_student ? 'Amrita Vishwa Vidyapeetham' : null),
        is_amrita_student: Boolean(is_amrita_student),
        roll_number: roll_number || null,
        department: department || null,
        year_of_study: year_of_study || null,
        city: city || null,
        verification_status: verification_status || (is_amrita_student ? 'verified' : 'pending'),
        platform_fee_paid: Boolean(is_amrita_student),
        qr_token: qr_token || uuidv4().replace(/-/g, ''),
        pass_type: 'DELEGATE PASS',
        email_verified: Boolean(email_verified),
        email_verify_token: email_verify_token || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.users.push(newUser);
      return {
        rows: [{
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          is_amrita_student: newUser.is_amrita_student,
          verification_status: newUser.verification_status,
          qr_token: newUser.qr_token,
          platform_fee_paid: newUser.platform_fee_paid,
        }],
        rowCount: 1,
      };
    }

    // 5. SELECT clubs
    if (qLower.includes('from clubs') && !qLower.includes('where id =')) {
      const rows = this.clubs.map(c => {
        const clubEvents = this.events.filter(e => e.club_id === c.id);
        return {
          ...c,
          event_count: clubEvents.length.toString(),
          total_enrolled: clubEvents.reduce((acc, e) => acc + (e.enrolled || 0), 0).toString(),
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 6. SELECT single club
    if (qLower.includes('from clubs where id =') || qLower.includes('select slug from clubs where id =')) {
      const clubId = params[0];
      const club = this.clubs.find(c => c.id === clubId);
      const rows = club ? [{ ...club }] : [];
      return { rows, rowCount: rows.length };
    }

    // 7. SELECT events with club join
    if (qLower.includes('from events e') || (qLower.includes('from events') && !qLower.includes('update events'))) {
      if (qLower.includes('where e.id =') || qLower.includes('where id =')) {
        const eventId = params[0];
        const event = this.events.find(e => e.id === eventId);
        if (!event) return { rows: [], rowCount: 0 };
        const club = this.clubs.find(c => c.id === event.club_id);
        const row = {
          ...event,
          club_name: club?.name || 'Club',
          club_slug: club?.slug || 'club',
          club_color: club?.color || '#6366f1',
          creator_name: 'Club Coordinator',
        };
        return { rows: [row], rowCount: 1 };
      }

      // Dynamically filter events
      let filtered = this._filterEvents(qLower, params);

      // Sort: is_featured desc, is_popular desc
      filtered.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        if (a.is_popular !== b.is_popular) return a.is_popular ? -1 : 1;
        return 0;
      });

      // Pagination
      if (qLower.includes('limit') && qLower.includes('offset')) {
        const numParams = params.filter(p => typeof p === 'number');
        if (numParams.length >= 2) {
          const limit = numParams[numParams.length - 2];
          const offset = numParams[numParams.length - 1];
          filtered = filtered.slice(offset, offset + limit);
        }
      }

      const rows = filtered.map(e => {
        const club = this.clubs.find(c => c.id === e.club_id);
        return {
          ...e,
          club_name: club?.name || 'Club',
          club_slug: club?.slug || 'club',
          club_color: club?.color || '#6366f1',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 8. INSERT event
    if (qLower.startsWith('insert into events')) {
      const [
        club_id, created_by, name, event_code, tagline,
        short_description, full_description, category, tags,
        venue, date_start, date_end, start_time, end_time,
        day_number, min_team_size, max_team_size, capacity,
        fee, prize_pool, eligibility, rules, rounds,
        coordinators, poster_url, rulebook_url, status,
        registration_open, is_popular, is_featured
      ] = params;

      const newEvent: MockEvent = {
        id: `evt-${uuidv4().slice(0, 8)}`,
        club_id,
        created_by,
        name,
        event_code: event_code || `EVT-${Date.now()}`,
        tagline: tagline || '',
        short_description: short_description || '',
        full_description: full_description || '',
        category: category || 'General',
        tags: tags || [],
        venue: venue || 'Campus Venue',
        date_start: date_start || '2026-10-11',
        date_end: date_end || '2026-10-12',
        start_time: start_time || '10:00:00',
        end_time: end_time || '17:00:00',
        day_number: day_number || 1,
        min_team_size: min_team_size || 1,
        max_team_size: max_team_size || 1,
        capacity: capacity || 100,
        enrolled: 0,
        fee: fee || 0,
        prize_pool: prize_pool || '',
        eligibility: eligibility || '',
        rules: rules ? JSON.parse(rules) : [],
        rounds: rounds ? JSON.parse(rounds) : [],
        coordinators: coordinators ? JSON.parse(coordinators) : [],
        poster_url: poster_url || '',
        rulebook_url: rulebook_url || '',
        status: status || 'published',
        registration_open: registration_open !== false,
        is_popular: Boolean(is_popular),
        is_featured: Boolean(is_featured),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.events.unshift(newEvent);
      return { rows: [newEvent], rowCount: 1 };
    }

    // 9. PLATFORM CONFIG
    if (qLower.includes('from platform_config')) {
      const rows = Object.entries(this.config).map(([key, value]) => ({
        key,
        value,
        description: `${key} setting`,
      }));
      return { rows, rowCount: rows.length };
    }

    // 10. ADMIN STATS & PAYMENTS
    if (qLower.includes('sum(amount_paise)') || qLower.includes('from payments')) {
      const totalPaise = this.payments.reduce((acc, p) => acc + (p.status === 'captured' ? p.amount_paise : 0), 0);
      return { rows: [{ total: totalPaise.toString() }], rowCount: 1 };
    }

    // 10b. ADMIN USER STATS
    if (qLower.includes('amrita_count') || qLower.includes('external_count')) {
      const students = this.users.filter(u => u.role === 'student');
      const amrita = students.filter(u => u.is_amrita_student).length;
      const external = students.filter(u => !u.is_amrita_student).length;
      const pending = students.filter(u => u.verification_status === 'pending').length;
      const verified = students.filter(u => u.verification_status === 'verified').length;
      return {
        rows: [{
          total: students.length.toString(),
          amrita_count: amrita.toString(),
          external_count: external.toString(),
          pending_count: pending.toString(),
          verified_count: verified.toString(),
        }],
        rowCount: 1,
      };
    }

    if (qLower.includes('count(*)') || qLower.includes('count(u.id)')) {
      if (qLower.includes('from users')) {
        const count = qLower.includes("role = 'student'")
          ? this.users.filter(u => u.role === 'student').length
          : qLower.includes("verification_status = 'pending'")
          ? this.users.filter(u => u.verification_status === 'pending').length
          : this.users.length;
        return { rows: [{ count: count.toString() }], rowCount: 1 };
      }
      if (qLower.includes('from events')) {
        const count = this._filterEvents(qLower, params).length;
        return { rows: [{ count: count.toString() }], rowCount: 1 };
      }
      if (qLower.includes('from registrations')) {
        const count = qLower.includes("status = 'confirmed'")
          ? this.registrations.filter(r => r.status === 'CONFIRMED').length
          : this.registrations.length;
        return { rows: [{ count: count.toString() }], rowCount: 1 };
      }
      return { rows: [{ count: '0' }], rowCount: 1 };
    }

    // 11. RECENT REGISTRATIONS JOIN
    if (qLower.includes('from registrations r') && qLower.includes('join users u')) {
      const rows = this.registrations.map(r => {
        const user = this.users.find(u => u.id === r.user_id);
        const event = this.events.find(e => e.id === r.event_id);
        const club = event ? this.clubs.find(c => c.id === event.club_id) : undefined;
        return {
          id: r.id,
          registered_at: r.registered_at,
          status: r.status,
          full_name: user?.full_name || user?.email || 'Student',
          college_name: user?.college_name || 'Amrita Vishwa Vidyapeetham',
          event_name: event?.name || 'Festival Event',
          club_name: club?.name || 'Club',
        };
      });
      return { rows: rows.slice(0, 10), rowCount: Math.min(rows.length, 10) };
    }

    // 12. CLUB STATS JOIN
    if (qLower.includes('from clubs c') && qLower.includes('left join events e')) {
      const rows = this.clubs.map(c => {
        const clubEvents = this.events.filter(e => e.club_id === c.id);
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          color: c.color,
          total_events: clubEvents.length.toString(),
          published_events: clubEvents.filter(e => e.status === 'published').length.toString(),
          total_registrations: '0',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 13. ADMIN USERS LIST
    if (qLower.includes('from users u left join clubs c') || qLower.includes('from users u')) {
      let filtered = [...this.users];
      const rows = filtered.map(u => {
        const club = this.clubs.find(c => c.id === u.club_id);
        return {
          id: u.id,
          full_name: u.full_name,
          email: u.email,
          phone: u.phone || '',
          role: u.role,
          college_name: u.college_name || (u.is_amrita_student ? 'Amrita Vishwa Vidyapeetham, Amaravati' : 'External College'),
          is_amrita_student: u.is_amrita_student,
          roll_number: u.roll_number || '',
          department: u.department || '',
          year_of_study: u.year_of_study || '',
          city: u.city || '',
          verification_status: u.verification_status,
          verification_note: u.verification_note || '',
          platform_fee_paid: u.platform_fee_paid,
          id_card_url: u.id_card_url || '',
          created_at: u.created_at || new Date().toISOString(),
          club_name: club?.name || null,
          confirmed_registrations: '0',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 14. DELETE FROM USERS
    if (qLower.startsWith('delete from users')) {
      const id = params[0]?.toString();
      const idx = this.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        this.users.splice(idx, 1);
        this.registrations = this.registrations.filter(r => r.user_id !== id);
        this.attendance = this.attendance.filter(a => a.user_id !== id);
        this.payments = this.payments.filter(p => p.user_id !== id);
        return { rows: [], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 15. DELETE FROM OTHER TABLES
    if (qLower.startsWith('delete from registrations')) {
      const id = params[0]?.toString();
      this.registrations = this.registrations.filter(r => r.user_id !== id && r.id !== id);
      return { rows: [], rowCount: 1 };
    }
    if (qLower.startsWith('delete from attendance')) {
      const id = params[0]?.toString();
      this.attendance = this.attendance.filter(a => a.user_id !== id && a.id !== id);
      return { rows: [], rowCount: 1 };
    }
    if (qLower.startsWith('delete from payments')) {
      const id = params[0]?.toString();
      this.payments = this.payments.filter(p => p.user_id !== id && p.id !== id);
      return { rows: [], rowCount: 1 };
    }

    // 16. UPDATE USERS
    if (qLower.startsWith('update users set') || qLower.startsWith('update users')) {
      const target = this.users.find(u => u.id === params[params.length - 1] || u.id === params[0]);
      if (target) {
        if (qLower.includes('verification_status =')) {
          target.verification_status = params[0] || target.verification_status;
          target.verification_note = params[1] || '';
          if (params[0] === 'verified') target.platform_fee_paid = true;
        }
        return { rows: [target], rowCount: 1 };
      }
    }

    // 17. INSERT INTO REGISTRATIONS
    if (qLower.startsWith('insert into registrations')) {
      const newReg = {
        id: `reg-${uuidv4().slice(0, 8)}`,
        user_id: params[0],
        event_id: params[1],
        team_name: params[2] || null,
        team_members: params[3] || '[]',
        amount_paid: params[4] || 0,
        status: params[5] || 'PENDING',
        payment_status: params[6] || 'pending',
        payment_id: params[7] || null,
        registered_at: new Date().toISOString(),
        confirmed_at: params[5] === 'CONFIRMED' ? new Date().toISOString() : null,
      };
      this.registrations.push(newReg);
      return { rows: [newReg], rowCount: 1 };
    }

    // 18. INSERT INTO PAYMENTS
    if (qLower.startsWith('insert into payments')) {
      const newPay = {
        id: `pay-${uuidv4().slice(0, 8)}`,
        user_id: params[0],
        type: params[1],
        event_id: params[2] || null,
        registration_id: params[3] || null,
        amount: params[4] || 0,
        razorpay_order_id: params[5] || `order_${Date.now()}`,
        status: params[6] || 'created',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.payments.push(newPay);
      return { rows: [newPay], rowCount: 1 };
    }

    // 19. SELECT FROM REGISTRATIONS
    if (qLower.includes('from registrations')) {
      let result = [...this.registrations];
      if (qLower.includes('user_id =') && qLower.includes('event_id =')) {
        result = result.filter(r => r.user_id === params[0] && r.event_id === params[1]);
      } else if (qLower.includes('payment_id =')) {
        result = result.filter(r => r.payment_id === params[0] || r.payment_id === params[1]);
      } else if (qLower.includes('user_id =')) {
        result = result.filter(r => r.user_id === params[0]);
      }
      return { rows: result, rowCount: result.length };
    }

    // 20. SELECT FROM PAYMENTS
    if (qLower.includes('from payments')) {
      let result = [...this.payments];
      if (qLower.includes('razorpay_order_id =')) {
        result = result.filter(p => p.razorpay_order_id === params[0] || p.razorpay_order_id === params[1]);
      } else if (qLower.includes('id =')) {
        result = result.filter(p => p.id === params[0]);
      } else if (qLower.includes('user_id =')) {
        result = result.filter(p => p.user_id === params[0]);
      }
      return { rows: result, rowCount: result.length };
    }

    // 21. UPDATE REGISTRATIONS
    if (qLower.startsWith('update registrations')) {
      const paymentId = params.find(p => typeof p === 'string' && (p.startsWith('pay-') || p.startsWith('order_')));
      const userId = params.find(p => typeof p === 'string' && (p.startsWith('usr-') || p.startsWith('part-')));
      let updatedCount = 0;
      this.registrations.forEach(r => {
        if ((paymentId && r.payment_id === paymentId) || (userId && r.user_id === userId)) {
          if (qLower.includes("status = 'confirmed'") || qLower.includes("status = 'CONFIRMED'")) {
            r.status = 'CONFIRMED';
            r.payment_status = 'paid';
            r.confirmed_at = new Date().toISOString();
          } else if (qLower.includes("status = 'cancelled'") || qLower.includes("status = 'CANCELLED'")) {
            r.status = 'CANCELLED';
            r.payment_status = 'refunded';
          }
          updatedCount++;
        }
      });
      return { rows: [], rowCount: updatedCount || 1 };
    }

    // 22. UPDATE PAYMENTS
    if (qLower.startsWith('update payments')) {
      const payId = params[params.length - 1] || params[0];
      const payment = this.payments.find(p => p.id === payId || p.razorpay_order_id === payId);
      if (payment) {
        if (qLower.includes("status = 'paid'")) payment.status = 'paid';
        if (qLower.includes("status = 'failed'")) payment.status = 'failed';
        if (qLower.includes("status = 'refunded'")) payment.status = 'refunded';
        if (params[0] && typeof params[0] === 'string' && params[0].startsWith('pay_')) {
          payment.razorpay_payment_id = params[0];
        }
        return { rows: [payment], rowCount: 1 };
      }
    }

    // 23. UPDATE EVENTS ENROLLED
    if (qLower.startsWith('update events set enrolled')) {
      const evtId = params[params.length - 1] || params[0];
      const event = this.events.find(e => e.id === evtId);
      if (event) {
        event.enrolled = (event.enrolled || 0) + 1;
        return { rows: [event], rowCount: 1 };
      }
    }

    // Generic fallback for updates & deletes
    return { rows: [], rowCount: 0 };
  }
}

// Global variable ensures single instance across Next.js reloads
declare global {
  var __parinaam_mock_db: MockDbEngine | undefined;
}

export const mockDb = global.__parinaam_mock_db || new MockDbEngine();
if (process.env.NODE_ENV !== 'production') {
  global.__parinaam_mock_db = mockDb;
}
