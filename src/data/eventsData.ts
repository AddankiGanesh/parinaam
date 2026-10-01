import { FestEvent } from '../types';

export const MOCK_EVENTS: FestEvent[] = [
  {
    id: 'evt-01',
    eventCode: 'TECH-HACK-01',
    name: 'HackArena 3.0',
    category: 'Coding & Hackathon',
    tagline: '36-Hour National Flagship Hackathon',
    shortDescription: 'Build high-impact solutions in AI, FinTech, Sustainability, and Hardware across 36 non-stop intense hours.',
    fullDescription: 'HackArena 3.0 is Parinaams flagship flagship 36-hour hackathon bringing together developer teams, designers, and innovators from across India. Participants get access to mentor check-ins, cloud credits, API grants, midnight meals, and direct presentation to venture investors.',
    venue: 'Innovation Complex - Level 3 Hall',
    date: 'Oct 16 - 17, 2026',
    startTime: '10:00 AM',
    endTime: '10:00 PM (Next Day)',
    day: 1,
    teamSize: '2 - 4 Members',
    minTeamSize: 2,
    maxTeamSize: 4,
    fee: 400,
    prizePool: '₹1,50,000',
    eligibility: 'Open to all undergraduate & postgraduate college students with valid student ID.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    rulebookUrl: '#',
    rules: [
      'All code must be written during the 36-hour hackathon window.',
      'Pre-existing open source libraries and APIs are permitted provided declared during submission.',
      'Teams must present a working prototype and deck to the judging panel in Round 2.',
      'Decision of the judges and technical committee is final and binding.'
    ],
    coordinators: [
      { name: 'Aarav Sharma', role: 'Student Lead', phone: '+91 98765 11111', email: 'aarav@parinaamfest.org' },
      { name: 'Dr. S. Ranganathan', role: 'Faculty Advisor', phone: '+91 94433 22222' }
    ]
  },
  {
    id: 'evt-02',
    eventCode: 'ROBO-WARS-02',
    name: 'RoboWars 2026',
    category: 'Robotics',
    tagline: 'Heavyweight Steel Combat Arena',
    shortDescription: 'Custom-built combat bots clash in a enclosed bulletproof steel arena until total destruction.',
    fullDescription: 'Experience sparks, metal crunching, and sheer kinetic force as custom remote-controlled robots engage in 1v1 combat. Categories include 15kg Featherweight and 60kg Heavyweight bot classes.',
    venue: 'Campus Open Air Amphitheatre',
    date: 'Oct 17, 2026',
    startTime: '02:00 PM',
    endTime: '07:00 PM',
    day: 2,
    teamSize: '2 - 5 Members',
    minTeamSize: 2,
    maxTeamSize: 5,
    fee: 600,
    prizePool: '₹1,20,000',
    eligibility: 'Engineering & Polytechnic college teams with bot technical specifications passed in safety audit.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Bots must adhere strictly to weight limits (15kg Featherweight / 60kg Heavyweight).',
      'Failsafe wireless kill-switch is mandatory for all active weapon systems.',
      'No liquids, pyrotechnics, or EMP weapons allowed in the arena.',
      'Matches consist of three 3-minute rounds evaluated on aggression, control, and damage.'
    ],
    coordinators: [
      { name: 'Karthik Raja', role: 'Event Head', phone: '+91 98765 22222', email: 'karthik.robo@parinaamfest.org' }
    ]
  },
  {
    id: 'evt-03',
    eventCode: 'CODE-STORM-03',
    name: 'CodeStorm Competitive Programming',
    category: 'Coding & Hackathon',
    tagline: 'Algorithmic Speed & Accuracy Clash',
    shortDescription: 'Solve complex algorithmic problems under tight time and space constraints on a live leaderboard.',
    fullDescription: 'CodeStorm tests your data structure mastery, dynamic programming skills, and graph theory problem-solving against the sharpest student programmers in the country. Hosted on custom judging infrastructure.',
    venue: 'Computer Center Lab 1 & 2',
    date: 'Oct 16, 2026',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    day: 1,
    teamSize: 'Individual (1)',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 150,
    prizePool: '₹60,000',
    eligibility: 'Individual students with active GitHub / Codeforces handle.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Plagiarism checks using automated syntax trees will be strictly enforced.',
      'Supported languages: C++, Java, Python 3, Go, Rust.',
      'Ties resolved by total time penalty.'
    ],
    coordinators: [
      { name: 'Priya Nambiar', role: 'Head Coordinator', phone: '+91 98765 33333' }
    ]
  },
  {
    id: 'evt-04',
    eventCode: 'GAME-ARENA-04',
    name: 'Gaming Arena: Valorant & BGMI',
    category: 'Gaming',
    tagline: 'Esports Championship Series',
    shortDescription: '5v5 Tactical Shooter & Squad Battle Royale on high-refresh 240Hz competitive stage rigs.',
    fullDescription: 'Step onto the stage in Parinaams official LAN Esports Arena. Broadcasted live with professional shoutcasters, team soundproof booths, and real-time stats tracking.',
    venue: 'Indoor Sports Stadium - Esports Arena',
    date: 'Oct 17 - 18, 2026',
    startTime: '10:00 AM',
    endTime: '08:00 PM',
    day: 2,
    teamSize: '5 Members',
    minTeamSize: 5,
    maxTeamSize: 5,
    fee: 500,
    prizePool: '₹1,00,000',
    eligibility: 'Open to verified college esports rosters.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Tournament follows standard Riot Games / KRAFTON official rulebook.',
      'Personal peripherals allowed (mouse, keyboard, headset). PCs provided.',
      'Unsportsmanlike conduct results in immediate disqualification.'
    ],
    coordinators: [
      { name: 'Rohan Gupta', role: 'Esports Lead', phone: '+91 98765 44444' }
    ]
  },
  {
    id: 'evt-05',
    eventCode: 'CULT-BANDS-05',
    name: 'Battle of the Bands',
    category: 'Cultural',
    tagline: 'National Inter-College Rock & Fusion Showcase',
    shortDescription: 'Live musical showdown featuring original compositions and re-imagined covers on main festival stage.',
    fullDescription: 'Feel the roar of 8,000 students as college music bands battle for supreme rock accolades. Full acoustic and digital line setup provided by professional stage crew.',
    venue: 'Central Open Main Stage',
    date: 'Oct 16, 2026',
    startTime: '05:30 PM',
    endTime: '09:30 PM',
    day: 1,
    teamSize: '3 - 8 Members',
    minTeamSize: 3,
    maxTeamSize: 8,
    fee: 600,
    prizePool: '₹1,00,000',
    eligibility: 'College band teams with valid student authorization.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Total stage time: 15 minutes including setup and soundcheck.',
      'At least one original track must be performed in competition set.',
      'Drum kit provided. Guitars, processors, and keys must be brought by band.'
    ],
    coordinators: [
      { name: 'Meera Nair', role: 'Cultural Secretary', phone: '+91 98765 55555' }
    ]
  },
  {
    id: 'evt-06',
    eventCode: 'DESIGN-SPRINT-06',
    name: 'UI/UX Design Sprint',
    category: 'Arts & Media',
    tagline: 'Figma Product Design Challenge',
    shortDescription: 'Solve complex product usability & interface challenges for real-world application briefs in 6 hours.',
    fullDescription: 'Design Sprint tests user research, wireframing, high-fidelity UI design, and interactive prototyping. Judged by senior design leaders from top tech firms.',
    venue: 'Design Studio Lab - Academic Block B',
    date: 'Oct 17, 2026',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    day: 2,
    teamSize: '1 - 2 Members',
    minTeamSize: 1,
    maxTeamSize: 2,
    fee: 250,
    prizePool: '₹40,000',
    eligibility: 'Open to all design & engineering enthusiasts.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Final submission must be an interactive Figma file link with component design system.',
      'Design systems must be crafted during the competition window.',
      'Presentation of UX decisions required in final 5-minute pitch.'
    ],
    coordinators: [
      { name: 'Ananya V', role: 'Design Lead', phone: '+91 98765 66666' }
    ]
  },
  {
    id: 'evt-07',
    eventCode: 'CIRCUIT-CLASH-07',
    name: 'Circuit Clash & Embedded IoT',
    category: 'Technical',
    tagline: 'Hardware Debugging & PCB Prototype Challenge',
    shortDescription: 'Breadboard circuit building, signal analysis, micro-controller code debugging under time pressure.',
    fullDescription: 'Test your electronics hardware fundamentals. Participants will diagnose faulty physical circuits, assemble custom sensor modules, and write firmware to execute specified motor/sensor behavior.',
    venue: 'VLSI & Embedded Systems Laboratory',
    date: 'Oct 18, 2026',
    startTime: '09:30 AM',
    endTime: '01:00 PM',
    day: 3,
    teamSize: '2 Members',
    minTeamSize: 2,
    maxTeamSize: 2,
    fee: 200,
    prizePool: '₹35,000',
    eligibility: 'Electrical, Electronics, & Instrumentation students.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Components and oscilloscope workbenches provided at the venue.',
      'Safety equipment provided; shorting circuits intentionally causes disqualification.'
    ],
    coordinators: [
      { name: 'Siddharth R', role: 'Tech Coordinator', phone: '+91 98765 77777' }
    ]
  },
  {
    id: 'evt-08',
    eventCode: 'QUIZ-VERSE-08',
    name: 'Quizverse National General Quiz',
    category: 'Quiz & Literary',
    tagline: 'Ultimate Trivia & General Knowledge Showdown',
    shortDescription: 'Audio-visual trivia spanning technology, pop culture, history, science, and current events.',
    fullDescription: 'Hosted by renowned quizmaster Vishnu Mohan. Rapid-fire buzzers, visual connect rounds, and strategic bidding mechanics.',
    venue: 'Auditorium Hall B',
    date: 'Oct 17, 2026',
    startTime: '11:00 AM',
    endTime: '02:00 PM',
    day: 2,
    teamSize: '2 - 3 Members',
    minTeamSize: 2,
    maxTeamSize: 3,
    fee: 150,
    prizePool: '₹30,000',
    eligibility: 'Open to all registered college festival attendees.',
    registrationOpen: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Prelims written round followed by Top 6 team finals on stage.',
      'No mobile devices or smartwatch usage permitted during quiz.'
    ],
    coordinators: [
      { name: 'Gautam K', role: 'Literary Club President', phone: '+91 98765 88888' }
    ]
  },
  {
    id: 'evt-09',
    eventCode: 'WORK-AI-09',
    name: 'Hands-on Generative AI & Agentic Systems Workshop',
    category: 'Workshops',
    tagline: 'Mastering LLMs, RAG & Autonomous AI Agents',
    shortDescription: 'Build real-world production AI agents using PyTorch, LangChain & OpenAI APIs in a 4-hour masterclass.',
    fullDescription: 'Guided by senior AI researchers from Amrita Mind & Machine Intelligence Lab. Participants receive hands-on code notebooks, certificate of participation, and $50 API credits.',
    venue: 'Seminar Hall 1',
    date: 'Oct 16, 2026',
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    day: 1,
    teamSize: 'Individual (1)',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 300,
    prizePool: 'Certification & Cloud Credits',
    eligibility: 'Basic Python knowledge recommended.',
    registrationOpen: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Participants must bring their own laptop with Python 3.10+ installed.',
      'Certificate issued upon submission of workshop mini-project.'
    ],
    coordinators: [
      { name: 'Dr. Archana M', role: 'Workshop Lead', phone: '+91 98765 99999' }
    ]
  }
];
