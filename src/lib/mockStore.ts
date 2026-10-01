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
  // Sample student account
  {
    id: 'usr-demo-student',
    email: 'student@am.students.amrita.edu',
    password_hash: ADMIN_PASSWORD_HASH,
    full_name: 'Aravind Kumar',
    phone: '+91 9876543210',
    role: 'student',
    club_id: null,
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    is_amrita_student: true,
    roll_number: 'AV.SC.U4CSE22001',
    department: 'Computer Science and Engineering',
    year_of_study: '3rd Year',
    city: 'Amaravati',
    verification_status: 'verified',
    platform_fee_paid: true,
    qr_token: 'qr-student-demo-token-001',
    pass_type: 'DELEGATE PASS',
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Initial starter events
const EVENTS_DATA: MockEvent[] = [
  {
    id: 'evt-1',
    club_id: 'club-1',
    created_by: 'usr-admin-chakravyuha',
    name: 'HackVyuha 2026',
    event_code: 'CV-HACK-01',
    tagline: '36-Hour Flagship AI & Web3 National Hackathon',
    short_description: 'Build real-world solutions in AI, FinTech, Web3, and HealthTech. ₹1,00,000+ Prize Pool.',
    full_description: 'HackVyuha brings together 500+ builders, hackers, and designers across India for a non-stop 36-hour sprint. Mentorship from industry tech leads, free food, API credits, and swags for all finalists.',
    category: 'Hackathon',
    tags: ['AI', 'Web3', 'Competitive', 'Coding'],
    venue: 'Main Computing Arena, Block A',
    date_start: '2026-10-11',
    date_end: '2026-10-12',
    start_time: '09:00:00',
    end_time: '21:00:00',
    day_number: 1,
    min_team_size: 2,
    max_team_size: 4,
    capacity: 100,
    enrolled: 42,
    fee: 0,
    prize_pool: '₹1,50,000',
    eligibility: 'All college students with valid ID card or Amrita student email',
    rules: [
      'All code must be written during the hackathon period.',
      'Teams must consist of 2 to 4 members.',
      'Plagiarism or pre-built complete repositories will lead to immediate disqualification.',
      'Bring your own laptops and chargers.'
    ],
    rounds: [
      { round_number: 1, name: 'Idea Pitch & Architecture', time: 'Day 1 - 02:00 PM', venue: 'Hall A' },
      { round_number: 2, name: 'Midway Code Review', time: 'Day 2 - 03:00 AM', venue: 'Discord / Arena' },
      { round_number: 3, name: 'Grand Finale Demos & Judging', time: 'Day 2 - 04:00 PM', venue: 'Main Auditorium' }
    ],
    coordinators: [
      { name: 'Karthik Raja', phone: '+91 9876543210', email: 'karthik@chakravyuha.in' },
      { name: 'Sneha Reddy', phone: '+91 9876543211', email: 'sneha@chakravyuha.in' }
    ],
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    club_id: 'club-3',
    created_by: 'usr-admin-relu',
    name: 'Neural Clash',
    event_code: 'RELU-NC-01',
    tagline: 'Competitive Machine Learning & Kaggle Arena',
    short_description: 'Train models on an unseen confidential dataset. Highest Leaderboard F1-Score wins.',
    full_description: 'Compete in a high-stakes 6-hour ML challenge. Work on NLP and Computer Vision problem statements with GPU compute provided.',
    category: 'Competition',
    tags: ['Machine Learning', 'NLP', 'Data Science'],
    venue: 'AI Research Lab, 2nd Floor',
    date_start: '2026-10-11',
    date_end: '2026-10-11',
    start_time: '11:00:00',
    end_time: '17:00:00',
    day_number: 1,
    min_team_size: 1,
    max_team_size: 2,
    capacity: 60,
    enrolled: 28,
    fee: 100,
    prize_pool: '₹50,000',
    eligibility: 'Open to UG and PG students',
    rules: ['Any open-source library allowed', 'Submissions evaluated via automated test dataset'],
    rounds: [{ round_number: 1, name: 'Live ML Sprint', time: '11:00 AM - 05:00 PM', venue: 'AI Lab' }],
    coordinators: [{ name: 'Aditya S', phone: '+91 9876543212', email: 'aditya@relu.in' }],
    poster_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    club_id: 'club-7',
    created_by: 'usr-admin-robotics',
    name: 'RoboWars — Iron Clash',
    event_code: 'ROBO-WAR-01',
    tagline: 'Combat Robot Battle in the Steel Arena',
    short_description: '8kg & 15kg bot combat arena. Push, flip, and destroy your opponent to claim victory.',
    full_description: 'The premier combat robotics arena of South India. Polycarbonate safety glass enclosure, pneumatic hazards, and full audience stadium.',
    category: 'Robotics',
    tags: ['Hardware', 'Combat', 'Robotics'],
    venue: 'Open Air Stadium Ground',
    date_start: '2026-10-12',
    date_end: '2026-10-12',
    start_time: '14:00:00',
    end_time: '19:00:00',
    day_number: 2,
    min_team_size: 2,
    max_team_size: 5,
    capacity: 32,
    enrolled: 16,
    fee: 200,
    prize_pool: '₹75,000',
    eligibility: 'All technical colleges',
    rules: ['Bot weight <= 15kg', 'No IC engines allowed in indoor arena'],
    rounds: [
      { round_number: 1, name: 'Knockout Round', time: '02:00 PM', venue: 'Ground Arena' },
      { round_number: 2, name: 'Semi-Finals & Finals', time: '05:30 PM', venue: 'Ground Arena' }
    ],
    coordinators: [{ name: 'Vikas Rao', phone: '+91 9876543214', email: 'vikas@robotics.in' }],
    poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    rulebook_url: '',
    status: 'published',
    registration_open: true,
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    amrita_domain: 'am.students.amrita.edu',
  };

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
        verification_status: verification_status || 'pending',
        platform_fee_paid: false,
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

      // Filtered events
      let filtered = [...this.events];
      if (params.length > 0) {
        // If club_id filter is in query
        if (qLower.includes('club_id =')) {
          filtered = filtered.filter(e => e.club_id === params[0]);
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
        return { rows: [{ count: this.events.length.toString() }], rowCount: 1 };
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
    if (qLower.includes('from users u left join clubs c')) {
      const rows = this.users.map(u => {
        const club = this.clubs.find(c => c.id === u.club_id);
        return {
          id: u.id,
          full_name: u.full_name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          college_name: u.college_name,
          is_amrita_student: u.is_amrita_student,
          roll_number: u.roll_number,
          verification_status: u.verification_status,
          platform_fee_paid: u.platform_fee_paid,
          id_card_url: u.id_card_url,
          created_at: u.created_at,
          club_name: club?.name || null,
          confirmed_registrations: '0',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 14. UPDATE USERS
    if (qLower.startsWith('update users set')) {
      if (qLower.includes('verification_status =')) {
        const status = params[0];
        const reason = params[1];
        const userId = params[2];
        const target = this.users.find(u => u.id === userId);
        if (target) {
          target.verification_status = status;
          target.verification_note = reason || '';
          return { rows: [target], rowCount: 1 };
        }
      }
      if (qLower.includes('role =')) {
        const role = params[0];
        const clubId = params[1];
        const userId = params[2];
        const target = this.users.find(u => u.id === userId);
        if (target) {
          target.role = role;
          target.club_id = clubId || null;
          return { rows: [target], rowCount: 1 };
        }
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
