import { FestEvent } from '../types';

export const MOCK_EVENTS: FestEvent[] = [
  // 1. Code Red: The Hackathon Murder Mystery (Chakravyuha)
  {
    id: 'evt-01',
    eventCode: 'TECH-RED-01',
    name: 'Code Red: The Hackathon Murder Mystery',
    category: 'Coding & Hackathon',
    tagline: 'Crack the Code. Analyze Forensics. Solve the Mystery.',
    shortDescription: 'A 24-hour hackathon-style event combining coding, cyber forensics, and an immersive murder-mystery investigation.',
    fullDescription: 'Code Red is an exhilarating hackathon murder mystery where participants act as elite digital forensic sleuths. You will analyze suspicious code repositories, decode cryptographic ciphers, query compromised server logs, and engineer automation scripts to uncover clues and unmask the digital culprit before the clock runs out.',
    venue: 'Innovation Complex - Forensic Cyber Lab',
    date: 'Oct 11, 2026',
    startTime: '10:00 AM',
    endTime: '05:30 PM',
    day: 1,
    teamSize: '2 - 4 Members',
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: 300,
    prizePool: '₹1,50,000',
    eligibility: 'Open to all undergraduate and postgraduate college students with valid student ID.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Teams must solve narrative-driven coding challenges to unlock each sequential forensic clue.',
      'Programming languages permitted: Python, C++, Go, JavaScript, and Bash.',
      'Forensic log analysis, payload decryption, and algorithm design will be evaluated on speed and accuracy.',
      'External assistance or sharing clue solutions between teams results in immediate disqualification.'
    ],
    coordinators: [
      { name: 'Kavya Raman', role: 'Event Lead', phone: '+91 98765 11001', email: 'codered@parinaamfest.org' },
      { name: 'Dr. Suresh V', role: 'Faculty Mentor', phone: '+91 94433 11002' }
    ]
  },

  // 2. AgentForge – AI Agents Building Challenge (ReLU)
  {
    id: 'evt-02',
    eventCode: 'AI-AGENT-02',
    name: 'AgentForge – Autonomous AI Agents Challenge',
    category: 'Technical',
    tagline: 'Architect Autonomous Intelligence & Multi-Agent Swarms',
    shortDescription: 'Build practical multi-agent AI solutions using LangChain, CrewAI, AutoGen, and LLM reasoning pipelines.',
    fullDescription: 'AgentForge challenges developers to architect autonomous AI agents capable of high-level reasoning, web browsing, self-reflection, and tool invocation. Teams will tackle real-world enterprise automation scenarios using modern LLM APIs and open-weight models.',
    venue: 'Computing Hub - AI Intelligence Lab',
    date: 'Oct 11, 2026',
    startTime: '11:00 AM',
    endTime: '05:00 PM',
    day: 1,
    teamSize: '1 - 3 Members',
    minTeamSize: 1,
    maxTeamSize: 3,
    fee: 250,
    prizePool: '₹1,20,000',
    eligibility: 'Open to developers passionate about generative AI, autonomous agents, and systems programming.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Agents must perform end-to-end task execution autonomously with human-in-the-loop fallback.',
      'Evaluated on tool reliability, latency, multi-agent communication harmony, and task success rate.',
      'Open-source and closed API models (Claude, Gemini, OpenAI, Ollama) are permitted.'
    ],
    coordinators: [
      { name: 'Ananya Sharma', role: 'AI Track Head', phone: '+91 98765 11003', email: 'relu.ai@parinaamfest.org' },
      { name: 'Prof. Ramesh K', role: 'Faculty Advisor', phone: '+91 94433 11004' }
    ]
  },

  // 3. RoboWars: Steel Carnage (Robotics Club)
  {
    id: 'evt-03',
    eventCode: 'ROBO-WARS-03',
    name: 'RoboWars: Steel Carnage',
    category: 'Robotics',
    tagline: 'Full Metal Combat. 15kg & 30kg Bot Deathmatch.',
    shortDescription: 'High-octane combat robotics in an armored bulletproof polycarbonate arena with spinners, flippers, and hammers.',
    fullDescription: 'Enter the steel arena where battle-hardened robotic weapons clash at violent RPMs. Custom-engineered 15kg and 30kg combat robots will duel across knockout brackets in front of thousands of roaring spectators.',
    venue: 'Central Arena - Armored Hexagonal Ring',
    date: 'Oct 12, 2026',
    startTime: '01:00 PM',
    endTime: '07:00 PM',
    day: 2,
    teamSize: '2 - 5 Members',
    minTeamSize: 2,
    maxTeamSize: 5,
    fee: 500,
    prizePool: '₹1,00,000',
    eligibility: 'All collegiate robotics teams with combat-ready radio-controlled robots complying with safety guidelines.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Weight categories strictly enforced: 15kg Featherweight and 30kg Middleweight.',
      'Active weapon mandatory (drum spinner, horizontal bar, pneumatic flipper, or crusher).',
      'Failsafe RF radio control verification required during safety inspection before match entry.'
    ],
    coordinators: [
      { name: 'Vikramaditya Rao', role: 'Robotics Lead', phone: '+91 98765 11005', email: 'robotics@parinaamfest.org' },
      { name: 'Dr. Anand Kumar', role: 'Faculty Mentor', phone: '+91 94433 11006' }
    ]
  },

  // 4. Battle of the Bands: Sound Clash (Avisruta)
  {
    id: 'evt-04',
    eventCode: 'CULT-BAND-04',
    name: 'Battle of the Bands: Sound Clash',
    category: 'Cultural',
    tagline: 'Turn Up the Amps. Rock the Open Amphitheatre.',
    shortDescription: 'Collegiate rock, metal, indie, and fusion bands battle it out on the festival grand concert stage.',
    fullDescription: 'The ultimate rock battle of Southern India techfests. Avisruta hosts top student musical bands for an electric evening of roaring guitar solos, explosive drum breaks, and vocal showmanship evaluated by industry musicians.',
    venue: 'Main Open Air Amphitheatre',
    date: 'Oct 11, 2026',
    startTime: '06:00 PM',
    endTime: '10:00 PM',
    day: 1,
    teamSize: '3 - 8 Members',
    minTeamSize: 3,
    maxTeamSize: 8,
    fee: 400,
    prizePool: '₹80,000',
    eligibility: 'Open to college musical bands. At least 3 live instruments required.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Each band is allocated 20 minutes (15 mins performance + 5 mins sound check).',
      'At least one original composition or creative adaptation strongly recommended.',
      'Standard drum kit, bass amp, and PA provided; bands bring their own guitars, pedals, and brass.'
    ],
    coordinators: [
      { name: 'Karthik Nambiar', role: 'Music Coordinator', phone: '+91 98765 11007', email: 'avisruta@parinaamfest.org' }
    ]
  },

  // 5. Circuit Master: Silicon Hack (IEEE)
  {
    id: 'evt-05',
    eventCode: 'TECH-CIRC-05',
    name: 'Circuit Master: Silicon & FPGA Hack',
    category: 'Technical',
    tagline: 'Design, Debug, and Deploy on Real Silicon',
    shortDescription: 'Hardware breadboard debugging, Verilog/VHDL FPGA synthesis, and PCB routing speed trials.',
    fullDescription: 'Test your fundamental electrical and computer engineering skills. Contestants receive complex malfunctioning schematic layouts, breadboard modules, and FPGA development boards to troubleshoot glitching clock signals and logic hazards.',
    venue: 'VLSI & Embedded Systems Laboratory',
    date: 'Oct 11, 2026',
    startTime: '10:30 AM',
    endTime: '03:30 PM',
    day: 1,
    teamSize: '1 - 3 Members',
    minTeamSize: 1,
    maxTeamSize: 3,
    fee: 200,
    prizePool: '₹60,000',
    eligibility: 'Open to ECE, EEE, CSE, and all engineering students.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Round 1: Rapid hardware bug isolation on oscilloscope and logic analyzer.',
      'Round 2: FPGA implementation of high-throughput state machine and signal filter.'
    ],
    coordinators: [
      { name: 'Siddharth Iyer', role: 'IEEE Student Chair', phone: '+91 98765 11009', email: 'ieee@parinaamfest.org' }
    ]
  },

  // 6. Cloud Architect Sprint (Salesforce AgentBlazer)
  {
    id: 'evt-06',
    eventCode: 'TECH-CLOUD-06',
    name: 'Cloud Architect Sprint: Enterprise Scale',
    category: 'Workshops',
    tagline: 'Modern Cloud Native Architecture & Microservices at Scale',
    shortDescription: 'Hands-on enterprise cloud challenge building resilient serverless architectures, event pipelines, and CRM bots.',
    fullDescription: 'Sponsored by Salesforce AgentBlazer. Participants will engineer zero-downtime microservices on cloud infrastructure, build event-driven data integrations, and automate customer lifecycle workflows.',
    venue: 'Cloud Innovation Center - Lab 402',
    date: 'Oct 12, 2026',
    startTime: '09:30 AM',
    endTime: '02:30 PM',
    day: 2,
    teamSize: '1 - 2 Members',
    minTeamSize: 1,
    maxTeamSize: 2,
    fee: 0,
    prizePool: '₹75,000',
    eligibility: 'Open to all college students. Cloud credits provided free of cost.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Cloud sandboxes will be provisioned on event day.',
      'Solutions must adhere to Well-Architected Framework: Security, Reliability, Cost, and Performance.'
    ],
    coordinators: [
      { name: 'Meera Namboodiri', role: 'Cloud Lead', phone: '+91 98765 11011', email: 'agentblazer@parinaamfest.org' }
    ]
  },

  // 7. Shark Tank Parinaam: Venture Pitch (Avinya)
  {
    id: 'evt-07',
    eventCode: 'MGMT-PITCH-07',
    name: 'Shark Tank Parinaam: Seed Venture Pitch',
    category: 'Management',
    tagline: 'Pitch Your Startup. Win Angel Grants & Mentorship.',
    shortDescription: 'The marquee startup pitch contest connecting promising student founders with seasoned venture capitalists.',
    fullDescription: 'Avinya presents Shark Tank Parinaam! Student entrepreneurs with high-potential tech, deeptech, healthtech, and consumer ideas will pitch live before a panel of prominent venture capitalists, angel investors, and startup mentors.',
    venue: 'Executive Auditorium 2',
    date: 'Oct 12, 2026',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    day: 2,
    teamSize: '1 - 4 Members',
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 250,
    prizePool: '₹1,00,000',
    eligibility: 'Student startups, early prototypes, and innovative product concepts.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    rules: [
      '5-minute pitch deck presentation followed by 5 minutes of rigorous Q&A with the investors.',
      'Submissions must include market sizing, unit economics, tech stack defensibility, and traction metrics.'
    ],
    coordinators: [
      { name: 'Rohan Deshmukh', role: 'E-Cell President', phone: '+91 98765 11013', email: 'avinya@parinaamfest.org' }
    ]
  },

  // 8. Nritya Sangram: National Dance Championship (Nrityasparsh)
  {
    id: 'evt-08',
    eventCode: 'CULT-DANCE-08',
    name: 'Nritya Sangram: Western & Folk Dance Clash',
    category: 'Cultural',
    tagline: 'Electrifying Choreography, Sync, and Stage Presence',
    shortDescription: 'High-energy dance showdown featuring hip-hop crews, contemporary duos, and vibrant Indian classical/folk teams.',
    fullDescription: 'Nrityasparsh hosts the premier dance battle of Parinaam 2026. Witness jaw-dropping synchronization, stunts, theatrical storytelling, and street-style 1v1 cyphers under stage lighting.',
    venue: 'Auditorium Main Stage',
    date: 'Oct 12, 2026',
    startTime: '02:00 PM',
    endTime: '08:00 PM',
    day: 2,
    teamSize: '4 - 12 Members',
    minTeamSize: 4,
    maxTeamSize: 12,
    fee: 350,
    prizePool: '₹70,000',
    eligibility: 'Open to college dance teams and registered crews.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Performance duration: 8 - 12 minutes per crew.',
      'Soundtracks must be submitted in MP3 format 3 hours before stage time.',
      'Props allowed upon prior safety check (no fire, liquids, or sharp metals).'
    ],
    coordinators: [
      { name: 'Pooja Hegde', role: 'Dance Lead', phone: '+91 98765 11015', email: 'nrityasparsh@parinaamfest.org' }
    ]
  },

  // 9. Kala Drishti: 48-Hour Film Making (Drisya)
  {
    id: 'evt-09',
    eventCode: 'ARTS-FILM-09',
    name: 'Kala Drishti: 48-Hour Film Making Challenge',
    category: 'Arts & Media',
    tagline: 'Script, Shoot, Edit, and Screen in 48 Hours',
    shortDescription: 'Cinematic storytelling challenge where teams produce a compelling short film based on a surprise secret prop and theme.',
    fullDescription: 'Drisya invites filmmakers, cinematographers, and storytellers to test their creative instincts under tight deadlines. A secret prop, key dialogue, and genre constraint are revealed at kick-off.',
    venue: 'Media Studio & Campus Grounds',
    date: 'Oct 11, 2026',
    startTime: '09:00 AM',
    endTime: '09:00 AM (Oct 13)',
    day: 1,
    teamSize: '2 - 6 Members',
    minTeamSize: 2,
    maxTeamSize: 6,
    fee: 300,
    prizePool: '₹50,000',
    eligibility: 'Open to all aspiring filmmakers, editors, and scriptwriters.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Total run-time of film: 3 to 7 minutes including titles and credits.',
      'Mandatory inclusion of the secret prop and dialogue announced at launch.',
      'All footage must be filmed during the 48-hour challenge window on campus grounds.'
    ],
    coordinators: [
      { name: 'Aditya Varma', role: 'Film Lead', phone: '+91 98765 11017', email: 'drisya@parinaamfest.org' }
    ]
  },

  // 10. Natya Yatra: Street Play & Mime (Adivika)
  {
    id: 'evt-10',
    eventCode: 'CULT-DRAMA-10',
    name: 'Natya Yatra: Street Play (Nukkad Natak) & Mime',
    category: 'Cultural',
    tagline: 'Raw Voice, Powerful Rhythm, Social Awakening',
    shortDescription: 'Outdoor street theatre competition delivering thought-provoking social commentary through voice, beats, and expressions.',
    fullDescription: 'Experience the raw pulse of street theatre. Teams will gather at the Heritage Courtyard with dholaks, daflis, and resonating slogans to dramatize pressing modern socio-cultural themes.',
    venue: 'Heritage Courtyard - Central Open Circle',
    date: 'Oct 11, 2026',
    startTime: '02:30 PM',
    endTime: '06:30 PM',
    day: 1,
    teamSize: '6 - 15 Members',
    minTeamSize: 6,
    maxTeamSize: 15,
    fee: 250,
    prizePool: '₹40,000',
    eligibility: 'Open to collegiate street theatre and drama societies.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Performance duration: 15 to 20 minutes.',
      'Acoustic instruments and live vocals only; no pre-recorded tracks or electronic amplification.',
      'Judged on script depth, voice projection, crowd engagement, and synchronization.'
    ],
    coordinators: [
      { name: 'Tarun Reddy', role: 'Theatre Lead', phone: '+91 98765 11019', email: 'adivika@parinaamfest.org' }
    ]
  },

  // 11. Raga Symphony: Classical Fusion (Saptaswara)
  {
    id: 'evt-11',
    eventCode: 'CULT-RAGA-11',
    name: 'Raga Symphony: Carnatic & Hindustani Fusion',
    category: 'Cultural',
    tagline: 'Tradition Meets Contemporary Resonance',
    shortDescription: 'Classical vocal and instrumental ensemble contest celebrating rich Indian ragas and experimental cross-genre fusion.',
    fullDescription: 'Saptaswara presents a prestigious platform for virtuoso instrumentalists and vocalists. Experience intricate swara kalpanas, jugalbandis, and soulful compositions evaluated by revered maestros.',
    venue: 'Saraswati Chamber - Music Wing',
    date: 'Oct 12, 2026',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    day: 2,
    teamSize: '1 - 6 Members',
    minTeamSize: 1,
    maxTeamSize: 6,
    fee: 200,
    prizePool: '₹45,000',
    eligibility: 'Open to vocalists and acoustic instrumentalists across Indian and Western traditions.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Performance duration: 10 - 15 minutes.',
      'Judging criteria: Shruti alignment, laya accuracy, raga bhava, and innovative improvisations.'
    ],
    coordinators: [
      { name: 'Gayatri Sundaram', role: 'Classical Music Head', phone: '+91 98765 11021', email: 'saptaswara@parinaamfest.org' }
    ]
  },

  // 12. Prachurya Quill: National Debate & Quiz Summit (Prachurya)
  {
    id: 'evt-12',
    eventCode: 'LIT-QUIZ-12',
    name: 'Prachurya Quill: Parliamentary Debate & General Quiz',
    category: 'Quiz & Literary',
    tagline: 'Wits, Rhetoric, and Intellectual Dominance',
    shortDescription: 'Dual-track intellectual tournament featuring British Parliamentary debate and a high-stakes mega general quiz.',
    fullDescription: 'Engage in fiercely contested arguments and mind-bending trivia rounds spanning science, pop culture, history, tech, and global politics under renowned quizmasters and adjudicators.',
    venue: 'Seminar Hall Complex - Hall A',
    date: 'Oct 11, 2026',
    startTime: '10:00 AM',
    endTime: '04:30 PM',
    day: 1,
    teamSize: '1 - 2 Members',
    minTeamSize: 1,
    maxTeamSize: 2,
    fee: 150,
    prizePool: '₹35,000',
    eligibility: 'Open to all quizzers, debaters, and thinkers.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Debate format: 3v3 / 2v2 Parliamentary debate rounds with 15-minute prep.',
      'Quiz format: Written prelims followed by top 6 teams on-stage bounce-and-pounce finals.'
    ],
    coordinators: [
      { name: 'Arjun Sen', role: 'Literary Secretary', phone: '+91 98765 11023', email: 'prachurya@parinaamfest.org' }
    ]
  },

  // 13. Valorant LAN Showdown: Cyber Arena (Chakravyuha)
  {
    id: 'evt-13',
    eventCode: 'GAME-VAL-13',
    name: 'Valorant LAN Showdown: Tactical 5v5',
    category: 'Gaming',
    tagline: 'Lock In. Plant the Spike. Claim the LAN Trophy.',
    shortDescription: 'Official 5v5 tactical shooter tournament played on 240Hz LAN esports stations with live cast commentary.',
    fullDescription: 'Enter the gaming arena for intense tactical warfare. Teams will battle through double-elimination brackets with tournament-grade displays, low latency gigabit networking, and live audience shoutcasting.',
    venue: 'Esports Gaming Arena - Room 301',
    date: 'Oct 12, 2026',
    startTime: '10:00 AM',
    endTime: '06:30 PM',
    day: 2,
    teamSize: '5 Members',
    minTeamSize: 5,
    maxTeamSize: 5,
    fee: 500,
    prizePool: '₹50,000',
    eligibility: 'All collegiate 5-player teams. Players must bring personal peripherals (mouse, keyboard, headset).',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Tournament maps: Ascent, Bind, Haven, Lotus, Sunset.',
      'Single elimination until quarterfinals; Semi-finals and Grand Final are Best of 3.',
      'Strict anti-cheat protocols and referee supervision enforced.'
    ],
    coordinators: [
      { name: 'Nikhil Varma', role: 'Esports Lead', phone: '+91 98765 11025', email: 'gaming@parinaamfest.org' }
    ]
  },

  // 14. Drone Grand Prix: Obstacle Sprint (Robotics)
  {
    id: 'evt-14',
    eventCode: 'ROBO-DRONE-14',
    name: 'Drone Grand Prix: High-Speed FPV Sprint',
    category: 'Robotics',
    tagline: 'Speed, Agility, and Acrobatic Navigation Through Neon Gates',
    shortDescription: 'First-person view (FPV) custom drone obstacle race navigating lighted hoops, chicanes, and dive gates.',
    fullDescription: 'Feel the adrenaline of acrobatic drone racing. Pilots wear immersive FPV goggles to maneuver quadcopters at blazing velocities through illuminated 3D neon obstacle courses set up inside an enclosed safety net.',
    venue: 'Outdoor Sports Pavilion - Net Enclosure',
    date: 'Oct 12, 2026',
    startTime: '03:00 PM',
    endTime: '07:30 PM',
    day: 2,
    teamSize: '1 - 2 Members',
    minTeamSize: 1,
    maxTeamSize: 2,
    fee: 300,
    prizePool: '₹60,000',
    eligibility: 'Open to all certified FPV pilots with sub-250g or standard 5-inch racing quads.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    rules: [
      'Drones must operate on 5.8GHz video transmission frequency bands assigned by marshals.',
      'Scoring based on fastest clean lap completion through all compulsory gate waypoints.',
      'Safety spotter required during all live flight attempts.'
    ],
    coordinators: [
      { name: 'Harish Chandra', role: 'Drone Track Lead', phone: '+91 98765 11027', email: 'drones@parinaamfest.org' }
    ]
  }
];
