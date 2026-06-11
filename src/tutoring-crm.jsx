import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, BarChart2,
  Settings as SettingsIcon, Search, Plus, X, Edit2, Trash2,
  Link as LinkIcon, DollarSign, BookMarked, TrendingUp,
  CheckCircle, ThumbsUp, ThumbsDown, StickyNote,
  Building2, FileText, MapPin, Printer,
  CalendarDays, ChevronLeft, ChevronRight, Award, Play,
  Banknote, AlertCircle, Clock
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CURRICULA = ["IEB", "CAPS", "Cambridge"];

const CURRICULUM_GRADES = {
  IEB:       Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  CAPS:      Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  Cambridge: ["Year 1","Year 2","Year 3","Year 4","Year 5","Year 6","Year 7","Year 8","Year 9","IGCSE","AS Level","A Level"],
};

const PALETTE = ["#94cbd1","#d7735a","#f6cb7e","#5a9fa6","#b5bec7","#22c55e","#f59e0b"];
const NOTE_TYPES = ["compliment","complaint","general"];

// Brand colours
const B = {
  teal:       "#94cbd1",
  tealDark:   "#5a9fa6",
  tealLight:  "#e8f5f7",
  coral:      "#d7735a",
  coralDark:  "#b85d44",
  coralLight: "#fdf0ed",
  gold:       "#f6cb7e",
  goldLight:  "#fef7eb",
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const INIT_SUBJECTS = [
  { id: "s1", name: "Mathematics"      },
  { id: "s2", name: "Physical Science" },
  { id: "s3", name: "English"          },
  { id: "s4", name: "Life Sciences"    },
  { id: "s5", name: "Accounting"       },
  { id: "s6", name: "Geography"        },
];

const INIT_CENTRES = [
  { id: "c1", name: "Northside Learning Centre", ownerFirstName: "Patricia", ownerLastName: "Nkosi",   email: "patricia@northside.co.za", phone: "011 555 1234", address: "12 Oak Ave, Sandton",    status: "Active" },
  { id: "c2", name: "Southgate Academy",         ownerFirstName: "David",    ownerLastName: "van Wyk", email: "david@southgate.co.za",    phone: "021 555 5678", address: "45 Main Rd, Claremont",  status: "Active" },
];

const INIT_STUDENTS = [
  { id: "st1", firstName: "Siyanda", lastName: "Dlamini",       curriculum: "IEB",       grade: "Grade 11", status: "Active",   enrolledDate: "2025-01-15", centreId: "",   reportFrequency: "monthly" },
  { id: "st2", firstName: "Mia",     lastName: "van der Merwe", curriculum: "CAPS",      grade: "Grade 10", status: "Active",   enrolledDate: "2025-02-01", centreId: "c1", reportFrequency: "termly"  },
  { id: "st3", firstName: "Langa",   lastName: "Nkosi",         curriculum: "IEB",       grade: "Grade 12", status: "Active",   enrolledDate: "2024-11-10", centreId: "c1", reportFrequency: "monthly" },
  { id: "st4", firstName: "Priya",   lastName: "Patel",         curriculum: "Cambridge", grade: "IGCSE",    status: "Active",   enrolledDate: "2025-03-05", centreId: "c2", reportFrequency: "termly"  },
  { id: "st5", firstName: "Nomsa",   lastName: "Dlamini",       curriculum: "IEB",       grade: "Grade 9",  status: "Active",   enrolledDate: "2025-04-01", centreId: "",   reportFrequency: "monthly" },
  { id: "st6", firstName: "James",   lastName: "Chen",          curriculum: "Cambridge", grade: "AS Level", status: "Active",   enrolledDate: "2025-04-20", centreId: "c2", reportFrequency: "termly"  },
  { id: "st7", firstName: "Aisha",   lastName: "Moosa",         curriculum: "CAPS",      grade: "Grade 8",  status: "Active",   enrolledDate: "2025-05-10", centreId: "",   reportFrequency: "monthly" },
];

const INIT_TUTORS = [
  { id: "t1", firstName: "Ayanda", lastName: "Mokoena",  email: "ayanda@tutors.com", phone: "072 100 2000", subjectIds: ["s1","s2"], status: "Active", isAcademyTutor: true  },
  { id: "t2", firstName: "Ruan",   lastName: "Botha",    email: "ruan@tutors.com",   phone: "082 200 3000", subjectIds: ["s3","s6"], status: "Active", isAcademyTutor: false },
  { id: "t3", firstName: "Lerato", lastName: "Sithole",  email: "lerato@tutors.com", phone: "076 300 4000", subjectIds: ["s4","s5"], status: "Active", isAcademyTutor: false },
  { id: "t4", firstName: "Marco",  lastName: "Ferreira", email: "marco@tutors.com",  phone: "083 400 5000", subjectIds: ["s1","s5"], status: "Active", isAcademyTutor: false },
];

const INIT_LINKS = [
  { id: "lk1", studentId: "st1", tutorId: "t1", subjectId: "s1", createdDate: "2025-01-15" },
  { id: "lk2", studentId: "st1", tutorId: "t1", subjectId: "s2", createdDate: "2025-01-15" },
  { id: "lk3", studentId: "st2", tutorId: "t2", subjectId: "s3", createdDate: "2025-02-01" },
  { id: "lk4", studentId: "st3", tutorId: "t1", subjectId: "s2", createdDate: "2024-11-10" },
  { id: "lk5", studentId: "st4", tutorId: "t3", subjectId: "s4", createdDate: "2025-03-05" },
  { id: "lk6", studentId: "st5", tutorId: "t4", subjectId: "s1", createdDate: "2025-04-01" },
  { id: "lk7", studentId: "st3", tutorId: "t2", subjectId: "s3", createdDate: "2025-04-10" },
  { id: "lk8", studentId: "st6", tutorId: "t3", subjectId: "s4", createdDate: "2025-04-20" },
  { id: "lk9", studentId: "st7", tutorId: "t4", subjectId: "s5", createdDate: "2025-05-10" },
];

// Sibling pairs
const INIT_SIBLINGS = [
  { id: "sib1", studentId1: "st1", studentId2: "st5" }, // Siyanda & Nomsa Dlamini
];

const INIT_TUTOR_NOTES = [
  { id: "tn1", tutorId: "t1", type: "compliment", note: "Parent of Siyanda said Ayanda is excellent — very patient and clear.", date: "2025-04-15", source: "parent" },
  { id: "tn2", tutorId: "t2", type: "complaint",  note: "Ruan was 15 minutes late to session on 3 May without notice.",        date: "2025-05-03", source: "admin" },
];

const INIT_CENTRE_NOTES = [
  { id: "cn1", centreId: "c1", type: "general",   note: "Signed 12-month agreement in January 2025.",                date: "2025-01-10" },
  { id: "cn2", centreId: "c2", type: "complaint",  note: "Owner flagged timetable clashes in Week 3 of February.",    date: "2025-02-18" },
];

// ─── LMS SEED DATA ────────────────────────────────────────────────────────────

const INIT_COURSES = [
  { id: "cr1", title: "Mathematics Mastery — Grade 11", description: "A complete Grade 11 Mathematics course covering Algebra, Functions and Trigonometry.", subjectId: "s1", status: "Published", createdDate: "2025-01-01", color: "#94cbd1" },
  { id: "cr2", title: "English Language & Literature",  description: "Comprehensive English course covering reading comprehension, writing and literary analysis.", subjectId: "s3", status: "Published", createdDate: "2025-02-01", color: "#d7735a" },
];

const INIT_MODULES = [
  { id: "mod1", courseId: "cr1", title: "Algebra & Equations",   order: 1 },
  { id: "mod2", courseId: "cr1", title: "Functions & Graphs",    order: 2 },
  { id: "mod3", courseId: "cr2", title: "Reading Comprehension", order: 1 },
  { id: "mod4", courseId: "cr2", title: "Essay Writing",         order: 2 },
];

const INIT_LESSONS = [
  { id: "les1", moduleId: "mod1", courseId: "cr1", title: "Introduction to Polynomials",  order: 1, content: "A polynomial is an expression consisting of variables and coefficients. For example: 3x² + 2x + 1.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", fileName: "", fileUrl: "", dueDate: "2025-06-10" },
  { id: "les2", moduleId: "mod1", courseId: "cr1", title: "Solving Quadratic Equations",  order: 2, content: "Quadratic equations take the form ax² + bx + c = 0. We solve using factorisation or the quadratic formula.", videoUrl: "", fileName: "Quadratics_Worksheet.pdf", fileUrl: "#", dueDate: "2025-06-17" },
  { id: "les3", moduleId: "mod2", courseId: "cr1", title: "Linear Functions",              order: 1, content: "A linear function has the form f(x) = mx + c where m is the gradient and c the y-intercept.", videoUrl: "", fileName: "", fileUrl: "", dueDate: "2025-07-03" },
  { id: "les4", moduleId: "mod3", courseId: "cr2", title: "Identifying the Main Idea",    order: 1, content: "The main idea is the central point the author wants to communicate in a passage.", videoUrl: "", fileName: "", fileUrl: "", dueDate: "2025-06-12" },
  { id: "les5", moduleId: "mod4", courseId: "cr2", title: "Essay Structure",              order: 1, content: "A well-structured essay has an introduction, body paragraphs and a conclusion.", videoUrl: "", fileName: "Essay_Template.pdf", fileUrl: "#", dueDate: "2025-06-24" },
];

const INIT_QUIZZES = [
  { id: "qz1", lessonId: "les1", courseId: "cr1", title: "Polynomials Quiz", questions: [
    { id: "qq1", question: "What is the degree of 3x² + 2x + 1?", type: "multiple", options: ["1","2","3","4"], correctIndex: 1 },
    { id: "qq2", question: "A polynomial can have negative exponents.", type: "truefalse", options: ["True","False"], correctIndex: 1 },
  ]},
  { id: "qz2", lessonId: "les2", courseId: "cr1", title: "Quadratics Quiz", questions: [
    { id: "qq3", question: "Which formula solves quadratic equations?", type: "multiple", options: ["Quadratic Formula","Sine Rule","BODMAS","Pythagoras"], correctIndex: 0 },
  ]},
];

const INIT_ENROLMENTS = [
  { id: "en1", studentId: "st1", courseId: "cr1", enrolledDate: "2025-01-15", status: "Active" },
  { id: "en2", studentId: "st3", courseId: "cr1", enrolledDate: "2025-01-15", status: "Active" },
  { id: "en3", studentId: "st2", courseId: "cr2", enrolledDate: "2025-02-05", status: "Active" },
  { id: "en4", studentId: "st1", courseId: "cr2", enrolledDate: "2025-02-05", status: "Active" },
];

const INIT_PROGRESS = [
  { id: "pg1", studentId: "st1", lessonId: "les1", courseId: "cr1", completed: true,  completedDate: "2025-06-11", quizScore: 90 },
  { id: "pg2", studentId: "st1", lessonId: "les2", courseId: "cr1", completed: true,  completedDate: "2025-06-18", quizScore: 75 },
  { id: "pg3", studentId: "st1", lessonId: "les3", courseId: "cr1", completed: false, completedDate: null,         quizScore: null },
  { id: "pg4", studentId: "st3", lessonId: "les1", courseId: "cr1", completed: true,  completedDate: "2025-06-12", quizScore: 85 },
  { id: "pg5", studentId: "st2", lessonId: "les4", courseId: "cr2", completed: true,  completedDate: "2025-06-13", quizScore: 80 },
];

const INIT_ANNOUNCEMENTS = [
  { id: "ann1", courseId: "cr1", title: "Welcome to Mathematics Mastery!", body: "We are excited to have you on this course. Please complete all lessons before their due dates and reach out if you need help.", date: "2025-01-15" },
  { id: "ann2", courseId: "cr1", title: "Module 1 Revision Session",      body: "There will be a live revision session this Friday at 14:00. Please come prepared with questions on Algebra.", date: "2025-06-07" },
];

// Lesson purchases — stats only, not accounting
const INIT_PURCHASES = [
  { id: "lp1", studentId: "st1", quantity: 10, date: "2025-01-15", note: "Initial block" },
  { id: "lp2", studentId: "st1", quantity:  8, date: "2025-03-10", note: "Top-up" },
  { id: "lp3", studentId: "st2", quantity:  5, date: "2025-02-01", note: "First purchase" },
  { id: "lp4", studentId: "st3", quantity: 12, date: "2024-11-10", note: "Initial block" },
  { id: "lp5", studentId: "st4", quantity:  8, date: "2025-03-05", note: "Initial block" },
  { id: "lp6", studentId: "st5", quantity:  6, date: "2025-04-01", note: "Initial block" },
  { id: "lp7", studentId: "st6", quantity:  8, date: "2025-04-20", note: "Initial block" },
];

// Lesson logbook — sessions logged by tutors
const INIT_LOGBOOK = [
  { id: "lb1", tutorId: "t1", studentId: "st1", subjectId: "s1", date: "2025-05-10", duration: 60, topicsCovered: "Quadratic equations — factorising and completing the square", homework: "Exercise 4.3, questions 1–10", notes: "Student grasped factorising well. Needs more work on completing the square.", attended: true },
  { id: "lb2", tutorId: "t1", studentId: "st1", subjectId: "s2", date: "2025-05-12", duration: 60, topicsCovered: "Newton's Laws of Motion — Law 1 and Law 2", homework: "Read textbook p.45–52", notes: "Good session. Student asked great questions.", attended: true },
  { id: "lb3", tutorId: "t1", studentId: "st3", subjectId: "s2", date: "2025-05-14", duration: 60, topicsCovered: "Waves — transverse and longitudinal waves", homework: "Worksheet B", notes: "Langa is strong in this topic.", attended: true },
  { id: "lb4", tutorId: "t2", studentId: "st3", subjectId: "s3", date: "2025-05-15", duration: 45, topicsCovered: "Essay writing — argument structure and topic sentences", homework: "Draft introduction paragraph", notes: "Needs to work on topic sentences.", attended: true },
  { id: "lb5", tutorId: "t1", studentId: "st1", subjectId: "s1", date: "2025-06-03", duration: 60, topicsCovered: "Functions — parabolas and hyperbolas", homework: "Functions worksheet", notes: "Very good session. Student showed solid understanding.", attended: true },
];

// Scheduled lessons
const INIT_SCHEDULED_LESSONS = [
  { id: "sl1", tutorId: "t1", studentId: "st1", subjectId: "s1", date: "2025-06-15", time: "14:00", link: "https://meet.google.com/abc-def-ghi", notes: "Functions revision" },
  { id: "sl2", tutorId: "t1", studentId: "st1", subjectId: "s2", date: "2025-06-17", time: "15:00", link: "", notes: "Electrostatics introduction" },
  { id: "sl3", tutorId: "t1", studentId: "st3", subjectId: "s2", date: "2025-06-18", time: "10:00", link: "https://zoom.us/j/12345", notes: "" },
];

// Tutor ↔ student chat messages
const INIT_MESSAGES = [
  { id: "msg1", tutorId: "t1", studentId: "st1", fromRole: "tutor",   text: "Hi Siyanda! Please review Chapter 4 — Functions before our next session.", date: "2025-06-10", time: "09:15" },
  { id: "msg2", tutorId: "t1", studentId: "st1", fromRole: "student", text: "Thanks, I will! Is there anything specific I should focus on with the parabolas?", date: "2025-06-10", time: "10:02" },
  { id: "msg3", tutorId: "t1", studentId: "st1", fromRole: "tutor",   text: "Yes — focus on finding the turning point and axis of symmetry. See you Sunday!", date: "2025-06-10", time: "10:15" },
];

// Tutor notes about students — visible to parent only, NOT to students
const INIT_TUTOR_STUDENT_NOTES = [
  { id: "tsn1", tutorId: "t1", studentId: "st1", note: "Siyanda is progressing well but needs consistent daily practice at home. Please encourage her to complete all homework before our sessions. She is close to a major breakthrough in her understanding of functions.", date: "2025-06-01" },
];

// Student progress reports written by tutors
const INIT_STUDENT_REPORTS = [
  { id: "srt1", tutorId: "t1", studentId: "st1", subjectId: "s1", period: "May 2025", periodType: "monthly",
    lessonsAttended: 4, lessonsScheduled: 4,
    topicsCovered: "Algebra: quadratic equations (factorising, completing the square, quadratic formula). Introduction to functions and parabolas.",
    strengths: "Strong algebraic manipulation. Quick to grasp new concepts. Asks thoughtful questions during sessions.",
    areasForImprovement: "Needs to show more working in exam conditions. Careless errors with negative signs in complex calculations.",
    overallComments: "Siyanda is performing at a good level. With consistent practice and attention to detail she is well on track to achieve excellent results.",
    rating: "Good", date: "2025-06-01" },
];

// Monthly financials — turnover & expenses (manual input)
const INIT_FINANCIALS = [
  { id: "fin1", month: "2024-11", turnover: 14500, expenses: 7200 },
  { id: "fin2", month: "2024-12", turnover: 11000, expenses: 6500 },
  { id: "fin3", month: "2025-01", turnover: 18000, expenses: 8500 },
  { id: "fin4", month: "2025-02", turnover: 21000, expenses: 9200 },
  { id: "fin5", month: "2025-03", turnover: 23500, expenses: 10100 },
  { id: "fin6", month: "2025-04", turnover: 26000, expenses: 11300 },
  { id: "fin7", month: "2025-05", turnover: 28000, expenses: 12000 },
];

// Tutor pay rates — one record per year, admin-configurable
const INIT_TUTOR_RATES = [
  { id: "rate2026", year: 2026, regularRate: 235, academyRate: 225, centreRate: 235, wifiAllowance: 40 }
];

// Tutor claims — workshop, marking, other extras
const INIT_TUTOR_CLAIMS = [];

// Invoice approval/payment status — one record per tutor per month
const INIT_INVOICE_STATUS = [];

// Claim types — admin-configurable list of services/products tutors can claim
const INIT_CLAIM_TYPES = ["Workshop", "Marking", "Travel Allowance", "Materials", "Other"];

// ─── UTILITIES ────────────────────────────────────────────────────────────────

const uid     = () => Math.random().toString(36).slice(2, 9);
const today   = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => d
  ? new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })
  : "—";
const fmtMonth = (m) => {
  const [y, mo] = m.split("-");
  return new Date(+y, +mo - 1).toLocaleString("en-ZA", { month: "short", year: "numeric" });
};
const fmtZAR = (n) => `R${Number(n).toLocaleString("en-ZA")}`;

// ─── PAYROLL HELPERS ─────────────────────────────────────────────────────────

const getRateForYear = (year, tutorRates) =>
  (tutorRates || []).find(r => r.year === year) ||
  { regularRate: 235, academyRate: 225, centreRate: 235, wifiAllowance: 40 };

const getStudentLessonType = (studentId, data) => {
  const st = (data.students || []).find(s => s.id === studentId);
  if (!st) return "regular";
  if (st.centreId) return "centre";
  return (data.enrolments || []).some(e => e.studentId === studentId && e.status === "Active")
    ? "academy" : "regular";
};

const calcLessonItem = (lb, data) => {
  const year     = parseInt(lb.date.slice(0, 4));
  const rate     = getRateForYear(year, data.tutorRates);
  const type     = getStudentLessonType(lb.studentId, data);
  const hours    = lb.duration / 60;
  const baseRate = type === "academy" ? rate.academyRate : (type === "centre" ? rate.centreRate : rate.regularRate);
  const lessonAmt = baseRate * hours;
  const wifiAmt   = type === "centre" ? rate.wifiAllowance : 0;
  return { lessonType: type, baseRate, hours, lessonAmt, wifiAmt, lineTotal: lessonAmt + wifiAmt };
};

const isInvoiceLocked = (month) => today() >= month + "-26";

const buildTutorInvoice = (tutorId, month, data) => {
  const lessonLogs = (data.logbook || []).filter(l => l.tutorId === tutorId && l.date.startsWith(month) && l.attended);
  const lessonLines = lessonLogs.map(lb => {
    const st  = (data.students || []).find(s => s.id === lb.studentId);
    const sub = (data.subjects || []).find(s => s.id === lb.subjectId);
    const calc = calcLessonItem(lb, data);
    return { ...lb, studentName: st ? `${st.firstName} ${st.lastName}` : "—", subjectLabel: sub?.name || "—", ...calc };
  });
  const allClaims      = (data.tutorClaims || []).filter(c => c.tutorId === tutorId && c.month === month);
  const approvedClaims = allClaims.filter(c => c.status === "approved");
  const lessonTotal    = lessonLines.reduce((s, l) => s + l.lineTotal, 0);
  const claimsTotal    = approvedClaims.reduce((s, c) => s + Number(c.amount), 0);
  const grandTotal     = lessonTotal + claimsTotal;
  const statusRec      = (data.invoiceStatus || []).find(s => s.tutorId === tutorId && s.month === month) || null;
  const locked         = isInvoiceLocked(month);
  const isApproved     = !!(statusRec?.tutorApproved) || (locked && lessonLines.length > 0);
  const isPaid         = !!(statusRec?.paid);
  return { lessonLines, allClaims, approvedClaims, lessonTotal, claimsTotal, grandTotal, statusRec, locked, isApproved, isPaid };
};

// Build print-ready HTML for a single tutor's invoice
const buildTutorInvoiceHTML = (tutor, inv, month) => {
  const status = inv.isPaid ? "PAID" : inv.isApproved ? (inv.locked && !inv.statusRec?.tutorApproved ? "AUTO-LOCKED" : "APPROVED") : "PENDING";
  const [yr, mo] = month.split("-");
  const monthLabel = new Date(Number(yr), Number(mo) - 1, 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
  const studentGroups = groupLessonsByStudent(inv.lessonLines);

  // One row per student
  const studentRows = studentGroups.map((g, i) =>
    `<tr style="background:${i%2===0?"#fff":"#f9fafb"}">
      <td style="padding:7px 8px;font-weight:600">${g.studentName}</td>
      <td style="padding:7px 8px;text-align:center">${g.lessonCount}</td>
      <td style="padding:7px 8px;color:#555;font-size:10px">${g.dates.join(" · ")}</td>
      <td style="padding:7px 8px;text-transform:capitalize;color:#555">${g.lessonType}${g.hasWifi?" + WiFi":""}</td>
      <td style="padding:7px 8px;text-align:right;font-weight:700">R${g.total.toFixed(2)}</td>
    </tr>`
  ).join("") || `<tr><td colspan="5" style="color:#aaa;text-align:center;padding:14px">No attended lessons this month</td></tr>`;

  // Claims as line items (same table, visually distinct)
  const claimItemRows = inv.approvedClaims.map((c, i) =>
    `<tr style="background:#fffbeb">
      <td style="padding:7px 8px;font-style:italic;color:#92400e">${c.type}${c.studentNames?" — "+c.studentNames:""}</td>
      <td style="padding:7px 8px;text-align:center;color:#92400e">1</td>
      <td style="padding:7px 8px;color:#92400e;font-size:10px">${fmtDate(c.date)}</td>
      <td style="padding:7px 8px;color:#92400e">Claim</td>
      <td style="padding:7px 8px;text-align:right;font-weight:700;color:#92400e">R${Number(c.amount).toFixed(2)}</td>
    </tr>`
  ).join("");

  const hasItems = studentGroups.length > 0 || inv.approvedClaims.length > 0;

  return `
    <div style="page-break-after:always;padding:36px 40px;font-family:Arial,sans-serif;font-size:12px;max-width:800px;margin:auto">
      <table width="100%" style="border-collapse:collapse;margin-bottom:20px">
        <tr>
          <td><h2 style="margin:0;color:#2a7f85;font-size:18px">LEARN TO LINK</h2><p style="margin:2px 0 0;color:#888;font-size:11px">Tutor Invoice · ${monthLabel}</p></td>
          <td style="text-align:right">
            <span style="padding:4px 14px;border-radius:20px;font-size:11px;font-weight:bold;background:${status==="PAID"?"#dcfce7":status==="APPROVED"?"#e8f5f6":status==="AUTO-LOCKED"?"#fef3c7":"#f3f4f6"};color:${status==="PAID"?"#166534":status==="APPROVED"?"#2a7f85":status==="AUTO-LOCKED"?"#92400e":"#6b7280"}">${status}</span>
            <p style="margin:4px 0 0;color:#888;font-size:10px">Generated: ${fmtDate(today())}</p>
          </td>
        </tr>
      </table>
      <table width="100%" style="border-collapse:collapse;background:#f0f9fa;margin-bottom:24px">
        <tr>
          <td style="padding:10px 14px"><b style="font-size:13px">${tutor.firstName} ${tutor.lastName}</b><br/><span style="color:#666;font-size:11px">${tutor.email}${tutor.phone?" · "+tutor.phone:""}</span></td>
          ${inv.isPaid && inv.statusRec?.paidDate ? `<td style="padding:10px 14px;text-align:right;color:#888;font-size:11px">Paid: ${fmtDate(inv.statusRec.paidDate)}</td>` : ""}
        </tr>
      </table>

      <h3 style="color:#2a7f85;border-bottom:2px solid #e8f5f6;padding-bottom:6px;margin-bottom:0;font-size:13px">Invoice Items</h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#e8f5f6">
            <th style="padding:7px 8px;text-align:left">Student / Description</th>
            <th style="padding:7px 8px;text-align:center">Lessons</th>
            <th style="padding:7px 8px;text-align:left">Dates</th>
            <th style="padding:7px 8px;text-align:left">Type</th>
            <th style="padding:7px 8px;text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${studentRows}
          ${inv.approvedClaims.length > 0 ? `
          <tr><td colspan="5" style="padding:4px 8px;background:#fef3c7;font-size:10px;color:#92400e;font-weight:600;letter-spacing:0.05em">CLAIMS</td></tr>
          ${claimItemRows}` : ""}
          ${!hasItems ? `<tr><td colspan="5" style="color:#aaa;text-align:center;padding:16px">No items for this period</td></tr>` : ""}
        </tbody>
      </table>

      <table width="100%" style="border-collapse:collapse;margin-top:12px">
        ${studentGroups.length > 0 ? `<tr><td style="padding:4px 8px;text-align:right;color:#555">Lessons subtotal</td><td style="padding:4px 8px;text-align:right;width:120px">R${inv.lessonTotal.toFixed(2)}</td></tr>` : ""}
        ${inv.approvedClaims.length > 0 ? `<tr><td style="padding:4px 8px;text-align:right;color:#555">Claims subtotal</td><td style="padding:4px 8px;text-align:right">R${inv.claimsTotal.toFixed(2)}</td></tr>` : ""}
        <tr style="border-top:2px solid #2a7f85">
          <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:13px;color:#2a7f85">Grand Total</td>
          <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:15px;color:#2a7f85">R${inv.grandTotal.toFixed(2)}</td>
        </tr>
      </table>

      <p style="margin-top:20px;color:#aaa;font-size:10px;border-top:1px solid #eee;padding-top:10px">
        ${inv.statusRec?.tutorApproved ? `Approved by tutor: ${fmtDate(inv.statusRec.tutorApprovedDate)}` : inv.locked ? "Auto-approved on the 26th" : "Awaiting tutor approval"}
      </p>
    </div>`;
};

// Open a print window with invoice HTML (wrap in full document)
const printInvoiceWindow = (bodyContent, title) => {
  const html = `<!DOCTYPE html><html><head><title>${title}</title><style>body{margin:0}table th,table td{border:1px solid #e8e8e8;padding:4px 8px}@media print{.no-print{display:none}}</style></head><body>${bodyContent}</body></html>`;
  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
};

// Group invoice lesson lines by student (one row per student)
const groupLessonsByStudent = (lessonLines) => {
  const map = {};
  lessonLines.forEach(l => {
    if (!map[l.studentId]) map[l.studentId] = { studentId:l.studentId, studentName:l.studentName, lines:[] };
    map[l.studentId].lines.push(l);
  });
  return Object.values(map).map(g => {
    const sorted = [...g.lines].sort((a,b)=>a.date.localeCompare(b.date));
    return {
      studentId:   g.studentId,
      studentName: g.studentName,
      lessonCount: g.lines.length,
      dates:       sorted.map(l=>fmtDate(l.date)),
      total:       g.lines.reduce((s,l)=>s+l.lineTotal, 0),
      lessonType:  g.lines[0]?.lessonType || "regular",
      hasWifi:     g.lines.some(l=>l.wifiAmt>0),
    };
  });
};

// Returns last N month keys as "YYYY-MM"
const lastNMonths = (n) => {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-ZA", { month: "short" }),
    });
  }
  return months;
};

// ─── REPORT GENERATION ───────────────────────────────────────────────────────

const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABuwAAAG1CAYAAAASkNLcAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIwAALiMBeKU/dgAABGlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMS0wOC0wNDwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD5mYWFlMjMyNS0yZWQ5LTRiNTgtODUyZS1lYWEyNWY2ZWQ1MzU8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+TGV0dGVyaGVhZDwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz4KICA8cGRmOkF1dGhvcj5mZXJuYXRhc2hpZTwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhPC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PoYzoI4AACAASURBVHic7N13dFTnmT/w7xRN0ahXEAghqgEDFsV0Q7CxAfclcSPYThzHTkicxDmb5Jzds2fP2f1t9uzZrI/trOM1LsGF5oax7Lhgqg2mCgQIJEAU9TYaTS+3/P6QNdHojqSpGpXvJ8cn6J2Ze9+589470vvc53lVsizLICIiIiIiIiIiIiIiIqKEUCe6A0REREREREREREREREQjGQN2RERERERERERERERERAnEgB0RERERERERERERERFRAjFgR0RERERERERERERERJRADNgRERERERERERERERERJRADdkREREREREREREREREQJxIAdERERERERERERERERUQIxYEdERERERERERERERESUQAzYERERERERERERERERESUQA3ZERERERERERERERERECcSAHREREREREREREREREVECMWBHRERERERERERERERElEAM2BERERERERERERERERElEAN2RERERERERERERERERAnEgB0RERERERERERERERFRAjFgR0RERERERERERERERJRADNgRERERERERERERERERJRADdkREREREREREREREREQJxIAdERERERERERERERERUQIxYEdERERERERERERERESUQAzYERERERERERERERERESUQA3ZERERERERERERERERECcSAHREREREREREREREREVECMWBHRERERERERERERERElEAM2BERERERERERERERERElEAN2RERERERERERERERERAnEgB0RERERERERERERERFRAjFgR0RERERERERERERERJRADNgRERERERERERERERERJRADdkREREREREREREREREQJxIAdERERERERERERERERUQIxYEdERERERERERERERESUQAzYERERERERERERERERESUQA3ZERERERERERERERERECcSAHREREREREREREREREVECMWBHRERERERERERERERElEAM2BERERERERERERERERElEAN2RERERERERERERERERAnEgB0RERERERERERERERFRAjFgR0RERERERERERERERJRADNgRERERERERERERERERJRADdkREREREREREREREREQJxIAdERERERERERERERERUQIxYEdERERERERERERERESUQAzYERERERERERERERERESUQA3ZERERERERERERERERECcSAHREREREREREREREREVECMWBHRERERERERERERERElEAM2BERERERERERERERERElEAN2RERERERERERERERERAnEgB0RERERERERERERERFRAjFgR0RERERERERERERERJRA2kR3gIiIBjcZgCzLAFQAZP/PnS0qqFSdjwCASqUCZLnz/4mIiIiIiIiIiIgoJAzYERGRnyjJ8MkS3KIIjyjDJQpwCxI8kgifKEH4LlAnyjJESYZWrYZaBWhUKiSp1dCp1dBr1DBqNDBo1TBoNNCp1UhSM6GbiIiIiIiIiIiIqDcM2BERjVAyAJ8kwSmIaPd40eb2oN3rg80nwCkI8IgSvJIEQZIhoTNAJ32XPSf7NyIDqs5MO7UKUKtU/uCdQdMZsEtN0iJLr0eeUY9MXRJSkpKgVavAHLzwSXLnZwAZUKkAjyhBkiRIsgz1dxmQQGfGowoqyN9lROK7R2QAGrW68zPSqPHdhwcVOj87IiIiIiIiIiIiSgyV3FnnjIiIRgBZBrySiFa3F7VOF2rtTrR6vHD4BIhdwSCVCrH6alChs0ymSgVoVSqYtFrkGw0oSknGuJRkpOuSoGGgKCifJEEUJXhFAU6PD2oAHkGA2ytABRlqAD5RhCjLgCTju2qkUKlU/gVqZQCS3PkvlQqQoYJKrUKSSgW1Wg3xu2hdil4HtVoNrUaDZH0SVFBBp9UwiEdERERERERERDRAGLAjIhrGJFmGIMtwCCJa3R7U2p2ocbhg9njgkSQk6htArVLB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traioqICn376aUA/iouLMXXqVH8/RFGExWLB5cuXUV5ergimmc1mfPTRR7j33nuxadOmgMC3RqPB5MmTMWnSJGRmZvqPp8ViQVVVFc6ePasIGFy/fh27d+/GHXfcEdH7CtXFixdRWloKl8vlb9Pr9ZgwYQImTpyIjIwMJCcnQ5ZlOJ1O1NbW4uzZs0GDx6WlpRg/fjzGjRvX6/5kWcbBgwcD2u68885+S4A6HA68/vrrUU209rU+oEqlwqJFi/Dxxx/7286ePaso5RiNpqYmbNq0KeBYd5k0aRKmT5+O/Px8mEwmeDwetLe3o6qqCuXl5QHXZkmSsH37dphMpj5LOnZZuHBhwPsCOksNTpo0CYWFhf59arVauFwuNDQ04OzZs0HLS77//vuYMmVKWNm0XefCjh07FIEJnU7nH2d6vR4ulwstLS39llhtaGjAsWPHAjK4VCoVxo8fj4kTJyI3NzfgPTU2NqKysjJoEPbcuXM4cOAAli9f7m8zGAy46667Ap5XVlaGurq6gLY77rij3zXWgpV5PXLkCN5///2gz8/Ly8P06dMxatQopKSkQKVSwW63o6WlBRUVFQHvucvnn38OAFi1alWffRlora2tqKysxLvvvhvQnpaWhsmTJ6OoqAgpKSlITk6Gz+eDzWbD1atXUV5erviOEUURmzdvxu9///u4lWf87LPPFNcnk8mEp59+GllZWTHdV01NDV599VX4fMGXqSkoKEBxcTFSUlJgNBrh8XjQ1taG+vp61NfX+7/zZs2a1esaiUNhnAU718LR0NCg+H2i69wPJtHXw8GKATsiogEkyUC904WDja24bneAobpAaUlazM3ORL7RELN162QAPkGA2e6E1e6ExNKjMZWoeLMKgCxKsFhs8Hh8yMtMhSEpiWvbERHRsLB9+3b/5E9mZibuu+++Xu/YnjNnDu688058+OGHirvQW1tb8eqrr6KqqsrfNnbsWNx///0oKioKur25c+fizjvvxLZt23Du3LmAx6qrq3H9+vU+AwBA50T83LlzceDAAeTk5GDRokWYNWtWQInCnmbNmoXVq1djy5YtqKioCHjs6NGjuP3223styRZPY8aMCdquUqkwduzYmO4rEcetpqYG+/btU7Tn5OTg4Ycf7nWczJ49GwBw6tQpfPzxx+jo6ACAgEBbJGRZDiiFOGHCBNx///29BgwW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fvrTn8JkMsU0noaGBrzyyiuyt1ksFixYsAD19fWYOnWqZB/09vbi1KlT2LNnj2SNuwsXLuCtt97Chg0bYhpHOvT09OCll15CV1dXWh93OOAdrbS0NOHQOp73m/7+fvz617+WnVWn0Wgwd+5czJgxA3V1dSOh7DC3242mpibs3r0b7e3tEbc5HA68+OKLitdwjA7sLBZLwiV8o8c/mVBgRwghSWTS61FRUoKLfj/CwWBq1q1TKmNhXbIpK4M5tCWgNKxT+qulOqxTqdUoLyuD1aL8w4rIGFqcbhzrG4Q3TaUicolN4FGg16HAbIKQxWsxEEIIIYTc6D788EN89NFHsreZzWbccccduPnmm6HT6cbtZ3TY0d3djYaGBhw4cAAAcPPNNydvwCTtmpubR57L0e666y7ceeedsuGS0WjEsmXLsGjRIrz++us4ceLEyG3hcBivvfYafvjDH8a1bpvX68V7770naV+xYgXuv//+cfvS6XS47bbbsHDhQvzpT39Ca2trxO3btm3Dj3/84wmDMovFgkcffRQvvvjiSJvNZsPq1auxcOHCcU/McxwHm82GO++8E7feeiu2bNmChoaGiPtcunQJR48eVTwDMRkCgQBefPFFSVjHcRxWrlyJr371qzGtCafRaOKa0cZxHB577DH84he/GFk7TK/XY9WqVVixYgUMBsO421ssFixduhRLlizBrl278P7770fc7vP58N577+Gb3/xmTOOZNWsWSktLI9ZItFgsWLt2LZYuXTru8VZUVITbb78dt9xyC1599VWcPXs24vYvv/wSK1asUBRaJ9uJEyfwxhtvSGZ/1tbWjju7Mhm8Xq+k2tbatWsxd+7clD7uaAUFBZg3bx4OHz480qZSqbBq1Srcfvvt4x7rRqMRixYtwsKFC7Fz50588sknEbd3dnZi//79WLlyZdzjir6wYN68ebj//vvj7udGQWedCCEkiTgABWYTykpLwQuxXhPBEB0HSVswlIaxGO431kNM3KQ4cZMZ2qhHYTHeN6ZHUjyrTmlYF+tzIbttisM6QRBQWlKM0kIr+ASuWuzzB3CkdwCDfmW1zSczPQeUadSwWszQapSXGyWEEEIIIal17NixMcO6m2++Gf/0T/+Er3zlKxOGddFsNhu++tWv4l//9V/x7LPP0uy6HLdjxw5J25o1a7BmzZoJAy6NRoNvf/vb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lmVIogS9JMIgSRBEATIESJIISRAgimJlbTWvcLmCjMlcFpFMFpF0BuF0FpO5HOLZHJLTz1MFj6wIwCiJsOp1sOl1sOv1cBn0cBr0sOt1MEoSpGX4hxwREREREREREdFiYGBHRER0hSrIMvKyjHS+gHQ+j8ylqsdK/tdAFAWYJAkGUYReFKAXJYjM54iIiIiIiIiIiErCwI6IiIiIiIiIiIiIiIiojsR6b4CIiIiIiIiIiIiIiIjoSsbAjoiIiIiIiIiIiIiIiKiOGNgRERERERERERERERER1REDOyIiIiIiIiIiIiIiIqI6YmBHREREREREREREREREVEcM7IiIiIiIiIiIiIiIiIjqiIEdERERERERERERERERUR0xsCMiIiIiIiIiIiIiIiKqIwZ2RERERERERERERERERHXEwI6IiIiIiIiIiIiIiIiojhjYEREREREREREREREREdURAzsiIiIiIiIiIiIiIiKiOmJgR0RERERERERERERERFRHDOyIiIiIiIiIiIiIiIiI6oiBHREREREREREREREREVEdMbAjIiIiIiIiIiIiIiIiqiMGdkRERERERERERERERER1xMCOiIiIiIiIiIiIiIiIqI4Y2BERERERERERERERERHVEQM7IiIiIiIiIiIiIiIiojpiYEdERERERERERERERERURwzsiIiIiIiIiIiIiIiIiOqIgR0RERERERERERERERFRHenqvQEiIiIiIiIiIiIiKl8yn0f/ZFKx5jMZ4DEa6rQjIqLaupLOcwzsiIiIiIiIiIiIiJah0WQaT5+/oFjbHvDh5kZfnXZERFRbV9J5joEdERERERERERERERHRIjo/Gcf+0TAyhQJ6nHZc63NDqPemqK4Y2BERERERERER0bIxkkpj38jYghxbL4r4QktgQY5NtFLsHhzFRDarWFvncqDLYav5fe0dHsNYOq1Y63Ha0e201/y+aOnaMxRCOJPR/F6L1YLNXtei7OOVi8NI5fOa3yv3PTCcTOGpM/2QL33dN5lAtlDADQ3eGuyUlisGdkREREREREREtGxMZnM4Eo4tyLGNDOyI5uU26vFeUWh+IZ7EarsVklC7+qDhZApvDY0q1vSigM82NdTsPmh5ODMxicFESvt7sTg2epw1fe1pGUyk8GEoPOv3fSZjWYHd8cjE5bBu2ifhKAO7K5xY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IiIiIiIiIprH2Yk4PiyqEjOIIu5ub6qqOuOutiAeP35O0Uryw1AYnQ7b5fCqVNlLx1hls+LRdZ04OBbBwbGwqsKomNugxyavC1t8nrLncxXrctjw7bWr8f7IOA6NR+ads+U26LHZ58a1PreipahDr4NVJyF+aa7dSrTe7UCnw4b9o1OP1XzVIx6jAdf63NjsdSkqML0VtFC9UugEAZ9rasA2vwcfjI7jeCQ27+OsEwR0OGzY7HXVvFViq9WCR9Z24PB4FB+FwhhPz/3eFACstlux1e9RnQ98JuOKm/O4kEQAGzxO7Bv5tNVuu83C4HOB8TxXHkGWZe1G1URERERERERERLQkvTMcwttDIcXaN9asQtCinrEVzWYxEE8hkskgdSkAM0giXAYDghbTglUuFAAMJ1IYSqaQyOWQzhcgCgJMkginwYCAxQQ3L5ZfFkqlMZRMIZrJIp0vQABglCS4jHo0WcwMFmoklMpgePpxLuQhy1PvB7teB5/JiIDZVHZL2krFczlcjKcQzWSQzheQKRQgCQKseh28RgOarWYYRDbJo5WD57m5MbAjIiIiIiIiIiJaZrQCu4e62tFiXdmtJImIiFYqxvNEREREREREREREREREdcTAjoiIiIiIiIiIiIiIiKiOGNgRERERERERERERERER1REDOyIiIiIiIiIiIiIiIqI6YmBHREREREREREREREREVEcM7IiIiIiIiIiIiIiIiIjqiIEdERERERERERERERERUR0xsCMiIiIiIiIiIiIiIiKqIwZ2RERERERERERERERERHXEwI6IiIiIiIiIiIiIiIiojhjYEREREREREREREREREdURAzsiIiIiIiIiIiIiIiKiOhJkWZbrvQkiIiIiIiIiIiIqT6Hoa34yn4iIaPnS1XsDREREREREREREVD4GdERERCsH/10nIiIiIiIiIiIiIiIiqiMGdkRERERERERERERERER1xMCOiIiIiIiIiIiIiIiIqI4Y2BERERERERERERERERHVEQM7IiIiIiIiIiIiIiIiojpiYEdERERERERERERERERURwzsiIj+H3v3+d1GmqUJ/omAdwRJ0ILeSiJlU96m0qjSdWVmZVV1VW31VHfvzE7vfNo5c/ac/VP2zPTOzlRXV29Vd9l0pfSZypRL+ZREiaToDegAEt5GxH6ACBJGJABSAkA+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KUUqlQqdnZ3o7OzclP2V0nue6bmX0vGnstkqUVl5JGnbRp6PWq1Ge3s72traNm2fhaRWq9HTsytpWz7PRRRFdHZ2oqOjI+3/SvW1ISIiWhZ9vPCn1WzCP+zqwG3nEm47F9cNGlRoNdhnK8fBqkpoNrHaUqPJgH+/ox0Plzy443RjzOdftwB7pU6L3ooyPFdVAYNq8yoDqAQBzWYjhlOCawKArg0sWuu2WjIG7No2WA4z1e4KK3aWl+H+ohv3XG5MZJntJACoM+rRbjGjt6IMlTpWTXkWimnsH6yqQKfVjBvzi7jrciO4Tsl8rShiZ7kFR6ork4J0Fo0aOlFEeINV3ah08Tz0ZIKykSXUREREREREREREVLIuzi7g65mFpG1/29WKemN6pSh3NIppfwhLkQhCjzMjtCoR5Vot6o36ZzZ5GpJkzAZDmA+FEYxJiMgy1IIAg1qFcq0G9UYDLBrmKWQjLMuYCYTgCkfgi8YSwVqNKEIjCrBoNKjQaWHTa6HbYpkspaiYxr4rHIEjEIIvFkNYkhCTFWhEERaNGtUGHeqNhk3JaqWtj+ehFQzYERERERERERERbVOZAnZ/09mCRlPp9vQlIiIqRVs7HElERERERERERERERERU5BiwIyIiIiIiIiIiIiIiIiogBuyIiIiIiIiIiIiIiIiICogBOyIiIiIiIiIiIiIiIqICYsCOiIiIiIiIiIiIiIiIqIAYsCMiIiIiIiIiIiIiIiIqIAbsiIiIiIiIiIiIiIiIiAqIATsiIiIiIiIiIiIiIiKiAmLAjoiIiIiIiIiIiIiIiKiAGLAjIiIiIiIiIiIiIiIiKiAG7IiIiIiIiIiIiIiIiIgKiAE7IiIiIiIiIiIiIiIiogISFEVRCn0QREREREREREREVBhyym2u8CciInr21IU+ACIiIiIiIiIiIiocBuiIiIgKj9/HRERERERERERERERERAXEgB0RERERERERERERERFRATFgR0RERERERERERERERFRADNgRERERERERERERERERFRADdkREREREREREREREREQFxIAdERERERERERERERERUQExYEdERERERERERERERERUQAzYERERERERERERERERERUQA3ZEREREREREREREREREBcSAHREREREREREREREREVEBMWBHREREREREREREREREVEAM2BEREREREREREREREREVEAN2RERERERERERERERERAXEgB0RERERERERERERERFRATFgR0RERERERERERERERFRADNgRERERERERERERERERFRADdkREREREREREREREREQFxIAdERERERERERERERERUQExYEdERERERERERERERERUQAzYERERERERERERERERERUQA3ZEREREREREREREREREBcSAHREREREREREREREREVEBMWBHREREREREREREREREVEAM2BEREREREREREREREREVEAN2RERERERERERERERERAXEgB0RERERERERERERERFRATFgR0RERERERET0/7dnxwIAAAAAg/yth7GnNAIAgJGwAwAAAAAAgJGwAwAAAAAAgJGwAwAAAAAAgJGwAwAAAAAAgJGwAwAAAAAAgFHkULNNoP3OGQAAAABJRU5ErkJggg==";

const CSS = `*{box-sizing:border-box}body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#111;font-size:14px;padding:0}.lh-header{text-align:center;padding:24px 40px 16px;border-bottom:3px solid #94cbd1;margin-bottom:8px}.lh-header img{max-width:420px;width:100%;height:auto}.lh-body{padding:24px 40px}.lh-footer{padding:16px 40px 20px;border-top:1px solid #d1d5db;margin-top:32px;font-size:11px;color:#6b7280}.lh-footer-row{display:flex;justify-content:space-between}h1{color:#5a9fa6;border-bottom:3px solid #94cbd1;padding-bottom:8px;margin-bottom:4px;margin-top:0}h2{color:#374151;margin-top:28px;margin-bottom:10px;font-size:15px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}.meta{color:#6b7280;font-size:12px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin:8px 0 16px}th{background:#e8f5f7;padding:7px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#5a9fa6}td{padding:7px 12px;border-bottom:1px solid #f3f4f6}.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}.bg{background:#e8f5f7;color:#5a9fa6}.gg{background:#dcfce7;color:#166534}.gr{background:#f3f4f6;color:#374151}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}.label{font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;margin-bottom:2px}.value{font-size:14px;color:#111827}.ni{padding:8px 12px;border-left:3px solid #94cbd1;background:#e8f5f7;margin:6px 0}.ni.complaint{border-color:#d7735a;background:#fdf0ed}.ni.compliment{border-color:#22c55e;background:#f8fff8}.nm{font-size:11px;color:#9ca3af;margin-top:3px}@media print{button{display:none}.lh-header{padding-top:0}}`;

const openReport = (title, html) => {
  const w = window.open("", "_blank");
  if (!w) { alert("Allow pop-ups to generate reports."); return; }
  const date = new Date().toLocaleDateString("en-ZA");
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>${CSS}</style></head><body><div class="lh-header"><img src="${LOGO_B64}" alt="Learn to Link" /></div><div class="lh-body"><div class="meta">Generated ${date}</div>${html}</div><div class="lh-footer"><div class="lh-footer-row"><span>Chanelle Peverett</span><span>Web: https://learntolink.co.za/</span></div><div class="lh-footer-row"><span>Cell: 083 632 1525</span><span>Email: admin@learntolink.co.za</span></div></div><script>window.onload=function(){window.print()}<\/script></body></html>`);
  w.document.close();
};

const badge = (text, cls) => `<span class="badge ${cls}">${text}</span>`;
const infoGrid = (items) => `<div class="info-grid">${items.map(([l,v]) => v ? `<div><div class="label">${l}</div><div class="value">${v}</div></div>` : "").join("")}</div>`;
const notesList = (notes) => notes.length === 0 ? "<p>No notes yet.</p>" : [...notes].sort((a,b) => b.date.localeCompare(a.date)).map(n =>
  `<div class="ni ${n.type}">${n.source === "parent" ? '<span style="background:#fef3c7;color:#92400e;font-size:10px;padding:1px 6px;border-radius:10px;font-weight:600;margin-right:6px;">🔒 From Parent — Admin Only</span>' : ""}<strong>${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</strong> · ${fmtDate(n.date)}<div>${n.note}</div></div>`
).join("");

const buildStudentReport = (student, data) => {
  const centre   = student.centreId ? data.centres.find(c => c.id === student.centreId) : null;
  const lks      = data.links.filter(l => l.studentId === student.id);
  const siblings = data.siblings.filter(s => s.studentId1 === student.id || s.studentId2 === student.id)
    .map(p => data.students.find(s => s.id === (p.studentId1 === student.id ? p.studentId2 : p.studentId1))).filter(Boolean);
  const purchases = data.purchases.filter(p => p.studentId === student.id);
  const total = purchases.reduce((a,p) => a + p.quantity, 0);
  const linkRows = lks.map(lk => {
    const t = data.tutors.find(x => x.id === lk.tutorId);
    const s = data.subjects.find(x => x.id === lk.subjectId);
    return `<tr><td>${s?.name||"—"}</td><td>${t ? t.firstName+" "+t.lastName : "—"}</td><td>${fmtDate(lk.createdDate)}</td></tr>`;
  }).join("");
  const purRows = [...purchases].sort((a,b)=>b.date.localeCompare(a.date)).map(p =>
    `<tr><td>${fmtDate(p.date)}</td><td>${p.quantity}</td><td>${p.note||"—"}</td></tr>`
  ).join("");
  return `<h1>Student Report</h1><h2>${student.firstName} ${student.lastName}</h2>
    ${infoGrid([["Status",badge(student.status, student.status==="Active"?"gg":"gr")],["Curriculum",student.curriculum],["Grade / Level",student.grade],["Date Enrolled",fmtDate(student.enrolledDate)],["Centre",centre?.name||"Individual"],[siblings.length?"Siblings":"",siblings.map(s=>s.firstName+" "+s.lastName).join(", ")]])}
    <h2>Tutor & Subject Links (${lks.length})</h2>
    ${lks.length>0?`<table><tr><th>Subject</th><th>Tutor</th><th>Since</th></tr>${linkRows}</table>`:"<p>No links yet.</p>"}
    <h2>Lesson Purchases — Total: ${total}</h2>
    ${purchases.length>0?`<table><tr><th>Date</th><th>Qty</th><th>Note</th></tr>${purRows}</table>`:"<p>No purchases recorded.</p>"}`;
};

const buildTutorReport = (tutor, data) => {
  const subjects = data.subjects.filter(s => tutor.subjectIds?.includes(s.id));
  const lks = data.links.filter(l => l.tutorId === tutor.id);
  const activeIds = [...new Set(lks.filter(l => data.students.find(s => s.id===l.studentId)?.status==="Active").map(l=>l.studentId))];
  const notes = data.tutorNotes.filter(n => n.tutorId === tutor.id);
  const stRows = activeIds.map(sid => {
    const st = data.students.find(s=>s.id===sid);
    const c  = st?.centreId ? data.centres.find(x=>x.id===st.centreId) : null;
    const subjs = [...new Set(lks.filter(l=>l.studentId===sid).map(l=>l.subjectId))].map(id=>data.subjects.find(s=>s.id===id)?.name).filter(Boolean).join(", ");
    return `<tr><td>${st?.firstName} ${st?.lastName}</td><td>${st?.curriculum}</td><td>${st?.grade}</td><td>${c?c.name:"<em>Individual</em>"}</td><td>${subjs}</td></tr>`;
  }).join("");
  return `<h1>Tutor Report</h1><h2>${tutor.firstName} ${tutor.lastName}</h2>
    ${infoGrid([["Status",badge(tutor.status,tutor.status==="Active"?"gg":"gr")],["Email",tutor.email],["Phone",tutor.phone],["Subjects",subjects.map(s=>s.name).join(", ")||"—"]])}
    <h2>Active Students (${activeIds.length})</h2>
    ${activeIds.length>0?`<table><tr><th>Name</th><th>Curriculum</th><th>Grade</th><th>Centre</th><th>Subjects</th></tr>${stRows}</table>`:"<p>No active students.</p>"}
    <h2>Notes (${notes.length})</h2>${notesList(notes)}`;
};

const buildCentreReport = (centre, data) => {
  const students = data.students.filter(s => s.centreId === centre.id);
  const notes = data.centreNotes.filter(n => n.centreId === centre.id);
  const stRows = students.map(st => {
    const lks = data.links.filter(l=>l.studentId===st.id);
    const subjs = [...new Set(lks.map(l=>l.subjectId))].map(id=>data.subjects.find(s=>s.id===id)?.name).filter(Boolean).join(", ");
    const tutors = [...new Set(lks.map(l=>l.tutorId))].map(id=>{const t=data.tutors.find(x=>x.id===id);return t?`${t.firstName} ${t.lastName}`:null;}).filter(Boolean).join(", ");
    return `<tr><td>${st.firstName} ${st.lastName}</td><td>${st.curriculum}</td><td>${st.grade}</td><td>${badge(st.status,st.status==="Active"?"gg":"gr")}</td><td>${subjs||"—"}</td><td>${tutors||"—"}</td></tr>`;
  }).join("");
  return `<h1>Centre Report</h1><h2>${centre.name}</h2>
    ${infoGrid([["Status",badge(centre.status,centre.status==="Active"?"gg":"gr")],["Owner",`${centre.ownerFirstName} ${centre.ownerLastName}`],["Email",centre.email],["Phone",centre.phone],["Address",centre.address||"—"],["Total Students",""+students.length]])}
    <h2>Students (${students.length})</h2>
    ${students.length>0?`<table><tr><th>Name</th><th>Curriculum</th><th>Grade</th><th>Status</th><th>Subjects</th><th>Tutors</th></tr>${stRows}</table>`:"<p>No students in this centre.</p>"}
    <h2>Notes (${notes.length})</h2>${notesList(notes)}`;
};

const buildCertificate = (student, course, completedDate) => {
  const html = `<div style="border:8px double #94cbd1;padding:70px 90px;text-align:center;min-height:560px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,serif">
    <p style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:.3em;margin:0 0 20px">LEARN TO LINK Academy</p>
    <div style="width:60px;height:4px;background:#d7735a;margin:0 auto 28px"></div>
    <h1 style="font-size:38px;color:#5a9fa6;margin:0 0 16px;font-weight:700;font-family:Georgia,serif">Certificate of Completion</h1>
    <p style="font-size:16px;color:#6b7280;margin:0 0 8px;font-family:Arial,sans-serif">This is to certify that</p>
    <p style="font-size:32px;font-weight:bold;color:#111827;margin:14px 0;border-bottom:2px solid #94cbd1;padding-bottom:14px;min-width:320px;font-family:Georgia,serif">${student.firstName} ${student.lastName}</p>
    <p style="font-size:16px;color:#6b7280;margin:16px 0 8px;font-family:Arial,sans-serif">has successfully completed the course</p>
    <p style="font-size:22px;font-weight:bold;color:#d7735a;margin:8px 0 32px;font-family:Arial,sans-serif">${course.title}</p>
    <p style="font-size:12px;color:#9ca3af;font-family:Arial,sans-serif">Completed ${fmtDate(completedDate)} &nbsp;·&nbsp; Issued by LEARN TO LINK Academy</p>
  </div>`;
  openReport(`Certificate — ${student.firstName} ${student.lastName}`, html);
};

// ─── LOGO MARK ────────────────────────────────────────────────────────────────

const LogoMark = ({ size = 36 }) => {
  // Two interlocked oval chain links — teal (left) weaves through grey (right)
  // Overlap centre at x=50. Left oval: x 10–58, right oval: x 42–90
  // teal back (right of x=50) drawn first, then full grey, then teal front (left of x=50)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="lm-front"><rect x="0" y="0" width="50" height="100"/></clipPath>
        <clipPath id="lm-back"><rect x="50" y="0" width="50" height="100"/></clipPath>
      </defs>
      {/* Teal oval — back half (right side, goes behind grey) */}
      <rect x="10" y="22" width="48" height="56" rx="28" stroke="#94cbd1" strokeWidth="11" clipPath="url(#lm-back)"/>
      {/* Grey oval — full (right link) */}
      <rect x="42" y="22" width="48" height="56" rx="28" stroke="#b5bec7" strokeWidth="11"/>
      {/* Teal oval — front half (left side, comes in front of grey) */}
      <rect x="10" y="22" width="48" height="56" rx="28" stroke="#94cbd1" strokeWidth="11" clipPath="url(#lm-front)"/>
    </svg>
  );
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────

const Badge = ({ children, color = "gray" }) => {
  const map = {
    gray:   "bg-gray-100 text-gray-700",
    green:  "bg-green-100 text-green-700",
    blue:   "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-800",
    red:    "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-teal-100 text-teal-700",
    orange: "bg-orange-100 text-orange-700",
    teal:   "bg-teal-100 text-teal-700",
    rose:   "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>;
};

const CURR_COLOR = { IEB: "teal", CAPS: "green", Cambridge: "purple" };

const Modal = ({ title, onClose, children, wide, extraWide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${extraWide ? "max-w-3xl" : wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, hint }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
const Inp = ({ label, hint, ...p }) => <Field label={label} hint={hint}><input className={inp} {...p} /></Field>;
const Sel = ({ label, options, placeholder, hint, ...p }) => (
  <Field label={label} hint={hint}>
    <select className={inp} {...p}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </Field>
);
const Txt = ({ label, hint, ...p }) => <Field label={label} hint={hint}><textarea className={inp} rows={3} {...p} /></Field>;

const Btn = ({ children, onClick, variant = "primary", size = "md", className = "", type = "button", disabled }) => {
  const sz = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" }[size];
  const vrMap = {
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger:    "bg-red-600 text-white hover:bg-red-700",
    ghost:     "text-gray-600 hover:bg-gray-100",
    success:   "bg-emerald-600 text-white hover:bg-emerald-700",
  };
  const vr = vrMap[variant] || "";
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-40 ${sz} ${vr} ${className}`}
      style={variant === "primary" ? { background: B.coral, color: "white" } : undefined}>
      {children}
    </button>
  );
};

const KPI = ({ title, value, sub, icon: Icon, color = "teal" }) => {
  const ic = {
    teal:   "text-white", coral: "text-white",
    gold:   "text-white", green: "bg-green-50 text-green-600",
    indigo: "text-white", amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600", rose: "bg-rose-50 text-rose-600",
  }[color] || "text-white";
  const bg = { teal: B.teal, coral: B.coral, gold: B.gold, indigo: B.tealDark }[color];
  return (
    <div className="rounded-xl p-5 shadow-sm border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${ic}`} style={bg ? { background: bg } : undefined}><Icon size={22} /></div>
      </div>
    </div>
  );
};

const TableWrap = ({ children }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
  </div>
);
const TH = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${className}`}>{children}</th>
);
const TD = ({ children, className = "" }) => <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
const TR = ({ children, onClick, className = "" }) => (
  <tr onClick={onClick}
    className={`border-b border-gray-100 last:border-0 ${onClick ? "cursor-pointer hover:bg-teal-50 transition-colors" : ""} ${className}`}>
    {children}
  </tr>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder={placeholder || "Search…"} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const Section = ({ title, children, action }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────

function Dashboard({ data, onNav }) {
  const { students, tutors, subjects, links, financials } = data;

  const activeStudents = students.filter(s => s.status === "Active").length;
  const months6 = useMemo(() => lastNMonths(6), []);

  const growthData = months6.map(m => ({
    month:       m.label,
    newStudents: students.filter(s => s.enrolledDate?.startsWith(m.key)).length,
    newSubjects: links.filter(l => l.createdDate?.startsWith(m.key)).length,
  }));

  // Profit summary
  const currentMonthKey = today().slice(0, 7);
  const currentFin = financials.find(f => f.month === currentMonthKey);
  const ytdFin = financials.filter(f => f.month.startsWith(today().slice(0, 4)));
  const ytdProfit = ytdFin.reduce((s, f) => s + (f.turnover - f.expenses), 0);
  const currentProfit = currentFin ? currentFin.turnover - currentFin.expenses : null;

  // Students per subject
  const subjectStats = subjects.map(s => ({
    name:  s.name,
    count: new Set(links.filter(l => l.subjectId === s.id).map(l => l.studentId)).size,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{fmtDate(today())}</p>
        </div>
        </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI title="Active Students"  value={activeStudents}  sub={`of ${students.length} total`}            icon={Users}       color="indigo" />
        <KPI title="Active Tutors"    value={tutors.filter(t => t.status === "Active").length}  sub="contractors" icon={GraduationCap} color="green" />
        <KPI title="Current Month Profit" value={currentProfit != null ? fmtZAR(currentProfit) : "—"} sub="turnover minus expenses" icon={TrendingUp} color="teal" />
        <KPI title="YTD Profit"       value={fmtZAR(ytdProfit)} sub={`${today().slice(0, 4)} year to date`}   icon={DollarSign}  color="purple" />
      </div>

      {/* Growth chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="New Students & New Subjects per Month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="newStudents" fill="#94cbd1" radius={[4,4,0,0]} name="New Students" />
              <Bar dataKey="newSubjects" fill="#22c55e" radius={[4,4,0,0]} name="New Subjects" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Active Students per Subject">
          <div className="space-y-3">
            {subjectStats.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-36 truncate">{s.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all"
                    style={{ width: `${activeStudents ? (s.count / activeStudents) * 100 : 0}%`, background: B.teal }} />
                </div>
                <span className="text-sm font-semibold text-gray-800 w-6 text-right">{s.count}</span>
              </div>
            ))}
            {subjectStats.every(s => s.count === 0) && <p className="text-sm text-gray-400">No links yet.</p>}
          </div>
        </Section>
      </div>

      {/* Profit trend */}
      {financials.length > 0 && (
        <Section title="Financial Trend (last months)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={financials.slice(-6).map(f => ({
              month:    fmtMonth(f.month),
              Turnover: f.turnover,
              Expenses: f.expenses,
              Profit:   f.turnover - f.expenses,
            }))}>
              <defs>
                <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmtZAR(v)} />
              <Legend />
              <Area type="monotone" dataKey="Profit"   stroke="#22c55e" fill="url(#gp)" strokeWidth={2} />
              <Line  type="monotone" dataKey="Turnover" stroke="#94cbd1" strokeWidth={1.5} dot={false} />
              <Line  type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Section>
      )}
    </div>
  );
}

// ─── PAGE: STUDENTS ───────────────────────────────────────────────────────────

function StudentsPage({ data, setData }) {
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(null);   // null | "add" | "edit" | "view" | "sibling" | "purchase"
  const [form,    setForm]    = useState({});
  const [groupBy, setGroupBy] = useState("none"); // "none" | "curriculum" | "grade"
  const [filterCurr, setFilterCurr] = useState("");

  const filtered = data.students.filter(s => {
    const q = search.toLowerCase();
    const match = `${s.firstName} ${s.lastName} ${s.grade} ${s.curriculum}`.toLowerCase().includes(q);
    const curr  = !filterCurr || s.curriculum === filterCurr;
    return match && curr;
  });

  // Grouping logic
  const grouped = useMemo(() => {
    if (groupBy === "curriculum") {
      return CURRICULA.map(c => ({ key: c, label: c, items: filtered.filter(s => s.curriculum === c) })).filter(g => g.items.length > 0);
    }
    if (groupBy === "grade") {
      const grades = [...new Set(filtered.map(s => s.grade))].sort();
      return grades.map(g => ({ key: g, label: g, items: filtered.filter(s => s.grade === g) }));
    }
    return [{ key: "all", label: "", items: filtered }];
  }, [filtered, groupBy]);

  const openAdd  = () => { setForm({ firstName: "", lastName: "", curriculum: "IEB", grade: "Grade 10", status: "Active", enrolledDate: today(), centreId: "" }); setModal("add"); };
  const openEdit = (s, e) => { e?.stopPropagation(); setForm({ ...s }); setModal("edit"); };
  const openView = (s) => { setForm({ ...s }); setModal("view"); };

  const save = () => {
    if (!form.firstName || !form.lastName) return;
    setData(d => ({
      ...d,
      students: modal === "add"
        ? [...d.students, { ...form, id: "st" + uid() }]
        : d.students.map(s => s.id === form.id ? form : s),
    }));
    setModal(null);
  };

  const remove = (id) => {
    setData(d => ({
      ...d,
      students:  d.students.filter(s => s.id !== id),
      links:     d.links.filter(l => l.studentId !== id),
      siblings:  d.siblings.filter(s => s.studentId1 !== id && s.studentId2 !== id),
      purchases: d.purchases.filter(p => p.studentId !== id),
    }));
    setModal(null);
  };

  const currOpts   = CURRICULA.map(c => ({ value: c, label: c }));
  const gradeOpts  = (form.curriculum ? CURRICULUM_GRADES[form.curriculum] || [] : CURRICULUM_GRADES.IEB)
    .map(g => ({ value: g, label: g }));
  const statusOpts  = [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }];
  const centreOpts  = [{ value: "", label: "Individual (no centre)" }, ...(data.centres || []).map(c => ({ value: c.id, label: c.name }))];

  const studentLinks     = (id) => data.links.filter(l => l.studentId === id);
  const studentSiblings  = (id) => {
    const pairs = data.siblings.filter(s => s.studentId1 === id || s.studentId2 === id);
    return pairs.map(p => data.students.find(s => s.id === (p.studentId1 === id ? p.studentId2 : p.studentId1))).filter(Boolean);
  };
  const studentPurchases = (id) => data.purchases.filter(p => p.studentId === id);

  const StudentRow = ({ s }) => {
    const lks     = studentLinks(s.id);
    const subjIds = [...new Set(lks.map(l => l.subjectId))];
    const total   = studentPurchases(s.id).reduce((a, p) => a + p.quantity, 0);
    const centre  = s.centreId ? data.centres?.find(c => c.id === s.centreId) : null;
    return (
      <TR onClick={() => openView(s)}>
        <TD className="font-medium">
          {s.firstName} {s.lastName}
          {centre && <span className="ml-2"><Badge color="teal"><Building2 size={10} className="inline mr-0.5" />{centre.name}</Badge></span>}
        </TD>
        <TD><Badge color={CURR_COLOR[s.curriculum]}>{s.curriculum}</Badge></TD>
        <TD>{s.grade}</TD>
        <TD><Badge color={s.status === "Active" ? "green" : "gray"}>{s.status}</Badge></TD>
        <TD>
          <div className="flex flex-wrap gap-1">
            {subjIds.map(sid => {
              const subj = data.subjects.find(x => x.id === sid);
              return subj ? <Badge key={sid} color="indigo">{subj.name}</Badge> : null;
            })}
            {subjIds.length === 0 && <span className="text-xs text-gray-400">—</span>}
          </div>
        </TD>
        <TD className="text-xs text-gray-500">{total > 0 ? `${total} lessons` : "—"}</TD>
        <TD><Btn size="sm" variant="ghost" onClick={e => openEdit(s, e)}><Edit2 size={13} /></Btn></TD>
      </TR>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data.students.filter(s => s.status === "Active").length} active · {data.students.length} total
          </p>
        </div>
        <Btn onClick={openAdd}><Plus size={15} /> Add Student</Btn>
      </div>

      {/* Filters & grouping */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" />
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {["none","curriculum","grade"].map(g => (
            <button key={g} onClick={() => setGroupBy(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${groupBy === g ? "bg-white shadow text-teal-700" : "text-gray-500 hover:text-gray-700"}`}>
              {g === "none" ? "List" : `By ${g}`}
            </button>
          ))}
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          value={filterCurr} onChange={e => setFilterCurr(e.target.value)}>
          <option value="">All curricula</option>
          {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table — flat or grouped */}
      {grouped.map(group => (
        <div key={group.key}>
          {groupBy !== "none" && (
            <div className="flex items-center gap-2 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700">{group.label}</h3>
              <Badge color="gray">{group.items.length}</Badge>
            </div>
          )}
          <TableWrap>
            <thead><tr>
              <TH>Name</TH><TH>Curriculum</TH><TH>Grade / Level</TH><TH>Status</TH><TH>Subjects</TH><TH>Lessons bought</TH><TH></TH>
            </tr></thead>
            <tbody>
              {group.items.map(s => <StudentRow key={s.id} s={s} />)}
              {group.items.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm text-gray-400 py-6">No students.</td></tr>
              )}
            </tbody>
          </TableWrap>
        </div>
      ))}

      {/* Add / Edit */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Student" : "Edit Student"} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-x-4">
            <Inp label="First Name" value={form.firstName || ""} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            <Inp label="Last Name"  value={form.lastName  || ""} onChange={e => setForm(f => ({ ...f, lastName:  e.target.value }))} />
          </div>
          <Sel label="Curriculum" options={currOpts} value={form.curriculum || "IEB"}
            onChange={e => setForm(f => ({ ...f, curriculum: e.target.value, grade: CURRICULUM_GRADES[e.target.value]?.[0] || "" }))} />
          <Sel label="Grade / Level" options={gradeOpts} value={form.grade || ""}
            onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
          <Sel label="Status" options={statusOpts} value={form.status || "Active"}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          <Inp label="Date Enrolled" type="date" value={form.enrolledDate || ""}
            onChange={e => setForm(f => ({ ...f, enrolledDate: e.target.value }))} />
          <Sel label="Centre" options={centreOpts} value={form.centreId || ""}
            onChange={e => setForm(f => ({ ...f, centreId: e.target.value }))} />
          <div className="flex items-center justify-between mt-2">
            {modal === "edit" && <Btn variant="danger" size="sm" onClick={() => remove(form.id)}><Trash2 size={13} /> Delete</Btn>}
            <div className="flex gap-3 ml-auto">
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save} disabled={!form.firstName || !form.lastName}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail view */}
      {modal === "view" && form.id && (
        <StudentDetailModal
          student={form} data={data} setData={setData}
          onClose={() => setModal(null)}
          onEdit={() => { setModal("edit"); }}
        />
      )}
    </div>
  );
}

function StudentDetailModal({ student, data, setData, onClose, onEdit }) {
  const [tab, setTab] = useState("links");
  const [purchaseForm, setPurchaseForm] = useState({ quantity: "", date: today(), note: "" });
  const [siblingId, setSiblingId] = useState("");

  const lks      = data.links.filter(l => l.studentId === student.id);
  const siblings = data.siblings.filter(s => s.studentId1 === student.id || s.studentId2 === student.id)
    .map(p => data.students.find(s => s.id === (p.studentId1 === student.id ? p.studentId2 : p.studentId1))).filter(Boolean);
  const purchases = data.purchases.filter(p => p.studentId === student.id);
  const totalLessons = purchases.reduce((a, p) => a + p.quantity, 0);

  const addPurchase = () => {
    if (!purchaseForm.quantity) return;
    setData(d => ({ ...d, purchases: [...d.purchases, { ...purchaseForm, id: "lp" + uid(), studentId: student.id, quantity: Number(purchaseForm.quantity) }] }));
    setPurchaseForm({ quantity: "", date: today(), note: "" });
  };

  const removePurchase = (id) => setData(d => ({ ...d, purchases: d.purchases.filter(p => p.id !== id) }));

  const addSibling = () => {
    if (!siblingId || data.siblings.some(s =>
      (s.studentId1 === student.id && s.studentId2 === siblingId) ||
      (s.studentId1 === siblingId  && s.studentId2 === student.id)
    )) return;
    setData(d => ({ ...d, siblings: [...d.siblings, { id: "sib" + uid(), studentId1: student.id, studentId2: siblingId }] }));
    setSiblingId("");
  };

  const removeSibling = (otherId) => {
    setData(d => ({
      ...d,
      siblings: d.siblings.filter(s =>
        !((s.studentId1 === student.id && s.studentId2 === otherId) ||
          (s.studentId1 === otherId  && s.studentId2 === student.id))
      ),
    }));
  };

  const removeLink = (id) => setData(d => ({ ...d, links: d.links.filter(l => l.id !== id) }));

  const siblingOpts = data.students
    .filter(s => s.id !== student.id && !siblings.some(x => x.id === s.id))
    .map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }));

  return (
    <Modal title={`${student.firstName} ${student.lastName}`} onClose={onClose} wide>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ background: B.teal }}>
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
            <Badge color={student.status === "Active" ? "green" : "gray"}>{student.status}</Badge>
            <Badge color={CURR_COLOR[student.curriculum]}>{student.curriculum}</Badge>
          </div>
          <p className="text-sm text-gray-500">{student.grade} · Enrolled {fmtDate(student.enrolledDate)}</p>
          {student.centreId && data.centres?.find(c => c.id === student.centreId) && (
            <p className="text-xs text-teal-600 mt-0.5 flex items-center gap-1">
              <Building2 size={11} /> {data.centres.find(c => c.id === student.centreId).name}
            </p>
          )}
          {siblings.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              Sibling{siblings.length > 1 ? "s" : ""}: {siblings.map(s => s.firstName).join(", ")}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Lessons Bought</p>
          <p className="text-2xl font-bold" style={{ color: B.tealDark }}>{totalLessons}</p>
          <Btn size="sm" variant="ghost" onClick={onEdit}><Edit2 size={13} /> Edit</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {["links","lessons","siblings"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${tab === t ? "bg-white shadow text-teal-700" : "text-gray-500 hover:text-gray-700"}`}>
            {t} {t === "links" && `(${lks.length})`}
            {t === "lessons" && `(${purchases.length})`}
            {t === "siblings" && `(${siblings.length})`}
          </button>
        ))}
      </div>

      {tab === "links" && (
        <div className="space-y-2">
          {lks.map(lk => {
            const tutor = data.tutors.find(t => t.id === lk.tutorId);
            const subj  = data.subjects.find(s => s.id === lk.subjectId);
            return (
              <div key={lk.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {tutor?.firstName[0]}{tutor?.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tutor?.firstName} {tutor?.lastName}</p>
                    <p className="text-xs text-gray-400">Since {fmtDate(lk.createdDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="indigo">{subj?.name}</Badge>
                  <Btn size="sm" variant="ghost" onClick={() => removeLink(lk.id)}><X size={13} /></Btn>
                </div>
              </div>
            );
          })}
          {lks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No links yet.</p>}
        </div>
      )}

      {tab === "lessons" && (
        <div className="space-y-3">
          <div className="flex gap-2 p-3 bg-gray-50 rounded-xl">
            <input className={`${inp} flex-1`} type="number" min={1} placeholder="Quantity" value={purchaseForm.quantity} onChange={e => setPurchaseForm(f => ({ ...f, quantity: e.target.value }))} />
            <input className={`${inp} w-36`} type="date" value={purchaseForm.date} onChange={e => setPurchaseForm(f => ({ ...f, date: e.target.value }))} />
            <input className={`${inp} flex-1`} placeholder="Note (optional)" value={purchaseForm.note} onChange={e => setPurchaseForm(f => ({ ...f, note: e.target.value }))} />
            <Btn onClick={addPurchase} disabled={!purchaseForm.quantity}><Plus size={14} /></Btn>
          </div>
          {purchases.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No lesson purchases recorded.</p>}
          {[...purchases].sort((a, b) => b.date.localeCompare(a.date)).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.quantity} lessons</p>
                <p className="text-xs text-gray-400">{fmtDate(p.date)}{p.note ? ` · ${p.note}` : ""}</p>
              </div>
              <Btn size="sm" variant="ghost" onClick={() => removePurchase(p.id)}><Trash2 size={13} className="text-red-400" /></Btn>
            </div>
          ))}
        </div>
      )}

      {tab === "siblings" && (
        <div className="space-y-3">
          {siblingOpts.length > 0 && (
            <div className="flex gap-2 p-3 bg-gray-50 rounded-xl">
              <select className={`${inp} flex-1`} value={siblingId} onChange={e => setSiblingId(e.target.value)}>
                <option value="">Select sibling to link…</option>
                {siblingOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <Btn onClick={addSibling} disabled={!siblingId}>Link</Btn>
            </div>
          )}
          {siblings.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: B.teal }}>
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-gray-400">{s.curriculum} · {s.grade}</p>
                </div>
              </div>
              <Btn size="sm" variant="ghost" onClick={() => removeSibling(s.id)}><X size={13} /></Btn>
            </div>
          ))}
          {siblings.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No siblings linked.</p>}
        </div>
      )}
    </Modal>
  );
}

// ─── PAGE: TUTORS ─────────────────────────────────────────────────────────────

function TutorsPage({ data, setData }) {
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null); // null | "add" | "edit" | "view"
  const [form,   setForm]   = useState({});

  const filtered = data.tutors.filter(t =>
    `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ firstName: "", lastName: "", email: "", phone: "", subjectIds: [], status: "Active" }); setModal("add"); };
  const openEdit = (t, e) => { e?.stopPropagation(); setForm({ ...t }); setModal("edit"); };
  const openView = (t) => { setForm({ ...t }); setModal("view"); };

  const save = () => {
    if (!form.firstName || !form.lastName) return;
    setData(d => ({
      ...d,
      tutors: modal === "add"
        ? [...d.tutors, { ...form, id: "t" + uid() }]
        : d.tutors.map(t => t.id === form.id ? form : t),
    }));
    setModal(null);
  };

  const remove = (id) => {
    setData(d => ({
      ...d,
      tutors:     d.tutors.filter(t => t.id !== id),
      links:      d.links.filter(l => l.tutorId !== id),
      tutorNotes: d.tutorNotes.filter(n => n.tutorId !== id),
    }));
    setModal(null);
  };

  const toggleSubject = (sid) => {
    setForm(f => ({
      ...f,
      subjectIds: f.subjectIds?.includes(sid)
        ? f.subjectIds.filter(x => x !== sid)
        : [...(f.subjectIds || []), sid],
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tutors</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.tutors.filter(t => t.status === "Active").length} active</p>
        </div>
        <Btn onClick={openAdd}><Plus size={15} /> Add Tutor</Btn>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search tutors…" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t => {
          const subjects       = data.subjects.filter(s => t.subjectIds?.includes(s.id));
          const lks            = data.links.filter(l => l.tutorId === t.id);
          const activeStudents = [...new Set(
            lks.filter(l => data.students.find(s => s.id === l.studentId)?.status === "Active").map(l => l.studentId)
          )].length;
          const notes = data.tutorNotes.filter(n => n.tutorId === t.id);
          const hasComplaint = notes.some(n => n.type === "complaint");
          return (
            <div key={t.id} onClick={() => openView(t)}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  {t.firstName[0]}{t.lastName[0]}
                </div>
                <div className="flex items-center gap-1">
                  <Badge color={t.status === "Active" ? "green" : "gray"}>{t.status}</Badge>
                  {hasComplaint && <Badge color="red">⚠ Note</Badge>}
                  <Btn size="sm" variant="ghost" onClick={e => openEdit(t, e)}><Edit2 size={13} /></Btn>
                </div>
              </div>
              <p className="font-semibold text-gray-900">{t.firstName} {t.lastName}</p>
              <p className="text-xs text-gray-500 mb-3">{t.email}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {subjects.map(s => <Badge key={s.id} color="indigo">{s.name}</Badge>)}
                {subjects.length === 0 && <span className="text-xs text-gray-400">No subjects</span>}
              </div>
              <div className="border-t border-gray-100 pt-3 flex gap-4 text-xs text-gray-500">
                <span>
                  <span className="text-xl font-bold text-gray-900">{activeStudents}</span>
                  <span className="ml-1">active student{activeStudents !== 1 ? "s" : ""}</span>
                </span>
                <span>{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="col-span-3 text-center text-sm text-gray-400 py-10">No tutors found.</div>}
      </div>

      {/* Add / Edit */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Tutor" : "Edit Tutor"} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-x-4">
            <Inp label="First Name" value={form.firstName || ""} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            <Inp label="Last Name"  value={form.lastName  || ""} onChange={e => setForm(f => ({ ...f, lastName:  e.target.value }))} />
          </div>
          <Inp label="Email" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Inp label="Phone" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Sel label="Status" options={[{ value:"Active",label:"Active"},{ value:"Inactive",label:"Inactive"}]}
            value={form.status || "Active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          <Field label="Can teach (subjects)">
            <div className="flex flex-wrap gap-2 mt-1">
              {data.subjects.map(s => (
                <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.subjectIds?.includes(s.id) ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"}`}
                  style={form.subjectIds?.includes(s.id) ? { background: B.teal, borderColor: B.teal } : undefined}>
                  {s.name}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex items-center justify-between mt-4">
            {modal === "edit" && <Btn variant="danger" size="sm" onClick={() => remove(form.id)}><Trash2 size={13} /></Btn>}
            <div className="flex gap-3 ml-auto">
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save} disabled={!form.firstName || !form.lastName}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Tutor detail with notes */}
      {modal === "view" && form.id && (
        <TutorDetailModal tutor={form} data={data} setData={setData} onClose={() => setModal(null)} onEdit={() => openEdit(form)} />
      )}
    </div>
  );
}

function TutorDetailModal({ tutor, data, setData, onClose, onEdit }) {
  const [noteForm, setNoteForm] = useState({ type: "compliment", note: "", date: today() });
  const notes = data.tutorNotes.filter(n => n.tutorId === tutor.id);
  const lks   = data.links.filter(l => l.tutorId === tutor.id);
  const activeStudents = [...new Set(
    lks.filter(l => data.students.find(s => s.id === l.studentId)?.status === "Active").map(l => l.studentId)
  )];

  const addNote = () => {
    if (!noteForm.note) return;
    setData(d => ({ ...d, tutorNotes: [...d.tutorNotes, { ...noteForm, id: "tn" + uid(), tutorId: tutor.id, source: "admin" }] }));
    setNoteForm({ type: "compliment", note: "", date: today() });
  };
  const removeNote = (id) => setData(d => ({ ...d, tutorNotes: d.tutorNotes.filter(n => n.id !== id) }));

  const noteIcon = { compliment: <ThumbsUp size={14} className="text-green-500" />, complaint: <ThumbsDown size={14} className="text-red-500" />, general: <StickyNote size={14} className="text-gray-400" /> };
  const noteColor = { compliment: "green", complaint: "red", general: "gray" };

  return (
    <Modal title={`${tutor.firstName} ${tutor.lastName}`} onClose={onClose} wide>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
          {tutor.firstName[0]}{tutor.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{tutor.firstName} {tutor.lastName}</p>
            <Badge color={tutor.status === "Active" ? "green" : "gray"}>{tutor.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">{tutor.email} · {tutor.phone}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.subjects.filter(s => tutor.subjectIds?.includes(s.id)).map(s => <Badge key={s.id} color="indigo">{s.name}</Badge>)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold" style={{ color: B.tealDark }}>{activeStudents.length}</p>
          <p className="text-xs text-gray-400">active students</p>
          <Btn size="sm" variant="ghost" className="mt-1" onClick={onEdit}><Edit2 size={13} /> Edit</Btn>
        </div>
      </div>

      {/* Active students list */}
      {activeStudents.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Students</p>
          <div className="flex flex-wrap gap-2">
            {activeStudents.map(sid => {
              const st   = data.students.find(s => s.id === sid);
              const subjIds = [...new Set(lks.filter(l => l.studentId === sid).map(l => l.subjectId))];
              return st ? (
                <div key={sid} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <span className="font-medium">{st.firstName} {st.lastName}</span>
                  {subjIds.map(id => {
                    const subj = data.subjects.find(x => x.id === id);
                    return subj ? <Badge key={id} color="indigo">{subj.name}</Badge> : null;
                  })}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Notes ({notes.length})</p>
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl flex-wrap">
          <select className={`${inp} w-36`} value={noteForm.type} onChange={e => setNoteForm(f => ({ ...f, type: e.target.value }))}>
            {NOTE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <input className={`${inp} flex-1`} placeholder="Write note…" value={noteForm.note} onChange={e => setNoteForm(f => ({ ...f, note: e.target.value }))} />
          <input className={`${inp} w-36`} type="date" value={noteForm.date} onChange={e => setNoteForm(f => ({ ...f, date: e.target.value }))} />
          <Btn onClick={addNote} disabled={!noteForm.note}><Plus size={14} /> Add</Btn>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {notes.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No notes yet.</p>}
          {[...notes].sort((a, b) => b.date.localeCompare(a.date)).map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-3 border rounded-xl ${n.source === "parent" ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
              <div className="mt-0.5">{noteIcon[n.type]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge color={noteColor[n.type]}>{n.type}</Badge>
                  {n.source === "parent" && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">🔒 From Parent — Admin Only</span>
                  )}
                  <span className="text-xs text-gray-400">{fmtDate(n.date)}</span>
                </div>
                <p className="text-sm text-gray-700">{n.note}</p>
              </div>
              <Btn size="sm" variant="ghost" onClick={() => removeNote(n.id)}><Trash2 size={12} className="text-red-400" /></Btn>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── PAGE: LINKS ──────────────────────────────────────────────────────────────

function LinksPage({ data, setData }) {
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({ studentId: "", tutorId: "", subjectId: "", createdDate: today() });
  const [filterStudent, setFilterStudent] = useState("");
  const [filterTutor,   setFilterTutor]   = useState("");

  const filtered = data.links.filter(lk =>
    (!filterStudent || lk.studentId === filterStudent) &&
    (!filterTutor   || lk.tutorId   === filterTutor)
  );

  const eligibleSubjects = form.tutorId
    ? data.subjects.filter(s => data.tutors.find(t => t.id === form.tutorId)?.subjectIds?.includes(s.id))
    : data.subjects;

  const isDuplicate = data.links.some(l =>
    l.studentId === form.studentId && l.tutorId === form.tutorId && l.subjectId === form.subjectId
  );

  const addLink = () => {
    if (!form.studentId || !form.tutorId || !form.subjectId || isDuplicate) return;
    setData(d => ({ ...d, links: [...d.links, { ...form, id: "lk" + uid() }] }));
    setModal(false);
    setForm({ studentId: "", tutorId: "", subjectId: "", createdDate: today() });
  };

  const removeLink = (id) => setData(d => ({ ...d, links: d.links.filter(l => l.id !== id) }));

  const studentOpts = data.students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName} (${s.curriculum} · ${s.grade})` }));
  const tutorOpts   = data.tutors.map(t => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }));
  const subjOpts    = eligibleSubjects.map(s => ({ value: s.id, label: s.name }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student–Tutor Links</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.links.length} link{data.links.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setModal(true)}><Plus size={15} /> Add Link</Btn>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <select className={`${inp} w-52`} value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
          <option value="">All students</option>
          {data.students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
        <select className={`${inp} w-48`} value={filterTutor} onChange={e => setFilterTutor(e.target.value)}>
          <option value="">All tutors</option>
          {data.tutors.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
        </select>
        {(filterStudent || filterTutor) && (
          <Btn size="sm" variant="ghost" onClick={() => { setFilterStudent(""); setFilterTutor(""); }}>
            <X size={13} /> Clear
          </Btn>
        )}
      </div>

      <TableWrap>
        <thead><tr><TH>Student</TH><TH>Curriculum</TH><TH>Grade</TH><TH>Tutor</TH><TH>Subject</TH><TH>Since</TH><TH></TH></tr></thead>
        <tbody>
          {filtered.map(lk => {
            const st    = data.students.find(s => s.id === lk.studentId);
            const tutor = data.tutors.find(t => t.id === lk.tutorId);
            const subj  = data.subjects.find(s => s.id === lk.subjectId);
            return (
              <TR key={lk.id}>
                <TD className="font-medium">{st?.firstName} {st?.lastName}</TD>
                <TD><Badge color={CURR_COLOR[st?.curriculum]}>{st?.curriculum}</Badge></TD>
                <TD className="text-xs text-gray-500">{st?.grade}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {tutor?.firstName[0]}{tutor?.lastName[0]}
                    </div>
                    {tutor?.firstName} {tutor?.lastName}
                  </div>
                </TD>
                <TD><Badge color="indigo">{subj?.name}</Badge></TD>
                <TD className="text-xs text-gray-400">{fmtDate(lk.createdDate)}</TD>
                <TD><Btn size="sm" variant="ghost" onClick={() => removeLink(lk.id)}><Trash2 size={13} className="text-red-400" /></Btn></TD>
              </TR>
            );
          })}
          {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-sm text-gray-400 py-8">No links.</td></tr>}
        </tbody>
      </TableWrap>

      {modal && (
        <Modal title="Add Link" onClose={() => setModal(false)}>
          <Sel label="Student" options={studentOpts} placeholder="Select student…"
            value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
          <Sel label="Tutor" options={tutorOpts} placeholder="Select tutor…"
            value={form.tutorId} onChange={e => setForm(f => ({ ...f, tutorId: e.target.value, subjectId: "" }))} />
          <Sel label="Subject" options={subjOpts} placeholder={form.tutorId ? "Select subject…" : "Select a tutor first…"}
            value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
            disabled={!form.tutorId} />
          <Inp label="Start Date" type="date" value={form.createdDate}
            onChange={e => setForm(f => ({ ...f, createdDate: e.target.value }))} />
          {isDuplicate && <p className="text-xs text-red-600 -mt-2 mb-3">This link already exists.</p>}
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={addLink} disabled={!form.studentId || !form.tutorId || !form.subjectId || isDuplicate}>Add Link</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: ACCOUNTING ─────────────────────────────────────────────────────────

function AccountingPage({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});

  const sorted = [...data.financials].sort((a, b) => b.month.localeCompare(a.month));
  const ytd    = data.financials.filter(f => f.month.startsWith(today().slice(0, 4)));
  const ytdTurnover = ytd.reduce((s, f) => s + f.turnover, 0);
  const ytdExpenses = ytd.reduce((s, f) => s + f.expenses, 0);

  // Payroll: compute per-month and YTD totals from invoiceStatus
  const payrollByMonth = {};
  ((data.invoiceStatus || []).filter(s => s.paid)).forEach(s => {
    payrollByMonth[s.month] = (payrollByMonth[s.month] || 0) + Number(s.paidAmount || 0);
  });
  const ytdPayroll = Object.entries(payrollByMonth)
    .filter(([m]) => m.startsWith(today().slice(0, 4)))
    .reduce((sum, [, v]) => sum + v, 0);
  const ytdExpensesTotal = ytdExpenses + ytdPayroll;
  const ytdProfit = ytdTurnover - ytdExpensesTotal;

  // Payroll detail: per tutor, for paid invoices
  const paidInvoices = (data.invoiceStatus || []).filter(s => s.paid);
  const payrollMonths = [...new Set(paidInvoices.map(s => s.month))].sort((a, b) => b.localeCompare(a));

  const openAdd = () => {
    const m = today().slice(0, 7);
    setForm({ month: m, turnover: "", expenses: "" });
    setModal("add");
  };

  const save = () => {
    if (!form.month || form.turnover === "" || form.expenses === "") return;
    const entry = { ...form, id: form.id || "fin" + uid(), turnover: Number(form.turnover), expenses: Number(form.expenses) };
    setData(d => ({
      ...d,
      financials: form.id
        ? d.financials.map(f => f.id === form.id ? entry : f)
        : [...d.financials, entry],
    }));
    setModal(null);
  };

  const remove = (id) => setData(d => ({ ...d, financials: d.financials.filter(f => f.id !== id) }));

  const chartData = [...data.financials].sort((a,b) => a.month.localeCompare(b.month)).slice(-12).map(f => ({
    month:    fmtMonth(f.month),
    Turnover: f.turnover,
    Expenses: f.expenses,
    Profit:   f.turnover - f.expenses,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manual monthly overview — turnover minus expenses</p>
        </div>
        <Btn onClick={openAdd}><Plus size={15} /> Add Month</Btn>
      </div>

      {/* YTD summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPI title="YTD Turnover"  value={fmtZAR(ytdTurnover)}      sub={today().slice(0, 4)} icon={TrendingUp}  color="indigo" />
        <KPI title="YTD Expenses"  value={fmtZAR(ytdExpenses)}      sub="manual entries"      icon={DollarSign}  color="rose"   />
        <KPI title="YTD Payroll"   value={fmtZAR(ytdPayroll)}       sub="paid tutor invoices" icon={Banknote}    color="amber"  />
        <KPI title="YTD Profit"    value={fmtZAR(ytdProfit)}        sub="after payroll"       icon={CheckCircle} color={ytdProfit >= 0 ? "green" : "rose"} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Section title="Turnover vs Expenses vs Profit">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmtZAR(v)} />
              <Legend />
              <Bar dataKey="Turnover" fill="#94cbd1" radius={[4,4,0,0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="Profit"   fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Table */}
      <TableWrap>
        <thead><tr>
          <TH>Month</TH><TH className="text-right">Turnover</TH><TH className="text-right">Expenses</TH><TH className="text-right">Profit</TH><TH>Margin</TH><TH></TH>
        </tr></thead>
        <tbody>
          {sorted.map(f => {
            const profit = f.turnover - f.expenses;
            const margin = f.turnover ? ((profit / f.turnover) * 100).toFixed(1) : 0;
            return (
              <TR key={f.id}>
                <TD className="font-medium">{fmtMonth(f.month)}</TD>
                <TD className="text-right">{fmtZAR(f.turnover)}</TD>
                <TD className="text-right text-red-600">{fmtZAR(f.expenses)}</TD>
                <TD className={`text-right font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmtZAR(profit)}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${profit >= 0 ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(Math.abs(Number(margin)), 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{margin}%</span>
                  </div>
                </TD>
                <TD>
                  <div className="flex gap-1">
                    <Btn size="sm" variant="ghost" onClick={() => { setForm({ ...f }); setModal("edit"); }}><Edit2 size={13} /></Btn>
                    <Btn size="sm" variant="ghost" onClick={() => remove(f.id)}><Trash2 size={13} className="text-red-400" /></Btn>
                  </div>
                </TD>
              </TR>
            );
          })}
          {sorted.length === 0 && <tr><td colSpan={6} className="text-center text-sm text-gray-400 py-8">No entries yet.</td></tr>}
        </tbody>
      </TableWrap>

      {/* Tutor Payroll section */}
      {payrollMonths.length > 0 && (
        <Section title="Tutor Payroll Paid">
          {payrollMonths.map(m => {
            const monthPaid = paidInvoices.filter(s => s.month === m);
            return (
              <div key={m} className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{fmtMonth(m)}</p>
                <TableWrap>
                  <thead><tr>
                    <TH>Tutor</TH><TH>Email</TH><TH className="text-right">Amount Paid</TH><TH>Date Paid</TH>
                  </tr></thead>
                  <tbody>
                    {monthPaid.map(s => {
                      const t = (data.tutors || []).find(x => x.id === s.tutorId);
                      return (
                        <TR key={s.id}>
                          <TD className="font-medium">{t ? `${t.firstName} ${t.lastName}` : s.tutorId}</TD>
                          <TD className="text-gray-500">{t?.email || "—"}</TD>
                          <TD className="text-right font-semibold text-red-600">{fmtZAR(Number(s.paidAmount || 0))}</TD>
                          <TD>{s.paidDate ? fmtDate(s.paidDate) : "—"}</TD>
                        </TR>
                      );
                    })}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-4 py-2 text-xs font-semibold text-gray-500 text-right">Month Total</td>
                      <td className="px-4 py-2 text-right font-bold text-red-700">{fmtZAR(payrollByMonth[m] || 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </TableWrap>
              </div>
            );
          })}
        </Section>
      )}

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Month" : "Edit Month"} onClose={() => setModal(null)}>
          <Inp label="Month" type="month" value={form.month || ""} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} />
          <Inp label="Turnover (R)" type="number" min={0} value={form.turnover} onChange={e => setForm(f => ({ ...f, turnover: e.target.value }))} />
          <Inp label="Expenses (R)" type="number" min={0} value={form.expenses} onChange={e => setForm(f => ({ ...f, expenses: e.target.value }))} />
          {form.turnover !== "" && form.expenses !== "" && (
            <div className={`p-3 rounded-lg text-sm font-medium mb-4 ${(form.turnover - form.expenses) >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              Profit: {fmtZAR(Number(form.turnover) - Number(form.expenses))}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={!form.month || form.turnover === "" || form.expenses === ""}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: STATS ─────────────────────────────────────────────────────────────

function StatsPage({ data }) {
  const { students, tutors, subjects, links, purchases } = data;

  const activeStudents = students.filter(s => s.status === "Active");

  const subjectStats = subjects.map(s => ({
    name:    s.name,
    total:   new Set(links.filter(l => l.subjectId === s.id).map(l => l.studentId)).size,
    active:  new Set(
      links.filter(l => l.subjectId === s.id && activeStudents.some(st => st.id === l.studentId)).map(l => l.studentId)
    ).size,
  })).sort((a, b) => b.active - a.active);

  const tutorLoad = tutors.map(t => {
    const tLinks   = links.filter(l => l.tutorId === t.id);
    const actCount = new Set(tLinks.filter(l => activeStudents.some(s => s.id === l.studentId)).map(l => l.studentId)).size;
    return { name: t.firstName, active: actCount, total: new Set(tLinks.map(l => l.studentId)).size };
  }).sort((a, b) => b.active - a.active);

  const currSplit = CURRICULA.map(c => ({
    name:  c,
    value: activeStudents.filter(s => s.curriculum === c).length,
  })).filter(x => x.value > 0);

  const gradeSplit = [...new Set(activeStudents.map(s => s.grade))]
    .map(g => ({ name: g, value: activeStudents.filter(s => s.grade === g).length }))
    .sort((a, b) => b.value - a.value);

  const months6 = lastNMonths(6);
  const purchaseTrend = months6.map(m => ({
    month:   m.label,
    lessons: purchases.filter(p => p.date?.startsWith(m.key)).reduce((s, p) => s + p.quantity, 0),
    students: new Set(purchases.filter(p => p.date?.startsWith(m.key)).map(p => p.studentId)).size,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stats</h1>
        <p className="text-sm text-gray-500 mt-0.5">Operational snapshot</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI title="Total Active Students" value={activeStudents.length}         icon={Users}         color="indigo" />
        <KPI title="IEB Students"          value={activeStudents.filter(s=>s.curriculum==="IEB").length}       icon={BookOpen} color="indigo" sub="IEB" />
        <KPI title="CAPS Students"         value={activeStudents.filter(s=>s.curriculum==="CAPS").length}      icon={BookOpen} color="green"  sub="CAPS" />
        <KPI title="Cambridge Students"    value={activeStudents.filter(s=>s.curriculum==="Cambridge").length} icon={BookOpen} color="purple" sub="Cambridge" />
      </div>

      {/* Subject breakdown */}
      <Section title="Active Students per Subject">
        <div className="space-y-3">
          {subjectStats.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-40 truncate">{s.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full"
                  style={{ width: `${activeStudents.length ? (s.active / activeStudents.length) * 100 : 0}%`, background: B.teal }} />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{s.active}</span>
              <span className="text-xs text-gray-400 w-16">of {activeStudents.length}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Tutor Active Student Count">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tutorLoad} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" fill="#94cbd1" radius={[4,4,0,0]} name="Active Students" />
              <Bar dataKey="total"  fill="#cbd5e1" radius={[4,4,0,0]} name="Total Students"  />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Students by Curriculum">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={currSplit} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine>
                {currSplit.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Students by Grade / Level">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradeSplit} barSize={18} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
              <Tooltip />
              <Bar dataKey="value" fill="#94cbd1" radius={[0,4,4,0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Lesson Purchases per Month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={purchaseTrend} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="lessons"  fill="#94cbd1" radius={[4,4,0,0]} name="Lessons bought" />
              <Bar dataKey="students" fill="#22c55e" radius={[4,4,0,0]} name="Students buying" />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Full subject table */}
      <Section title="Full Subject Breakdown">
        <TableWrap>
          <thead><tr><TH>Subject</TH><TH>Active Students</TH><TH>Total Students</TH><TH>Tutors</TH></tr></thead>
          <tbody>
            {subjectStats.map(s => {
              const tutorCount = new Set(links.filter(l => l.subjectId === data.subjects.find(x => x.name === s.name)?.id).map(l => l.tutorId)).size;
              return (
                <TR key={s.name}>
                  <TD className="font-medium">{s.name}</TD>
                  <TD><span className="font-semibold" style={{ color: B.tealDark }}>{s.active}</span></TD>
                  <TD>{s.total}</TD>
                  <TD>{tutorCount}</TD>
                </TR>
              );
            })}
          </tbody>
        </TableWrap>
      </Section>
    </div>
  );
}

// ─── PAGE: SETTINGS ───────────────────────────────────────────────────────────

function SettingsPage({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});

  const saveSubject = () => {
    if (!form.name) return;
    setData(d => ({
      ...d,
      subjects: form.id
        ? d.subjects.map(s => s.id === form.id ? form : s)
        : [...d.subjects, { ...form, id: "s" + uid() }],
    }));
    setModal(null);
  };

  const removeSubject = (id) => setData(d => ({
    ...d,
    subjects: d.subjects.filter(s => s.id !== id),
    links:    d.links.filter(l => l.subjectId !== id),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage subjects and configuration</p>
      </div>

      <Section title="Subjects" action={
        <Btn size="sm" onClick={() => { setForm({ name: "" }); setModal("subject"); }}>
          <Plus size={14} /> Add
        </Btn>
      }>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.subjects.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
              </div>
              <div className="flex gap-1">
                <Btn size="sm" variant="ghost" onClick={() => { setForm(s); setModal("subject"); }}><Edit2 size={13} /></Btn>
                <Btn size="sm" variant="ghost" onClick={() => removeSubject(s.id)}><Trash2 size={13} className="text-red-400" /></Btn>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Curricula & Grades (read-only reference)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CURRICULA.map(c => (
            <div key={c}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                <Badge color={CURR_COLOR[c]}>{c}</Badge>
              </p>
              <div className="flex flex-wrap gap-1">
                {CURRICULUM_GRADES[c].map(g => <span key={g} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{g}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {modal === "subject" && (
        <Modal title={form.id ? "Edit Subject" : "Add Subject"} onClose={() => setModal(null)}>
          <Inp label="Name" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveSubject} disabled={!form.name}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: ACADEMY (LMS) ─────────────────────────────────────────────────────

function AcademyPage({ data, setData }) {
  const [tab, setTab] = useState("courses");
  const TABS = [
    { id: "courses",    label: "Courses",    icon: BookOpen     },
    { id: "enrolments", label: "Enrolments", icon: Users        },
    { id: "gradebook",  label: "Grade Book", icon: Award        },
    { id: "calendar",   label: "Calendar",   icon: CalendarDays },
  ];
  const activeEnrolments = data.enrolments.filter(e => e.status === "Active").length;
  const completions      = data.progress.filter(p => p.completed).length;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${B.tealDark} 0%, ${B.coral} 100%)` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">LEARN TO LINK Academy</h1>
            <p className="text-white text-opacity-80 text-sm mt-0.5">Learning Management System</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Courses",     value: data.courses.length },
            { label: "Lessons",     value: data.lessons.length },
            { label: "Enrolments",  value: activeEnrolments },
            { label: "Completions", value: completions },
          ].map(k => (
            <div key={k.label} className="bg-white bg-opacity-15 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-white text-opacity-80 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${tab === t.id ? "bg-white shadow text-teal-700" : "text-gray-500 hover:text-gray-700"}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>
      {tab === "courses"    && <CoursesTab    data={data} setData={setData} />}
      {tab === "enrolments" && <EnrolmentsTab data={data} setData={setData} />}
      {tab === "gradebook"  && <GradeBookTab  data={data} setData={setData} />}
      {tab === "calendar"   && <CalendarTab   data={data} />}
    </div>
  );
}

// ── Courses Tab ───────────────────────────────────────────────────────────────

function CoursesTab({ data, setData }) {
  const [modal, setModal]           = useState(null);
  const [form,  setForm]            = useState({});
  const [detailCourse, setDetail]   = useState(null);

  const save = () => {
    if (!form.title) return;
    setData(d => ({
      ...d,
      courses: modal === "add"
        ? [...d.courses, { ...form, id: "cr" + uid(), createdDate: today() }]
        : d.courses.map(c => c.id === form.id ? form : c),
    }));
    setModal(null);
  };

  const remove = (id) => {
    setData(d => ({
      ...d,
      courses: d.courses.filter(c => c.id !== id),
      modules: d.modules.filter(m => m.courseId !== id),
      lessons: d.lessons.filter(l => l.courseId !== id),
      quizzes: d.quizzes.filter(q => q.courseId !== id),
      enrolments: d.enrolments.filter(e => e.courseId !== id),
      progress:   d.progress.filter(p => p.courseId !== id),
      announcements: d.announcements.filter(a => a.courseId !== id),
    }));
    setModal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Btn onClick={() => { setForm({ title: "", description: "", subjectId: "", status: "Draft", color: "#94cbd1" }); setModal("add"); }}>
          <Plus size={15} /> New Course
        </Btn>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.courses.map(c => {
          const lessons    = data.lessons.filter(l => l.courseId === c.id);
          const enrolCount = data.enrolments.filter(e => e.courseId === c.id && e.status === "Active").length;
          const subject    = data.subjects.find(s => s.id === c.subjectId);
          return (
            <div key={c.id} onClick={() => setDetail(c)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
              <div className="h-1.5" style={{ background: c.color || "#94cbd1" }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <Badge color={c.status === "Published" ? "green" : c.status === "Archived" ? "gray" : "yellow"}>{c.status}</Badge>
                    <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setForm({ ...c }); setModal("edit"); }}><Edit2 size={13} /></Btn>
                  </div>
                </div>
                {subject && <div className="mb-2"><Badge color="indigo">{subject.name}</Badge></div>}
                <div className="flex gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span><strong className="text-gray-900">{lessons.length}</strong> lessons</span>
                  <span><strong className="text-gray-900">{enrolCount}</strong> enrolled</span>
                  <span><strong className="text-gray-900">{data.announcements.filter(a => a.courseId === c.id).length}</strong> announcements</span>
                </div>
              </div>
            </div>
          );
        })}
        {data.courses.length === 0 && <div className="col-span-2 text-center text-sm text-gray-400 py-10">No courses yet — create your first course!</div>}
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Course" : "Edit Course"} onClose={() => setModal(null)}>
          <Inp label="Course Title" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Txt label="Description" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Sel label="Subject (optional)" value={form.subjectId || ""}
            options={[{ value: "", label: "No subject" }, ...data.subjects.map(s => ({ value: s.id, label: s.name }))]}
            onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} />
          <Sel label="Status" value={form.status || "Draft"}
            options={[{ value:"Draft",label:"Draft"},{value:"Published",label:"Published"},{value:"Archived",label:"Archived"}]}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          <Field label="Course Colour">
            <input type="color" value={form.color || "#94cbd1"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300" />
          </Field>
          <div className="flex items-center justify-between mt-4">
            {modal === "edit" && <Btn variant="danger" size="sm" onClick={() => remove(form.id)}><Trash2 size={13} /> Delete</Btn>}
            <div className="flex gap-3 ml-auto">
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save} disabled={!form.title}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {detailCourse && (
        <CourseDetailModal course={detailCourse} data={data} setData={setData} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

// ── Course Detail Modal ───────────────────────────────────────────────────────

function CourseDetailModal({ course, data, setData, onClose }) {
  const [tab,      setTab]      = useState("content");
  const [modModal, setModModal] = useState(null);
  const [modForm,  setModForm]  = useState({});
  const [lesModal, setLesModal] = useState(null);
  const [lesForm,  setLesForm]  = useState({});
  const [annModal, setAnnModal] = useState(false);
  const [annForm,  setAnnForm]  = useState({ title: "", body: "", date: today() });
  const [expanded, setExpanded] = useState(null);

  const modules       = data.modules.filter(m => m.courseId === course.id).sort((a,b) => a.order - b.order);
  const announcements = data.announcements.filter(a => a.courseId === course.id).sort((a,b) => b.date.localeCompare(a.date));
  const enrolled      = data.enrolments.filter(e => e.courseId === course.id && e.status === "Active");
  const allLessons    = data.lessons.filter(l => l.courseId === course.id);

  const saveModule = () => {
    if (!modForm.title) return;
    setData(d => ({
      ...d,
      modules: modModal === "addMod"
        ? [...d.modules, { ...modForm, id: "mod" + uid(), courseId: course.id, order: d.modules.filter(m => m.courseId === course.id).length + 1 }]
        : d.modules.map(m => m.id === modForm.id ? modForm : m),
    }));
    setModModal(null);
  };

  const removeModule = (id) => setData(d => ({
    ...d,
    modules: d.modules.filter(m => m.id !== id),
    lessons: d.lessons.filter(l => l.moduleId !== id),
    progress: d.progress.filter(p => !d.lessons.filter(l => l.moduleId === id).some(l => l.id === p.lessonId)),
  }));

  const saveLesson = () => {
    if (!lesForm.title) return;
    setData(d => ({
      ...d,
      lessons: lesModal === "addLes"
        ? [...d.lessons, { ...lesForm, id: "les" + uid(), courseId: course.id }]
        : d.lessons.map(l => l.id === lesForm.id ? lesForm : l),
    }));
    setLesModal(null);
  };

  const removeLesson = (id) => setData(d => ({
    ...d,
    lessons:  d.lessons.filter(l => l.id !== id),
    quizzes:  d.quizzes.filter(q => q.lessonId !== id),
    progress: d.progress.filter(p => p.lessonId !== id),
  }));

  const addAnn = () => {
    if (!annForm.title) return;
    setData(d => ({ ...d, announcements: [...d.announcements, { ...annForm, id: "ann" + uid(), courseId: course.id }] }));
    setAnnForm({ title: "", body: "", date: today() });
    setAnnModal(false);
  };

  return (
    <Modal title={course.title} onClose={onClose} extraWide>
      <div className="h-1.5 -mx-6 mb-5 rounded-sm" style={{ background: course.color || "#94cbd1", marginTop: "-20px" }} />

      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg">
        {["content","announcements","students"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${tab === t ? "bg-white shadow text-teal-700" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "content" ? `Content (${allLessons.length})` : t === "announcements" ? `Announcements (${announcements.length})` : `Enrolled (${enrolled.length})`}
          </button>
        ))}
      </div>

      {/* ── Content tab */}
      {tab === "content" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Btn size="sm" onClick={() => { setModForm({ title: "" }); setModModal("addMod"); }}><Plus size={13} /> Add Module</Btn>
          </div>
          {modules.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No modules yet. Add a module to get started.</p>}
          {modules.map(mod => {
            const lessons = data.lessons.filter(l => l.moduleId === mod.id).sort((a,b) => a.order - b.order);
            const isOpen  = expanded === mod.id || expanded === null;
            return (
              <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer select-none"
                  onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">{mod.order}.</span>
                    <p className="font-semibold text-gray-800 text-sm">{mod.title}</p>
                    <Badge color="gray">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setLesForm({ title: "", content: "", videoUrl: "", fileName: "", fileUrl: "", dueDate: "", order: lessons.length + 1, moduleId: mod.id }); setLesModal("addLes"); }}><Plus size={13} /></Btn>
                    <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setModForm({ ...mod }); setModModal("editMod"); }}><Edit2 size={13} /></Btn>
                    <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); removeModule(mod.id); }}><Trash2 size={13} className="text-red-400" /></Btn>
                  </div>
                </div>
                {isOpen && (
                  <div className="divide-y divide-gray-100">
                    {lessons.map(l => {
                      const hasQuiz = data.quizzes.some(q => q.lessonId === l.id);
                      return (
                        <div key={l.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 group">
                          <span className="text-xs text-gray-400 w-4">{l.order}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-medium truncate">{l.title}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {l.videoUrl  && <Badge color="blue"><Play size={9} className="inline mr-0.5" />Video</Badge>}
                              {l.fileName  && <Badge color="orange">📎 {l.fileName}</Badge>}
                              {hasQuiz     && <Badge color="purple">✎ Quiz</Badge>}
                              {l.dueDate   && <span className="text-xs text-gray-400">Due {fmtDate(l.dueDate)}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Btn size="sm" variant="ghost" onClick={() => { setLesForm({ ...l }); setLesModal("editLes"); }}><Edit2 size={13} /></Btn>
                            <Btn size="sm" variant="ghost" onClick={() => removeLesson(l.id)}><Trash2 size={13} className="text-red-400" /></Btn>
                          </div>
                        </div>
                      );
                    })}
                    {lessons.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No lessons — click + to add one.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Announcements tab */}
      {tab === "announcements" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Btn size="sm" onClick={() => { setAnnForm({ title: "", body: "", date: today() }); setAnnModal(true); }}><Plus size={13} /> Post</Btn>
          </div>
          {announcements.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No announcements yet.</p>}
          {announcements.map(a => (
            <div key={a.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{fmtDate(a.date)}</p>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => setData(d => ({ ...d, announcements: d.announcements.filter(x => x.id !== a.id) }))}><Trash2 size={13} className="text-red-400" /></Btn>
              </div>
              <p className="text-sm text-gray-600 mt-2">{a.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Enrolled students tab */}
      {tab === "students" && (
        <div className="space-y-2">
          {enrolled.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No students enrolled in this course.</p>}
          {enrolled.map(e => {
            const st     = data.students.find(s => s.id === e.studentId);
            const done   = data.progress.filter(p => p.studentId === e.studentId && p.courseId === course.id && p.completed).length;
            const pct    = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;
            const scores = data.progress.filter(p => p.studentId === e.studentId && p.courseId === course.id && p.quizScore != null).map(p => p.quizScore);
            const avg    = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
            const centre = st?.centreId ? data.centres?.find(c => c.id === st.centreId) : null;
            return (
              <div key={e.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: B.teal }}>
                  {st?.firstName[0]}{st?.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{st?.firstName} {st?.lastName}</p>
                  <p className="text-xs text-gray-400">{st?.curriculum} · {st?.grade}{centre ? ` · ${centre.name}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-600">{pct}%</span>
                  </div>
                  {avg != null && <Badge color="teal">{avg}% avg</Badge>}
                  {pct === 100 && <Badge color="green">✓ Complete</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Module modal */}
      {(modModal === "addMod" || modModal === "editMod") && (
        <Modal title={modModal === "addMod" ? "Add Module" : "Edit Module"} onClose={() => setModModal(null)}>
          <Inp label="Module Title" value={modForm.title || ""} onChange={e => setModForm(f => ({ ...f, title: e.target.value }))} />
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setModModal(null)}>Cancel</Btn>
            <Btn onClick={saveModule} disabled={!modForm.title}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* Lesson modal */}
      {(lesModal === "addLes" || lesModal === "editLes") && (
        <Modal title={lesModal === "addLes" ? "Add Lesson" : "Edit Lesson"} onClose={() => setLesModal(null)} wide>
          <Inp label="Lesson Title" value={lesForm.title || ""} onChange={e => setLesForm(f => ({ ...f, title: e.target.value }))} />
          <Txt label="Content / Notes" value={lesForm.content || ""} onChange={e => setLesForm(f => ({ ...f, content: e.target.value }))} hint="Lesson notes, theory text or instructions" />
          <Inp label="Video URL (YouTube / Vimeo)" value={lesForm.videoUrl || ""} onChange={e => setLesForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=…" />
          <div className="grid grid-cols-2 gap-x-4">
            <Inp label="File name (display)" value={lesForm.fileName || ""} onChange={e => setLesForm(f => ({ ...f, fileName: e.target.value }))} placeholder="Worksheet.pdf" />
            <Inp label="File URL (link)" value={lesForm.fileUrl || ""} onChange={e => setLesForm(f => ({ ...f, fileUrl: e.target.value }))} placeholder="https://…" />
          </div>
          <Inp label="Due Date" type="date" value={lesForm.dueDate || ""} onChange={e => setLesForm(f => ({ ...f, dueDate: e.target.value }))} />
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setLesModal(null)}>Cancel</Btn>
            <Btn onClick={saveLesson} disabled={!lesForm.title}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* Announcement modal */}
      {annModal && (
        <Modal title="Post Announcement" onClose={() => setAnnModal(false)}>
          <Inp label="Title" value={annForm.title || ""} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))} />
          <Txt label="Message" value={annForm.body || ""} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))} />
          <Inp label="Date" type="date" value={annForm.date || ""} onChange={e => setAnnForm(f => ({ ...f, date: e.target.value }))} />
          <div className="flex justify-end gap-3 mt-2">
            <Btn variant="secondary" onClick={() => setAnnModal(false)}>Cancel</Btn>
            <Btn onClick={addAnn} disabled={!annForm.title}>Post</Btn>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

// ── Enrolments Tab ────────────────────────────────────────────────────────────

function EnrolmentsTab({ data, setData }) {
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState({ type: "student", studentId: "", centreId: "", courseId: "" });

  const enrol = () => {
    if (!form.courseId) return;
    const ids = form.type === "centre"
      ? data.students.filter(s => s.centreId === form.centreId).map(s => s.id)
      : [form.studentId].filter(Boolean);
    const newEnrols = ids
      .filter(sid => !data.enrolments.some(e => e.studentId === sid && e.courseId === form.courseId))
      .map(sid => ({ id: "en" + uid(), studentId: sid, courseId: form.courseId, enrolledDate: today(), status: "Active" }));
    setData(d => ({ ...d, enrolments: [...d.enrolments, ...newEnrols] }));
    setModal(false);
    setForm({ type: "student", studentId: "", centreId: "", courseId: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{data.enrolments.length} total enrolment{data.enrolments.length !== 1 ? "s" : ""}</p>
        <Btn onClick={() => setModal(true)}><Plus size={15} /> Enrol</Btn>
      </div>
      <TableWrap>
        <thead><tr><TH>Student</TH><TH>Course</TH><TH>Centre</TH><TH>Enrolled</TH><TH>Progress</TH><TH>Avg Score</TH><TH></TH></tr></thead>
        <tbody>
          {data.enrolments.map(e => {
            const st      = data.students.find(s => s.id === e.studentId);
            const course  = data.courses.find(c => c.id === e.courseId);
            const centre  = st?.centreId ? data.centres?.find(c => c.id === st.centreId) : null;
            const lessons = data.lessons.filter(l => l.courseId === e.courseId);
            const done    = data.progress.filter(p => p.studentId === e.studentId && p.courseId === e.courseId && p.completed).length;
            const pct     = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            const scores  = data.progress.filter(p => p.studentId === e.studentId && p.courseId === e.courseId && p.quizScore != null).map(p => p.quizScore);
            const avg     = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
            return (
              <TR key={e.id}>
                <TD className="font-medium">{st?.firstName} {st?.lastName}</TD>
                <TD className="text-sm">{course?.title}</TD>
                <TD className="text-xs text-gray-500">{centre?.name || "Individual"}</TD>
                <TD className="text-xs text-gray-400">{fmtDate(e.enrolledDate)}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-600">{pct}%</span>
                  </div>
                </TD>
                <TD>{avg != null ? <span className={`text-sm font-semibold ${avg >= 75 ? "text-green-600" : avg >= 50 ? "text-amber-600" : "text-red-600"}`}>{avg}%</span> : <span className="text-xs text-gray-400">—</span>}</TD>
                <TD><Btn size="sm" variant="ghost" onClick={() => setData(d => ({ ...d, enrolments: d.enrolments.filter(x => x.id !== e.id) }))}><Trash2 size={13} className="text-red-400" /></Btn></TD>
              </TR>
            );
          })}
          {data.enrolments.length === 0 && <tr><td colSpan={7} className="text-center text-sm text-gray-400 py-8">No enrolments yet.</td></tr>}
        </tbody>
      </TableWrap>

      {modal && (
        <Modal title="Enrol Student(s)" onClose={() => setModal(false)}>
          <div className="flex gap-2 mb-4">
            {[{ v: "student", l: "Individual Student" }, { v: "centre", l: "Whole Centre" }].map(t => (
              <button key={t.v} onClick={() => setForm(f => ({ ...f, type: t.v }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.type === t.v ? "border-transparent" : "border-gray-300 text-gray-600 hover:border-teal-400"}`}
                style={form.type === t.v ? { borderColor: B.teal, background: B.tealLight, color: B.tealDark } : undefined}>
                {t.l}
              </button>
            ))}
          </div>
          {form.type === "student" && (
            <Sel label="Student" placeholder="Select student…" value={form.studentId}
              options={data.students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }))}
              onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
          )}
          {form.type === "centre" && (
            <>
              <Sel label="Centre" placeholder="Select centre…" value={form.centreId}
                options={data.centres.map(c => ({ value: c.id, label: c.name }))}
                onChange={e => setForm(f => ({ ...f, centreId: e.target.value }))} />
              {form.centreId && <p className="text-xs text-gray-500 -mt-2 mb-3">{data.students.filter(s => s.centreId === form.centreId).length} students will be enrolled.</p>}
            </>
          )}
          <Sel label="Course" placeholder="Select course…" value={form.courseId}
            options={data.courses.map(c => ({ value: c.id, label: c.title }))}
            onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} />
          <div className="flex justify-end gap-3 mt-4">
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={enrol} disabled={!form.courseId || (form.type === "student" ? !form.studentId : !form.centreId)}>Enrol</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Grade Book Tab ────────────────────────────────────────────────────────────

function GradeBookTab({ data, setData }) {
  const [studentId, setStudentId] = useState("");
  const [editScore, setEditScore] = useState(null); // { lessonId, courseId, value }

  const student = data.students.find(s => s.id === studentId);
  const enrolledCourses = studentId
    ? data.enrolments.filter(e => e.studentId === studentId && e.status === "Active").map(e => data.courses.find(c => c.id === e.courseId)).filter(Boolean)
    : [];

  const toggleComplete = (lessonId, courseId) => {
    const existing = data.progress.find(p => p.studentId === studentId && p.lessonId === lessonId);
    if (existing) {
      setData(d => ({ ...d, progress: d.progress.map(p => p.id === existing.id ? { ...p, completed: !p.completed, completedDate: !p.completed ? today() : null } : p) }));
    } else {
      setData(d => ({ ...d, progress: [...d.progress, { id: "pg" + uid(), studentId, lessonId, courseId, completed: true, completedDate: today(), quizScore: null }] }));
    }
  };

  const saveScore = () => {
    if (!editScore) return;
    const { lessonId, courseId, value } = editScore;
    const score = value === "" ? null : Math.min(100, Math.max(0, Number(value)));
    const existing = data.progress.find(p => p.studentId === studentId && p.lessonId === lessonId);
    if (existing) {
      setData(d => ({ ...d, progress: d.progress.map(p => p.id === existing.id ? { ...p, quizScore: score } : p) }));
    } else {
      setData(d => ({ ...d, progress: [...d.progress, { id: "pg" + uid(), studentId, lessonId, courseId, completed: false, completedDate: null, quizScore: score }] }));
    }
    setEditScore(null);
  };

  const courseData = enrolledCourses.map(course => {
    const lessons    = data.lessons.filter(l => l.courseId === course.id);
    const rows       = lessons.map(l => {
      const prog  = data.progress.find(p => p.studentId === studentId && p.lessonId === l.id);
      const hasQz = data.quizzes.some(q => q.lessonId === l.id);
      return { ...l, completed: prog?.completed || false, completedDate: prog?.completedDate, quizScore: prog?.quizScore ?? null, hasQuiz: hasQz };
    });
    const done   = rows.filter(r => r.completed).length;
    const scores = rows.filter(r => r.quizScore != null).map(r => r.quizScore);
    const avg    = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
    return { course, rows, done, total: lessons.length, avg };
  });

  const overallAvg = courseData.filter(c => c.avg != null).length
    ? Math.round(courseData.filter(c => c.avg != null).reduce((a,c)=>a+c.avg,0) / courseData.filter(c=>c.avg!=null).length)
    : null;

  const enrolledStudents = data.students.filter(s => data.enrolments.some(e => e.studentId === s.id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select className={`${inp} w-64`} value={studentId} onChange={e => setStudentId(e.target.value)}>
          <option value="">Select a student…</option>
          {enrolledStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
        {overallAvg != null && (
          <div className="px-4 py-2 rounded-xl border" style={{ background: B.tealLight, borderColor: "#c2e5e9" }}>
            <span className="text-sm font-medium" style={{ color: B.tealDark }}>Overall Average: </span>
            <span className="text-lg font-bold" style={{ color: B.tealDark }}>{overallAvg}%</span>
          </div>
        )}
        {student && courseData.some(c => c.done === c.total && c.total > 0) && (
          <Btn size="sm" variant="secondary" onClick={() => {
            const c = courseData.find(x => x.done === x.total && x.total > 0);
            const e = data.enrolments.find(x => x.studentId === studentId && x.courseId === c.course.id);
            buildCertificate(student, c.course, e?.enrolledDate || today());
          }}>
            <Award size={14} /> Certificate
          </Btn>
        )}
      </div>

      {!studentId && <p className="text-sm text-gray-400 text-center py-12">Select a student to view their grade book.</p>}

      {courseData.map(({ course, rows, done, total, avg }) => (
        <Section key={course.id} title={course.title} action={
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{done}/{total} done</span>
            {avg != null && <Badge color="teal">{avg}% avg</Badge>}
            <div className="w-24 bg-gray-100 rounded-full h-2">
              <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${total ? (done/total)*100 : 0}%` }} />
            </div>
          </div>
        }>
          <TableWrap>
            <thead><tr><TH>Lesson</TH><TH>Due</TH><TH>Status</TH><TH>Quiz Score</TH><TH>Completed</TH></tr></thead>
            <tbody>
              {rows.map(r => (
                <TR key={r.id}>
                  <TD className="font-medium">{r.title}</TD>
                  <TD className="text-xs">{r.dueDate ? fmtDate(r.dueDate) : "—"}</TD>
                  <TD>
                    <button onClick={() => toggleComplete(r.id, course.id)} className="focus:outline-none">
                      {r.completed
                        ? <Badge color="green">✓ Done</Badge>
                        : r.dueDate && r.dueDate < today()
                          ? <Badge color="red">Overdue</Badge>
                          : <Badge color="gray">Pending</Badge>
                      }
                    </button>
                  </TD>
                  <TD>
                    {r.hasQuiz ? (
                      editScore?.lessonId === r.id
                        ? <div className="flex items-center gap-1">
                            <input type="number" min={0} max={100} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs"
                              value={editScore.value} onChange={e => setEditScore(s => ({ ...s, value: e.target.value }))} />
                            <Btn size="sm" onClick={saveScore}>✓</Btn>
                            <Btn size="sm" variant="ghost" onClick={() => setEditScore(null)}>✕</Btn>
                          </div>
                        : <button onClick={() => setEditScore({ lessonId: r.id, courseId: course.id, value: r.quizScore ?? "" })}
                            className={`text-sm font-semibold hover:underline ${r.quizScore != null ? (r.quizScore >= 75 ? "text-green-600" : r.quizScore >= 50 ? "text-amber-600" : "text-red-600") : "text-gray-400"}`}>
                            {r.quizScore != null ? `${r.quizScore}%` : "Enter score"}
                          </button>
                    ) : <span className="text-xs text-gray-400">No quiz</span>}
                  </TD>
                  <TD className="text-xs text-gray-400">{r.completedDate ? fmtDate(r.completedDate) : "—"}</TD>
                </TR>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="text-center text-sm text-gray-400 py-4">No lessons yet.</td></tr>}
            </tbody>
          </TableWrap>
        </Section>
      ))}
    </div>
  );
}

// ── Calendar Tab ──────────────────────────────────────────────────────────────

function CalendarTab({ data }) {
  const [viewDate,       setViewDate]       = useState(new Date());
  const [filterStudent,  setFilterStudent]  = useState("");

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const dayKey = d => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const dueLessons = data.lessons.filter(l => {
    if (!l.dueDate) return false;
    if (!filterStudent) return true;
    return data.enrolments.some(e => e.studentId === filterStudent && e.courseId === l.courseId);
  });

  const onDay = d => dueLessons.filter(l => l.dueDate === dayKey(d));

  const enrolledStudents = data.students.filter(s => data.enrolments.some(e => e.studentId === s.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select className={`${inp} w-56`} value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
          <option value="">All students</option>
          {enrolledStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} /></button>
          <h3 className="font-semibold text-gray-900">{viewDate.toLocaleString("en-ZA", { month: "long", year: "numeric" })}</h3>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-100">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const lessons   = d ? onDay(d) : [];
            const isToday   = d && dayKey(d) === today();
            return (
              <div key={i} className={`min-h-[80px] p-1.5 border-r border-b border-gray-100 ${(i + 1) % 7 === 0 ? "border-r-0" : ""} ${!d ? "bg-gray-50" : ""}`}>
                {d && (
                  <>
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "text-white" : "text-gray-600"}`} style={isToday ? { background: B.coral } : undefined}>{d}</span>
                    {lessons.slice(0, 2).map(l => {
                      const course = data.courses.find(c => c.id === l.courseId);
                      return (
                        <div key={l.id} title={l.title} className="text-xs rounded px-1 py-0.5 mb-0.5 truncate text-white"
                          style={{ background: course?.color || "#94cbd1" }}>
                          {l.title}
                        </div>
                      );
                    })}
                    {lessons.length > 2 && <div className="text-xs text-gray-400">+{lessons.length - 2}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Section title="Upcoming Due Dates">
        <div className="space-y-2">
          {dueLessons.filter(l => l.dueDate >= today()).sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 10).map(l => {
            const course = data.courses.find(c => c.id === l.courseId);
            const mod    = data.modules.find(m => m.id === l.moduleId);
            return (
              <div key={l.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: course?.color || "#94cbd1" }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{l.title}</p>
                  <p className="text-xs text-gray-400">{course?.title} · {mod?.title}</p>
                </div>
                <Badge color="purple">{fmtDate(l.dueDate)}</Badge>
              </div>
            );
          })}
          {dueLessons.filter(l => l.dueDate >= today()).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No upcoming due dates.</p>}
        </div>
      </Section>
    </div>
  );
}

// ─── PAGE: CENTRES ───────────────────────────────────────────────────────────

function CentresPage({ data, setData }) {
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState({});

  const filtered = data.centres.filter(c =>
    `${c.name} ${c.ownerFirstName} ${c.ownerLastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ name: "", ownerFirstName: "", ownerLastName: "", email: "", phone: "", address: "", status: "Active" }); setModal("add"); };
  const openEdit = (c, e) => { e?.stopPropagation(); setForm({ ...c }); setModal("edit"); };
  const openView = (c) => { setForm({ ...c }); setModal("view"); };

  const save = () => {
    if (!form.name) return;
    setData(d => ({
      ...d,
      centres: modal === "add"
        ? [...d.centres, { ...form, id: "c" + uid() }]
        : d.centres.map(c => c.id === form.id ? form : c),
    }));
    setModal(null);
  };

  const remove = (id) => {
    setData(d => ({
      ...d,
      centres:     d.centres.filter(c => c.id !== id),
      centreNotes: d.centreNotes.filter(n => n.centreId !== id),
      students:    d.students.map(s => s.centreId === id ? { ...s, centreId: "" } : s),
    }));
    setModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centres</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.centres.filter(c => c.status === "Active").length} active</p>
        </div>
        <Btn onClick={openAdd}><Plus size={15} /> Add Centre</Btn>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search centres…" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map(c => {
          const students     = data.students.filter(s => s.centreId === c.id);
          const activeCount  = students.filter(s => s.status === "Active").length;
          const subjIds      = [...new Set(data.links.filter(l => students.some(s => s.id === l.studentId)).map(l => l.subjectId))];
          const notes        = data.centreNotes.filter(n => n.centreId === c.id);
          const hasComplaint = notes.some(n => n.type === "complaint");
          return (
            <div key={c.id} onClick={() => openView(c)}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                  <Building2 size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <Badge color={c.status === "Active" ? "green" : "gray"}>{c.status}</Badge>
                  {hasComplaint && <Badge color="red">⚠ Note</Badge>}
                  <Btn size="sm" variant="ghost" onClick={e => openEdit(c, e)}><Edit2 size={13} /></Btn>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-base">{c.name}</p>
              <p className="text-sm text-gray-500 mb-1">{c.ownerFirstName} {c.ownerLastName}</p>
              {c.address && <p className="text-xs text-gray-400 flex items-center gap-1 mb-3"><MapPin size={10} /> {c.address}</p>}
              <div className="border-t border-gray-100 pt-3 flex gap-5 text-xs text-gray-500">
                <span><span className="text-xl font-bold text-gray-900">{activeCount}</span> active student{activeCount !== 1 ? "s" : ""}</span>
                <span>{subjIds.length} subject{subjIds.length !== 1 ? "s" : ""}</span>
                <span>{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="col-span-2 text-center text-sm text-gray-400 py-10">No centres found.</div>}
      </div>

      {/* Add / Edit */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Centre" : "Edit Centre"} onClose={() => setModal(null)}>
          <Inp label="Centre Name" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-x-4">
            <Inp label="Owner First Name" value={form.ownerFirstName || ""} onChange={e => setForm(f => ({ ...f, ownerFirstName: e.target.value }))} />
            <Inp label="Owner Last Name"  value={form.ownerLastName  || ""} onChange={e => setForm(f => ({ ...f, ownerLastName:  e.target.value }))} />
          </div>
          <Inp label="Email"   type="email" value={form.email   || ""} onChange={e => setForm(f => ({ ...f, email:   e.target.value }))} />
          <Inp label="Phone"               value={form.phone   || ""} onChange={e => setForm(f => ({ ...f, phone:   e.target.value }))} />
          <Inp label="Address"             value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          <Sel label="Status" options={[{ value:"Active",label:"Active"},{ value:"Inactive",label:"Inactive"}]}
            value={form.status || "Active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          <div className="flex items-center justify-between mt-4">
            {modal === "edit" && <Btn variant="danger" size="sm" onClick={() => remove(form.id)}><Trash2 size={13} /> Delete</Btn>}
            <div className="flex gap-3 ml-auto">
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save} disabled={!form.name}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === "view" && form.id && (
        <CentreDetailModal centre={form} data={data} setData={setData}
          onClose={() => setModal(null)} onEdit={() => openEdit(form)} />
      )}
    </div>
  );
}

function CentreDetailModal({ centre, data, setData, onClose, onEdit }) {
  const [tab, setTab] = useState("students");
  const [noteForm, setNoteForm] = useState({ type: "general", note: "", date: today() });

  const students = data.students.filter(s => s.centreId === centre.id);
  const notes    = data.centreNotes.filter(n => n.centreId === centre.id);

  const addNote = () => {
    if (!noteForm.note) return;
    setData(d => ({ ...d, centreNotes: [...d.centreNotes, { ...noteForm, id: "cn" + uid(), centreId: centre.id }] }));
    setNoteForm({ type: "general", note: "", date: today() });
  };
  const removeNote = (id) => setData(d => ({ ...d, centreNotes: d.centreNotes.filter(n => n.id !== id) }));

  const noteIcon  = { compliment: <ThumbsUp size={14} className="text-green-500" />, complaint: <ThumbsDown size={14} className="text-red-500" />, general: <StickyNote size={14} className="text-gray-400" /> };
  const noteColor = { compliment: "green", complaint: "red", general: "gray" };

  return (
    <Modal title={centre.name} onClose={onClose} wide>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
          <Building2 size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{centre.ownerFirstName} {centre.ownerLastName}</p>
            <Badge color={centre.status === "Active" ? "green" : "gray"}>{centre.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">{centre.email} · {centre.phone}</p>
          {centre.address && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {centre.address}</p>}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-teal-600">{students.filter(s => s.status === "Active").length}</p>
          <p className="text-xs text-gray-400">active students</p>
          <Btn size="sm" variant="ghost" className="mt-1" onClick={onEdit}><Edit2 size={13} /> Edit</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {["students","notes"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${tab === t ? "bg-white shadow text-teal-700" : "text-gray-500 hover:text-gray-700"}`}>
            {t} ({t === "students" ? students.length : notes.length})
          </button>
        ))}
      </div>

      {tab === "students" && (
        <div className="space-y-2">
          {students.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No students in this centre yet.</p>}
          {students.map(st => {
            const lks   = data.links.filter(l => l.studentId === st.id);
            const subjs = [...new Set(lks.map(l => l.subjectId))].map(id => data.subjects.find(s => s.id === id)).filter(Boolean);
            const tutors = [...new Set(lks.map(l => l.tutorId))].map(id => data.tutors.find(t => t.id === id)).filter(Boolean);
            return (
              <div key={st.id} className="p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: B.teal }}>
                      {st.firstName[0]}{st.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{st.firstName} {st.lastName}</p>
                      <p className="text-xs text-gray-400">{st.curriculum} · {st.grade}</p>
                    </div>
                  </div>
                  <Badge color={st.status === "Active" ? "green" : "gray"}>{st.status}</Badge>
                </div>
                {lks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {lks.map(lk => {
                      const subj  = data.subjects.find(s => s.id === lk.subjectId);
                      const tutor = data.tutors.find(t => t.id === lk.tutorId);
                      return (
                        <div key={lk.id} className="flex items-center gap-2 text-xs text-gray-600 pl-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                          <Badge color="indigo">{subj?.name}</Badge>
                          <span className="text-gray-400">with</span>
                          <span>{tutor?.firstName} {tutor?.lastName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {lks.length === 0 && <p className="text-xs text-gray-400 pl-2 mt-1">No subject links yet.</p>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "notes" && (
        <div>
          <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl flex-wrap">
            <select className={`${inp} w-36`} value={noteForm.type} onChange={e => setNoteForm(f => ({ ...f, type: e.target.value }))}>
              {NOTE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input className={`${inp} flex-1`} placeholder="Write note…" value={noteForm.note} onChange={e => setNoteForm(f => ({ ...f, note: e.target.value }))} />
            <input className={`${inp} w-36`} type="date" value={noteForm.date} onChange={e => setNoteForm(f => ({ ...f, date: e.target.value }))} />
            <Btn onClick={addNote} disabled={!noteForm.note}><Plus size={14} /> Add</Btn>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notes.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No notes yet.</p>}
            {[...notes].sort((a,b) => b.date.localeCompare(a.date)).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
                <div className="mt-0.5">{noteIcon[n.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={noteColor[n.type]}>{n.type}</Badge>
                    <span className="text-xs text-gray-400">{fmtDate(n.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{n.note}</p>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => removeNote(n.id)}><Trash2 size={12} className="text-red-400" /></Btn>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────

function ReportsPage({ data }) {
  const [type,     setType]     = useState("student");
  const [entityId, setEntityId] = useState("");

  const entityOpts = {
    student: data.students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName} (${s.curriculum} · ${s.grade})` })),
    tutor:   data.tutors.map(t   => ({ value: t.id, label: `${t.firstName} ${t.lastName}` })),
    centre:  data.centres.map(c  => ({ value: c.id, label: c.name })),
  };

  const generate = () => {
    if (!entityId) return;
    if (type === "student") {
      const s = data.students.find(x => x.id === entityId);
      if (s) openReport(`Student — ${s.firstName} ${s.lastName}`, buildStudentReport(s, data));
    } else if (type === "tutor") {
      const t = data.tutors.find(x => x.id === entityId);
      if (t) openReport(`Tutor — ${t.firstName} ${t.lastName}`, buildTutorReport(t, data));
    } else {
      const c = data.centres.find(x => x.id === entityId);
      if (c) openReport(`Centre — ${c.name}`, buildCentreReport(c, data));
    }
  };

  const labels = { student: "Student", tutor: "Tutor", centre: "Centre" };
  const icons  = { student: Users, tutor: GraduationCap, centre: Building2 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate a PDF report for any student, tutor, or centre</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {["student","tutor","centre"].map(t => {
          const Icon = icons[t];
          return (
            <button key={t} onClick={() => { setType(t); setEntityId(""); }}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-colors ${type === t ? "border-transparent" : "border-gray-200 bg-white text-gray-600 hover:border-teal-300"}`}
              style={type === t ? { borderColor: B.teal, background: B.tealLight, color: B.tealDark } : undefined}>
              <Icon size={24} />
              <span className="text-sm font-medium">{labels[t]}</span>
            </button>
          );
        })}
      </div>

      {/* Entity selector */}
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select {labels[type]}</label>
          <select className={inp} value={entityId} onChange={e => setEntityId(e.target.value)}>
            <option value="">— choose —</option>
            {entityOpts[type].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <Btn onClick={generate} disabled={!entityId} size="lg">
          <Printer size={16} /> Generate & Download PDF
        </Btn>

        {!entityId && (
          <p className="text-xs text-gray-400">Select a {labels[type].toLowerCase()} above, then click Generate. Your browser's print dialog will open — choose "Save as PDF" to download.</p>
        )}
      </div>

      {/* Quick-access cards */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick access</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl p-4 border" style={{ background: B.tealLight, borderColor: "#c2e5e9" }}>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: B.tealDark }}>Students</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {data.students.map(s => (
                <button key={s.id} onClick={() => openReport(`Student — ${s.firstName} ${s.lastName}`, buildStudentReport(s, data))}
                  className="w-full text-left text-xs hover:underline truncate block" style={{ color: B.tealDark }}>
                  {s.firstName} {s.lastName}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">Tutors</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {data.tutors.map(t => (
                <button key={t.id} onClick={() => openReport(`Tutor — ${t.firstName} ${t.lastName}`, buildTutorReport(t, data))}
                  className="w-full text-left text-xs text-emerald-800 hover:underline truncate block">
                  {t.firstName} {t.lastName}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
            <p className="text-xs font-semibold text-teal-600 uppercase mb-2">Centres</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {data.centres.map(c => (
                <button key={c.id} onClick={() => openReport(`Centre — ${c.name}`, buildCentreReport(c, data))}
                  className="w-full text-left text-xs text-teal-800 hover:underline truncate block">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { id: "students",   label: "Students",    icon: Users           },
  { id: "tutors",     label: "Tutors",      icon: GraduationCap   },
  { id: "links",      label: "Links",       icon: LinkIcon        },
  { id: "centres",    label: "Centres",     icon: Building2       },
  { id: "accounting", label: "Accounting",  icon: DollarSign      },
  { id: "payroll",    label: "Payroll",     icon: Banknote        },
  { id: "stats",      label: "Stats",       icon: BarChart2       },
  { id: "reports",    label: "Reports",     icon: FileText        },
  { id: "settings",   label: "Settings",    icon: SettingsIcon    },
  { id: "academy",    label: "Academy",     icon: BookOpen, divider: true },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

const USERS = [
  { username: "chanellepeverett", password: "LEARNTOLINK4me", displayName: "Chanelle Peverett", role: "Owner" },
  { username: "moniqueslabbert",  password: "LEARNTOLINK4me", displayName: "Monique Slabbert",  role: "Admin" },
];

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username.trim() && u.password === password);
    if (user) { onLogin(user); }
    else { setError("Incorrect username or password. Please try again."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
         style={{ background: `linear-gradient(135deg, ${B.tealLight} 0%, #f0f9fa 60%, ${B.coralLight} 100%)` }}>
      <div className="w-full max-w-sm">
        {/* Logo card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 pt-8 pb-6 mb-4">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <LogoMark size={56} />
            <p className="mt-3 text-sm font-bold tracking-widest uppercase" style={{ color: B.tealDark }}>LEARN TO LINK</p>
            <p className="text-xs text-gray-400 tracking-wide">CRM + Academy</p>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-5">Enter your credentials to continue.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                value={username} onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder="e.g. chanellepeverett" autoComplete="username" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <X size={14} className="shrink-0" />{error}
              </div>
            )}
            <button type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-2"
              style={{ background: `linear-gradient(135deg, ${B.tealDark} 0%, ${B.coral} 100%)` }}>
              Sign In
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400">© {new Date().getFullYear()} Learn to Link. All rights reserved.</p>
      </div>
    </div>
  );
}

// ─── ROLE PORTAL VIEWS ────────────────────────────────────────────────────────

function StudentPortal({ student, data, setData }) {
  const [selTutorId, setSelTutorId] = useState(null);
  const [chatMsg,    setChatMsg]    = useState("");

  const myLinks      = data.links.filter(l => l.studentId === student.id);
  const myPurchases  = data.purchases.filter(p => p.studentId === student.id);
  const totalBought  = myPurchases.reduce((s, p) => s + p.quantity, 0);
  const totalUsed    = (data.logbook||[]).filter(l => l.studentId===student.id && l.attended).length;
  const totalLessons = Math.max(0, totalBought - totalUsed);
  const myEnrolments = data.enrolments.filter(e => e.studentId === student.id);
  const myProgress   = data.progress.filter(p => p.studentId === student.id);
  const mySchedule   = [...(data.scheduledLessons||[]).filter(sl => sl.studentId===student.id)].sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  const myMessages   = selTutorId ? (data.messages||[]).filter(m=>m.tutorId===selTutorId&&m.studentId===student.id).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)) : [];

  const subjectName = (id) => (data.subjects||[]).find(s=>s.id===id)?.name || "—";

  const sendStudentMsg = () => {
    if (!chatMsg.trim()||!selTutorId) return;
    setData && setData(d=>({...d, messages:[...(d.messages||[]),{id:"msg"+uid(),tutorId:selTutorId,studentId:student.id,fromRole:"student",text:chatMsg.trim(),date:today(),time:new Date().toTimeString().slice(0,5)}]}));
    setChatMsg("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${B.tealLight} 0%, ${B.coralLight} 100%)` }}>
        <h1 className="text-2xl font-bold" style={{ color: B.tealDark }}>Hello, {student.firstName}! 👋</h1>
        <p className="text-sm text-gray-500 mt-1">{student.grade} · {student.curriculum}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">My Tutors</h2>
        {myLinks.length === 0 ? <p className="text-sm text-gray-400">No tutors linked yet.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myLinks.map(link => {
              const tutor   = data.tutors.find(t => t.id === link.tutorId);
              const subject = data.subjects.find(s => s.id === link.subjectId);
              return (
                <div key={link.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: B.teal }}>
                    {tutor.firstName[0]}{tutor.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{tutor.firstName} {tutor.lastName}</p>
                    <p className="text-xs text-gray-500">{subject.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tutor.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Lesson Credits</h2>
        <div className="flex items-center gap-6 mb-3">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: totalLessons===0?"#dc2626":B.tealDark }}>{totalLessons}</p>
            <p className="text-xs text-gray-400 mt-0.5">Lessons Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-500">{totalBought}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Purchased</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-500">{totalUsed}</p>
            <p className="text-xs text-gray-400 mt-0.5">Used</p>
          </div>
        </div>
        {totalLessons===0 && <p className="text-xs text-red-500 font-medium">You have no lessons remaining. Please contact Learn to Link to purchase more.</p>}
      </div>

      {/* Upcoming lessons */}
      {mySchedule.length>0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">My Upcoming Lessons</h2>
          <div className="space-y-2">
            {mySchedule.filter(sl=>sl.date>=today()).map(sl=>{
              const tutor=data.tutors.find(t=>t.id===sl.tutorId);
              return (
                <div key={sl.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
                  <div className="text-center w-12 shrink-0">
                    <p className="text-xs text-gray-400">{fmtDate(sl.date).split(" ")[1]}</p>
                    <p className="text-lg font-bold text-gray-800">{fmtDate(sl.date).split(" ")[0]}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{subjectName(sl.subjectId)} with {tutor?.firstName} {tutor?.lastName}</p>
                    <p className="text-xs text-gray-400">{sl.time}{sl.notes?` · ${sl.notes}`:""}</p>
                  </div>
                  {sl.link && <a href={sl.link} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white shrink-0" style={{background:B.tealDark}}>Join</a>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat with tutors */}
      {myLinks.length>0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Messages from Tutors</h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[...new Set(myLinks.map(l=>l.tutorId))].map(tid=>{
              const t=data.tutors.find(x=>x.id===tid);
              return (
                <button key={tid} onClick={()=>setSelTutorId(tid)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-colors"
                  style={{borderColor:selTutorId===tid?B.teal:"#e5e7eb",background:selTutorId===tid?B.tealLight:"white",color:selTutorId===tid?B.tealDark:"#6b7280"}}>
                  {t?.firstName} {t?.lastName}
                </button>
              );
            })}
          </div>
          {selTutorId && (
            <>
              <div className="min-h-40 space-y-3 mb-3">
                {myMessages.length===0?<p className="text-sm text-gray-400">No messages yet.</p>:myMessages.map(msg=>(
                  <div key={msg.id} className={`flex ${msg.fromRole==="student"?"justify-end":"justify-start"}`}>
                    <div className="max-w-xs rounded-2xl px-4 py-2.5 text-sm"
                      style={msg.fromRole==="student"?{background:B.tealDark,color:"white"}:{background:"#f3f4f6",color:"#374151"}}>
                      <p>{msg.text}</p>
                      <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendStudentMsg()}
                  placeholder="Reply to your tutor…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/>
                <button onClick={sendStudentMsg} disabled={!chatMsg.trim()} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{background:B.tealDark}}>Send</button>
              </div>
            </>
          )}
        </div>
      )}

      {myEnrolments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">My Courses</h2>
          <div className="space-y-3">
            {myEnrolments.map(enr => {
              const course         = data.courses.find(c => c.id === enr.courseId);
              const courseLessons  = data.lessons.filter(l => l.courseId === enr.courseId);
              const completedCount = myProgress.filter(p => p.courseId === enr.courseId && p.completed).length;
              const pct            = courseLessons.length ? Math.round((completedCount / courseLessons.length) * 100) : 0;
              const upcoming       = courseLessons.filter(l => !myProgress.find(p => p.lessonId === l.id && p.completed)).slice(0, 3);
              return (
                <div key={enr.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{course.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{completedCount} of {courseLessons.length} lessons complete</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: B.tealDark }}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: B.teal }} />
                  </div>
                  {upcoming.map(l => (
                    <div key={l.id} className="flex justify-between text-xs text-gray-500 py-0.5">
                      <span>📖 {l.title}</span>
                      {l.dueDate && <span className="text-gray-400">Due {l.dueDate}</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TutorPortal({ tutor, data, setData }) {
  const [tutorPage,    setTutorPage]    = useState("dashboard");
  const [selStudentId, setSelStudentId] = useState(null);
  const [studentTab,   setStudentTab]   = useState("info");
  const [lbForm,  setLbForm]  = useState({ subjectId:"", duration:60, topicsCovered:"", homework:"", notes:"", attended:true });
  const [slForm,  setSlForm]  = useState({ subjectId:"", date:today(), time:"14:00", link:"", notes:"" });
  const [qsForm,  setQsForm]  = useState({ studentId:"", subjectId:"", date:today(), time:"14:00", link:"", notes:"" });
  const [qsSaved, setQsSaved] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [pnText,  setPnText]  = useState("");
  const [pnSent,  setPnSent]  = useState(false);
  const [rptForm, setRptForm] = useState({ subjectId:"", period:"", periodType:"monthly", lessonsAttended:"", lessonsScheduled:"", topicsCovered:"", strengths:"", areasForImprovement:"", overallComments:"", rating:"Good" });
  const [rptSaved,   setRptSaved]   = useState(false);
  const [earnMonth,  setEarnMonth]  = useState(today().slice(0, 7));
  const [claimForm,  setClaimForm]  = useState({ type: (data.claimTypes||["Workshop"])[0], studentNames: "", amount: "", date: today() });
  const [claimSaved, setClaimSaved] = useState(false);

  const myLinks      = (data.links||[]).filter(l => l.tutorId === tutor.id);
  const myStudentIds = [...new Set(myLinks.map(l => l.studentId))];
  const myStudents   = myStudentIds.map(id => (data.students||[]).find(s => s.id === id)).filter(Boolean);
  const selStudent   = selStudentId ? myStudents.find(s => s.id === selStudentId) : null;

  const creditsFor = (sid) => {
    const bought = (data.purchases||[]).filter(p => p.studentId===sid).reduce((a,p) => a+p.quantity, 0);
    const used   = (data.logbook||[]).filter(l => l.studentId===sid && l.attended).length;
    return Math.max(0, bought - used);
  };

  const subjectName = (id) => (data.subjects||[]).find(s => s.id===id)?.name || "—";
  const tutorName   = (id) => { const t=(data.tutors||[]).find(x=>x.id===id); return t?`${t.firstName} ${t.lastName}`:"—"; };

  const selLinks    = selStudentId ? myLinks.filter(l => l.studentId===selStudentId) : [];
  const studentLog  = selStudentId ? (data.logbook||[]).filter(l => l.studentId===selStudentId).sort((a,b)=>b.date.localeCompare(a.date)) : [];
  const studentMsgs = selStudentId ? (data.messages||[]).filter(m => m.tutorId===tutor.id && m.studentId===selStudentId).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)) : [];
  const studentSched= selStudentId ? (data.scheduledLessons||[]).filter(s=>s.tutorId===tutor.id&&s.studentId===selStudentId).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)) : [];
  const studentRpts = selStudentId ? (data.studentReports||[]).filter(r=>r.tutorId===tutor.id&&r.studentId===selStudentId).sort((a,b)=>b.date.localeCompare(a.date)) : [];
  const upcomingAll = (data.scheduledLessons||[]).filter(sl=>sl.tutorId===tutor.id&&sl.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,5);
  const myNotes     = (data.tutorNotes||[]).filter(n=>n.tutorId===tutor.id&&n.source==="admin"&&n.type!=="complaint");

  const addLog = () => {
    if (!lbForm.subjectId||!lbForm.topicsCovered.trim()) return;
    setData(d=>({...d, logbook:[...(d.logbook||[]),{...lbForm,id:"lb"+uid(),tutorId:tutor.id,studentId:selStudentId,date:today(),duration:Number(lbForm.duration)}]}));
    setLbForm({subjectId:"",duration:60,topicsCovered:"",homework:"",notes:"",attended:true});
  };
  const sendMsg = () => {
    if (!msgText.trim()) return;
    setData(d=>({...d, messages:[...(d.messages||[]),{id:"msg"+uid(),tutorId:tutor.id,studentId:selStudentId,fromRole:"tutor",text:msgText.trim(),date:today(),time:new Date().toTimeString().slice(0,5)}]}));
    setMsgText("");
  };
  const schedLesson = () => {
    if (!slForm.subjectId||!slForm.date||!slForm.time) return;
    setData(d=>({...d, scheduledLessons:[...(d.scheduledLessons||[]),{...slForm,id:"sl"+uid(),tutorId:tutor.id,studentId:selStudentId}]}));
    setSlForm({subjectId:"",date:today(),time:"14:00",link:"",notes:""});
  };
  const qsScheduleLesson = () => {
    if (!qsForm.studentId||!qsForm.subjectId||!qsForm.date||!qsForm.time) return;
    setData(d=>({...d, scheduledLessons:[...(d.scheduledLessons||[]),{...qsForm,id:"sl"+uid(),tutorId:tutor.id}]}));
    setQsForm({studentId:"",subjectId:"",date:today(),time:"14:00",link:"",notes:""});
    setQsSaved(true); setTimeout(()=>setQsSaved(false),4000);
  };
  const sendParentNote = () => {
    if (!pnText.trim()) return;
    setData(d=>({...d, tutorStudentNotes:[...(d.tutorStudentNotes||[]),{id:"tsn"+uid(),tutorId:tutor.id,studentId:selStudentId,note:pnText.trim(),date:today()}]}));
    setPnText(""); setPnSent(true); setTimeout(()=>setPnSent(false),4000);
  };
  const saveReport = () => {
    if (!rptForm.subjectId||!rptForm.period.trim()) return;
    setData(d=>({...d, studentReports:[...(d.studentReports||[]),{...rptForm,id:"srt"+uid(),tutorId:tutor.id,studentId:selStudentId,date:today(),lessonsAttended:Number(rptForm.lessonsAttended),lessonsScheduled:Number(rptForm.lessonsScheduled)}]}));
    setRptForm({subjectId:"",period:"",periodType:"monthly",lessonsAttended:"",lessonsScheduled:"",topicsCovered:"",strengths:"",areasForImprovement:"",overallComments:"",rating:"Good"});
    setRptSaved(true); setTimeout(()=>setRptSaved(false),4000);
  };

  const submitClaim = () => {
    if (!claimForm.amount || isNaN(Number(claimForm.amount))) return;
    setData(d => ({ ...d, tutorClaims: [...(d.tutorClaims||[]), { id:"cl"+uid(), tutorId:tutor.id, month:earnMonth, type:claimForm.type, studentNames:claimForm.studentNames, amount:Number(claimForm.amount), date:claimForm.date, status:"pending" }] }));
    setClaimForm({ type:(data.claimTypes||["Workshop"])[0], studentNames:"", amount:"", date:today() });
    setClaimSaved(true); setTimeout(()=>setClaimSaved(false),4000);
  };

  const approveSelfInvoice = () => {
    setData(d => {
      const existing = (d.invoiceStatus||[]).find(s => s.tutorId===tutor.id && s.month===earnMonth);
      const updated  = existing
        ? d.invoiceStatus.map(s => s.tutorId===tutor.id && s.month===earnMonth ? {...s, tutorApproved:true} : s)
        : [...(d.invoiceStatus||[]), {id:"inv"+uid(), tutorId:tutor.id, month:earnMonth, tutorApproved:true, adminApproved:false, paid:false, paidDate:null, paidAmount:0}];
      return {...d, invoiceStatus:updated};
    });
  };

  const TUTOR_PAGES = [
    {id:"dashboard",label:"Dashboard",  icon:LayoutDashboard},
    {id:"students", label:"My Students",icon:Users},
    {id:"schedule", label:"Schedule",   icon:CalendarDays},
    {id:"earnings", label:"Earnings",   icon:Banknote},
    ...(tutor.isAcademyTutor ? [{id:"academy",label:"Academy",icon:BookOpen}] : []),
  ];
  const STUDENT_TABS = [
    {id:"info",       label:"Info"},
    {id:"logbook",    label:"Logbook"},
    {id:"chat",       label:"Chat"},
    {id:"schedule",   label:"Schedule"},
    {id:"report",     label:"Reports"},
    {id:"parentNote", label:"Note to Parent"},
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none";
  const textCls  = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none";

  return (
    <div className="space-y-5">
      {/* Internal tab nav */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        {TUTOR_PAGES.map(tp => (
          <button key={tp.id} onClick={()=>{setTutorPage(tp.id);setSelStudentId(null);}}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-colors"
            style={tutorPage===tp.id?{background:B.tealLight,color:B.tealDark}:{color:"#6b7280"}}>
            <tp.icon size={13}/>{tp.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tutorPage==="dashboard" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{background:`linear-gradient(135deg,${B.tealLight} 0%,${B.coralLight} 100%)`}}>
            <h1 className="text-2xl font-bold" style={{color:B.tealDark}}>Hello, {tutor.firstName}!</h1>
            <p className="text-sm text-gray-500 mt-1">Subjects: {(data.subjects||[]).filter(s=>tutor.subjectIds?.includes(s.id)).map(s=>s.name).join(" · ")}</p>
            {tutor.isAcademyTutor && <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:B.coralLight,color:B.coralDark}}>Academy Tutor</span>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {label:"My Students",      value:myStudents.length,       icon:Users,         color:B.teal },
              {label:"Upcoming Lessons", value:upcomingAll.length,      icon:CalendarDays,  color:B.coral},
              {label:"Lessons This Month",value:(data.logbook||[]).filter(l=>l.tutorId===tutor.id&&l.date.startsWith(today().slice(0,7))).length, icon:BookMarked, color:B.gold},
            ].map(s=>(
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-1.5 mb-1"><s.icon size={13} style={{color:s.color}}/><p className="text-xs text-gray-400">{s.label}</p></div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            ))}
          </div>

          {upcomingAll.length>0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Lessons</h2>
              <div className="space-y-2">
                {upcomingAll.map(sl=>{
                  const st=data.students.find(s=>s.id===sl.studentId);
                  return (
                    <div key={sl.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                      <div className="text-center w-10 shrink-0">
                        <p className="text-xs text-gray-400">{fmtDate(sl.date).split(" ")[1]}</p>
                        <p className="text-base font-bold text-gray-800">{fmtDate(sl.date).split(" ")[0]}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{st?.firstName} {st?.lastName}</p>
                        <p className="text-xs text-gray-400">{subjectName(sl.subjectId)} · {sl.time}</p>
                      </div>
                      {sl.link && <a href={sl.link} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white" style={{background:B.tealDark}}>Join</a>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {myNotes.length>0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Compliments from Learn to Link</h2>
              <div className="space-y-2">
                {myNotes.map(n=>(
                  <div key={n.id} className="rounded-xl p-4 border" style={{background:n.type==="compliment"?B.tealLight:B.coralLight,borderColor:n.type==="compliment"?B.teal:B.coral}}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{color:n.type==="compliment"?B.tealDark:B.coralDark}}>{n.type==="compliment"?"✓ Compliment":"⚠ Note"}</span>
                      <span className="text-xs text-gray-400">{fmtDate(n.date)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">My Contact Details</h2>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div><span className="text-gray-400 mr-2">Email</span>{tutor.email}</div>
              <div><span className="text-gray-400 mr-2">Phone</span>{tutor.phone}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── MY STUDENTS ── */}
      {tutorPage==="students" && (
        <div className="space-y-4">
          {!selStudent ? (
            <>
              <h2 className="text-base font-semibold text-gray-800">My Students</h2>
              {myStudents.length===0 ? <p className="text-sm text-gray-400">No students assigned yet.</p> : (
                <div className="space-y-3">
                  {myStudents.map(st=>{
                    const credits=creditsFor(st.id);
                    const stSubjects=[...new Set(myLinks.filter(l=>l.studentId===st.id).map(l=>l.subjectId))].map(subjectName).join(", ");
                    const upcoming=(data.scheduledLessons||[]).filter(sl=>sl.tutorId===tutor.id&&sl.studentId===st.id&&sl.date>=today()).length;
                    return (
                      <div key={st.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={()=>{setSelStudentId(st.id);setStudentTab("info");}}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{st.firstName} {st.lastName}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{st.curriculum} · {st.grade}</p>
                            <p className="text-xs text-gray-500 mt-1">{stSubjects}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${credits===0?"bg-red-50 text-red-600":"bg-green-50 text-green-700"}`}>
                              <DollarSign size={10}/>{credits} lesson{credits===1?"":"s"} left
                            </div>
                            {upcoming>0 && <p className="text-xs text-gray-400">{upcoming} upcoming</p>}
                          </div>
                        </div>
                        <p className="text-xs mt-3" style={{color:B.tealDark}}>View student →</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div>
              <button onClick={()=>setSelStudentId(null)} className="flex items-center gap-1 text-sm mb-4" style={{color:B.tealDark}}>
                <ChevronLeft size={14}/>Back to students
              </button>

              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">{selStudent.firstName} {selStudent.lastName}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selStudent.curriculum} · {selStudent.grade}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${creditsFor(selStudentId)===0?"bg-red-50 text-red-600":"bg-green-50 text-green-700"}`}>
                  <DollarSign size={10} className="inline mr-0.5"/>{creditsFor(selStudentId)} lesson{creditsFor(selStudentId)===1?"":"s"} remaining
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-0.5 mb-4 bg-gray-100 rounded-xl p-1 flex-wrap">
                {STUDENT_TABS.map(tab=>(
                  <button key={tab.id} onClick={()=>setStudentTab(tab.id)}
                    className="flex-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-colors min-w-0"
                    style={studentTab===tab.id?{background:"white",color:B.tealDark,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}:{color:"#6b7280"}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* INFO */}
              {studentTab==="info" && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Student Details — View Only</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ["Full Name",  `${selStudent.firstName} ${selStudent.lastName}`],
                      ["Curriculum", selStudent.curriculum],
                      ["Grade",      selStudent.grade],
                      ["Status",     selStudent.status],
                      ["Enrolled",   fmtDate(selStudent.enrolledDate)],
                      ["Reports",    selStudent.reportFrequency==="monthly"?"Monthly":"Termly"],
                      ["Centre",     selStudent.centreId?(data.centres||[]).find(c=>c.id===selStudent.centreId)?.name||"—":"Individual"],
                    ].map(([l,v])=>(
                      <div key={l}><p className="text-xs text-gray-400 mb-0.5">{l}</p><p className="font-medium text-gray-700">{v}</p></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Subjects with me</p>
                    <div className="flex flex-wrap gap-2">
                      {selLinks.map(l=><span key={l.id} className="px-3 py-1 rounded-full text-xs font-medium" style={{background:B.tealLight,color:B.tealDark}}>{subjectName(l.subjectId)}</span>)}
                    </div>
                  </div>
                </div>
              )}

              {/* LOGBOOK */}
              {studentTab==="logbook" && (
                <div className="space-y-4">
                  {/* Log form — compact inline style */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Log a Session</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <select value={lbForm.subjectId} onChange={e=>setLbForm(f=>({...f,subjectId:e.target.value}))}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-white">
                          <option value="">Subject *</option>
                          {selLinks.map(l=><option key={l.subjectId} value={l.subjectId}>{subjectName(l.subjectId)}</option>)}
                        </select>
                        <input type="number" value={lbForm.duration} onChange={e=>setLbForm(f=>({...f,duration:e.target.value}))}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none w-24" min="15" step="15" placeholder="Mins"/>
                        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer ml-auto">
                          <input type="checkbox" checked={lbForm.attended} onChange={e=>setLbForm(f=>({...f,attended:e.target.checked}))} className="rounded"/>
                          Attended
                        </label>
                      </div>
                      <textarea rows={2} value={lbForm.topicsCovered} onChange={e=>setLbForm(f=>({...f,topicsCovered:e.target.value}))}
                        placeholder="Topics covered in this session *" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/>
                      <input value={lbForm.homework} onChange={e=>setLbForm(f=>({...f,homework:e.target.value}))}
                        placeholder="Homework / tasks set for next session" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"/>
                      <textarea rows={2} value={lbForm.notes} onChange={e=>setLbForm(f=>({...f,notes:e.target.value}))}
                        placeholder="Private tutor notes / observations…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/>
                      <button onClick={addLog} disabled={!lbForm.subjectId||!lbForm.topicsCovered.trim()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                        style={{background:B.tealDark}}>
                        <Plus size={14}/> Add to Logbook
                      </button>
                    </div>
                  </div>

                  {/* Log entries — note-row style matching admin */}
                  {studentLog.length===0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No sessions logged yet.</p>
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Session Log ({studentLog.length})</p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {studentLog.map(lb=>(
                          <div key={lb.id} className="flex items-start gap-3 px-4 py-3">
                            <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{background:lb.attended?B.tealLight:"#fee2e2"}}>
                              <BookMarked size={13} style={{color:lb.attended?B.tealDark:"#dc2626"}}/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                  style={{background:B.tealLight,color:B.tealDark}}>{subjectName(lb.subjectId)}</span>
                                {!lb.attended && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Absent</span>}
                                {lb.tutorId!==tutor.id && <span className="text-xs text-gray-400">· {tutorName(lb.tutorId)}</span>}
                                <span className="text-xs text-gray-400 ml-auto">{fmtDate(lb.date)} · {lb.duration} min</span>
                              </div>
                              <p className="text-sm text-gray-700">{lb.topicsCovered}</p>
                              {lb.homework && <p className="text-xs text-gray-500 mt-1">📚 Homework: {lb.homework}</p>}
                              {lb.notes && <p className="text-xs text-gray-400 italic mt-0.5">{lb.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CHAT */}
              {studentTab==="chat" && (
                <div className="space-y-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-4 min-h-48 space-y-3">
                    {studentMsgs.length===0 ? <p className="text-sm text-gray-400">No messages yet. Start the conversation!</p> : studentMsgs.map(msg=>(
                      <div key={msg.id} className={`flex ${msg.fromRole==="tutor"?"justify-end":"justify-start"}`}>
                        <div className="max-w-xs rounded-2xl px-4 py-2.5 text-sm"
                          style={msg.fromRole==="tutor"?{background:B.tealDark,color:"white"}:{background:"#f3f4f6",color:"#374151"}}>
                          <p>{msg.text}</p>
                          <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={msgText} onChange={e=>setMsgText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                      placeholder="Type a message…" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/>
                    <button onClick={sendMsg} disabled={!msgText.trim()} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{background:B.tealDark}}>Send</button>
                  </div>
                </div>
              )}

              {/* SCHEDULE */}
              {studentTab==="schedule" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Schedule a Lesson</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Subject *</label>
                          <select value={slForm.subjectId} onChange={e=>setSlForm(f=>({...f,subjectId:e.target.value}))} className={inputCls}>
                            <option value="">— select —</option>
                            {selLinks.map(l=><option key={l.subjectId} value={l.subjectId}>{subjectName(l.subjectId)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Date *</label>
                          <input type="date" value={slForm.date} onChange={e=>setSlForm(f=>({...f,date:e.target.value}))} className={inputCls}/>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Time *</label>
                          <input type="time" value={slForm.time} onChange={e=>setSlForm(f=>({...f,time:e.target.value}))} className={inputCls}/>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Lesson Link</label>
                          <input value={slForm.link} onChange={e=>setSlForm(f=>({...f,link:e.target.value}))} placeholder="https://meet.google.com/…" className={inputCls}/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Notes</label>
                        <input value={slForm.notes} onChange={e=>setSlForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Bring textbook" className={inputCls}/>
                      </div>
                      <button onClick={schedLesson} disabled={!slForm.subjectId||!slForm.date||!slForm.time}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{background:B.tealDark}}>
                        Add to Schedule
                      </button>
                    </div>
                  </div>

                  {studentSched.length===0 ? <p className="text-sm text-gray-400">No lessons scheduled yet.</p> : (
                    <div className="space-y-2">
                      {studentSched.map(sl=>(
                        <div key={sl.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                          <div className="text-center w-12 shrink-0">
                            <p className="text-xs text-gray-400">{fmtDate(sl.date).split(" ")[1]}</p>
                            <p className="text-lg font-bold text-gray-800">{fmtDate(sl.date).split(" ")[0]}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{subjectName(sl.subjectId)} · {sl.time}</p>
                            {sl.notes && <p className="text-xs text-gray-500 mt-0.5">{sl.notes}</p>}
                            {sl.link && <a href={sl.link} target="_blank" rel="noreferrer" className="text-xs mt-1 inline-block" style={{color:B.tealDark}}>🔗 Join lesson</a>}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${sl.date>=today()?"bg-green-50 text-green-700":"bg-gray-100 text-gray-400"}`}>
                            {sl.date>=today()?"Upcoming":"Past"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REPORTS */}
              {studentTab==="report" && (
                <div className="space-y-4">
                  {rptSaved && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{background:B.tealLight,color:B.tealDark}}>✓ Report saved successfully.</div>}

                  {/* Report form */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Write a {selStudent.reportFrequency==="monthly"?"Monthly":"Term"} Report
                      </p>
                      <span className="text-xs text-gray-400">Due {selStudent.reportFrequency==="monthly"?"monthly":"each term"}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <select value={rptForm.subjectId} onChange={e=>setRptForm(f=>({...f,subjectId:e.target.value}))} className={inputCls} style={{flex:"1 1 140px"}}>
                          <option value="">Subject *</option>
                          {selLinks.map(l=><option key={l.subjectId} value={l.subjectId}>{subjectName(l.subjectId)}</option>)}
                        </select>
                        <input value={rptForm.period} onChange={e=>setRptForm(f=>({...f,period:e.target.value}))}
                          placeholder={selStudent.reportFrequency==="monthly"?"Period * (e.g. June 2025)":"Period * (e.g. Term 2 2025)"}
                          className={inputCls} style={{flex:"1 1 160px"}}/>
                        <input type="number" value={rptForm.lessonsAttended} onChange={e=>setRptForm(f=>({...f,lessonsAttended:e.target.value}))} min="0" placeholder="Attended" className={inputCls} style={{width:"88px"}}/>
                        <input type="number" value={rptForm.lessonsScheduled} onChange={e=>setRptForm(f=>({...f,lessonsScheduled:e.target.value}))} min="0" placeholder="Scheduled" className={inputCls} style={{width:"96px"}}/>
                      </div>
                      <textarea rows={2} value={rptForm.topicsCovered} onChange={e=>setRptForm(f=>({...f,topicsCovered:e.target.value}))} placeholder="Topics covered this period…" className={textCls}/>
                      <textarea rows={2} value={rptForm.strengths} onChange={e=>setRptForm(f=>({...f,strengths:e.target.value}))} placeholder="Strengths — what is the student doing well?" className={textCls}/>
                      <textarea rows={2} value={rptForm.areasForImprovement} onChange={e=>setRptForm(f=>({...f,areasForImprovement:e.target.value}))} placeholder="Areas for improvement — what needs more focus?" className={textCls}/>
                      <textarea rows={2} value={rptForm.overallComments} onChange={e=>setRptForm(f=>({...f,overallComments:e.target.value}))} placeholder="Overall comments and recommendations…" className={textCls}/>
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">Overall Rating</p>
                        <div className="flex gap-2 flex-wrap">
                          {["Excellent","Good","Satisfactory","Needs Improvement"].map(r=>(
                            <button key={r} onClick={()=>setRptForm(f=>({...f,rating:r}))}
                              className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                              style={{borderColor:rptForm.rating===r?B.teal:"#e5e7eb",background:rptForm.rating===r?B.tealLight:"white",color:rptForm.rating===r?B.tealDark:"#6b7280"}}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={saveReport} disabled={!rptForm.subjectId||!rptForm.period.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 flex items-center gap-1.5" style={{background:B.tealDark}}>
                        <FileText size={13}/> Save Report
                      </button>
                    </div>
                  </div>

                  {/* Previous reports */}
                  {studentRpts.length>0 && (
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Previous Reports ({studentRpts.length})</p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[...studentRpts].sort((a,b)=>b.date.localeCompare(a.date)).map(r=>{
                          const ratingColor = r.rating==="Excellent"?"#dcfce7":r.rating==="Good"?B.tealLight:r.rating==="Satisfactory"?B.goldLight:B.coralLight;
                          const ratingText  = r.rating==="Excellent"?"#15803d":r.rating==="Good"?B.tealDark:r.rating==="Satisfactory"?"#92400e":B.coralDark;
                          return (
                            <div key={r.id} className="flex items-start gap-3 px-4 py-3">
                              <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{background:B.goldLight}}>
                                <FileText size={13} style={{color:"#92400e"}}/>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:B.tealLight,color:B.tealDark}}>{subjectName(r.subjectId)}</span>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:ratingColor,color:ratingText}}>{r.rating}</span>
                                  <span className="text-xs text-gray-400 ml-auto">{r.period} · {fmtDate(r.date)}</span>
                                </div>
                                <p className="text-xs text-gray-500">{r.lessonsAttended}/{r.lessonsScheduled} lessons attended</p>
                                {r.topicsCovered && <p className="text-xs text-gray-600 mt-1"><span className="font-medium text-gray-500">Topics:</span> {r.topicsCovered}</p>}
                                {r.strengths && <p className="text-xs text-gray-600 mt-0.5"><span className="font-medium text-gray-500">Strengths:</span> {r.strengths}</p>}
                                {r.areasForImprovement && <p className="text-xs text-gray-600 mt-0.5"><span className="font-medium text-gray-500">Improve:</span> {r.areasForImprovement}</p>}
                                {r.overallComments && <p className="text-xs text-gray-400 italic mt-0.5">{r.overallComments}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* NOTE TO PARENT */}
              {studentTab==="parentNote" && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Note to Parent / Guardian</p>
                    <p className="text-xs text-gray-400 mt-1">This note will appear on the parent's profile only. The student cannot see it.</p>
                  </div>
                  {pnSent && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{background:B.tealLight,color:B.tealDark}}>✓ Note sent to parent.</div>}
                  <textarea rows={4} value={pnText} onChange={e=>setPnText(e.target.value)}
                    placeholder="Write a note for the parent / guardian about this student's progress, behaviour, or anything they should be aware of…"
                    className={textCls}/>
                  <button onClick={sendParentNote} disabled={!pnText.trim()}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                    style={{background:`linear-gradient(135deg,${B.tealDark} 0%,${B.coral} 100%)`}}>
                    Send Note to Parent
                  </button>
                  {(()=>{
                    const prev=(data.tutorStudentNotes||[]).filter(n=>n.tutorId===tutor.id&&n.studentId===selStudentId).sort((a,b)=>b.date.localeCompare(a.date));
                    return prev.length>0?(
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Previously Sent</p>
                        <div className="space-y-2">
                          {prev.map(n=>(
                            <div key={n.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                              <p className="text-xs text-gray-400 mb-1">{fmtDate(n.date)}</p>
                              <p className="text-sm text-gray-700">{n.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ):null;
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SCHEDULE (all students) ── */}
      {tutorPage==="schedule" && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-800">My Schedule</h2>

          {/* Quick-schedule form */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Schedule a Lesson</p>
            </div>
            <div className="p-4 space-y-3">
              {qsSaved && <div className="px-3 py-2 rounded-lg text-xs font-medium" style={{background:B.tealLight,color:B.tealDark}}>✓ Lesson added to schedule.</div>}
              <div className="flex gap-2 flex-wrap">
                <select value={qsForm.studentId}
                  onChange={e=>{
                    const sid=e.target.value;
                    setQsForm(f=>({...f,studentId:sid,subjectId:""}));
                  }}
                  className={inputCls} style={{flex:"1 1 150px"}}>
                  <option value="">Student *</option>
                  {myStudents.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
                <select value={qsForm.subjectId} onChange={e=>setQsForm(f=>({...f,subjectId:e.target.value}))}
                  className={inputCls} style={{flex:"1 1 140px"}} disabled={!qsForm.studentId}>
                  <option value="">Subject *</option>
                  {(data.links||[]).filter(l=>l.tutorId===tutor.id&&l.studentId===qsForm.studentId).map(l=>(
                    <option key={l.subjectId} value={l.subjectId}>{(data.subjects||[]).find(s=>s.id===l.subjectId)?.name||l.subjectId}</option>
                  ))}
                </select>
                <input type="date" value={qsForm.date} onChange={e=>setQsForm(f=>({...f,date:e.target.value}))} className={inputCls} style={{width:"140px"}}/>
                <input type="time" value={qsForm.time} onChange={e=>setQsForm(f=>({...f,time:e.target.value}))} className={inputCls} style={{width:"110px"}}/>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input value={qsForm.link} onChange={e=>setQsForm(f=>({...f,link:e.target.value}))}
                  placeholder="Meeting link (optional)" className={inputCls} style={{flex:"1 1 200px"}}/>
                <input value={qsForm.notes} onChange={e=>setQsForm(f=>({...f,notes:e.target.value}))}
                  placeholder="Notes (optional)" className={inputCls} style={{flex:"1 1 160px"}}/>
              </div>
              <button onClick={qsScheduleLesson} disabled={!qsForm.studentId||!qsForm.subjectId||!qsForm.date||!qsForm.time}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 flex items-center gap-1.5" style={{background:B.tealDark}}>
                <CalendarDays size={13}/> Add to Schedule
              </button>
            </div>
          </div>

          {(()=>{
            const all=(data.scheduledLessons||[]).filter(sl=>sl.tutorId===tutor.id).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
            const upcoming=all.filter(sl=>sl.date>=today());
            const past=[...all.filter(sl=>sl.date<today())].reverse();
            const LessonRow=({sl,dim})=>{
              const st=data.students.find(s=>s.id===sl.studentId);
              return(
                <div className={`rounded-xl border border-gray-100 p-4 flex items-center gap-4 ${dim?"bg-gray-50 opacity-60":"bg-white"}`}>
                  <div className="text-center w-12 shrink-0">
                    <p className="text-xs text-gray-400">{fmtDate(sl.date).split(" ")[1]}</p>
                    <p className="text-lg font-bold text-gray-800">{fmtDate(sl.date).split(" ")[0]}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{st?.firstName} {st?.lastName}</p>
                    <p className="text-xs text-gray-500">{subjectName(sl.subjectId)} · {sl.time}</p>
                    {sl.notes && <p className="text-xs text-gray-400 mt-0.5">{sl.notes}</p>}
                    {sl.link && <a href={sl.link} target="_blank" rel="noreferrer" className="text-xs mt-1 inline-block" style={{color:B.tealDark}}>🔗 Join lesson</a>}
                  </div>
                </div>
              );
            };
            return(
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upcoming ({upcoming.length})</p>
                  {upcoming.length===0?<p className="text-sm text-gray-400">No upcoming lessons.</p>:<div className="space-y-2">{upcoming.map(sl=><LessonRow key={sl.id} sl={sl} dim={false}/>)}</div>}
                </div>
                {past.length>0&&(
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Past ({past.length})</p>
                    <div className="space-y-2">{past.map(sl=><LessonRow key={sl.id} sl={sl} dim={true}/>)}</div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ── EARNINGS ── */}
      {tutorPage==="earnings" && (() => {
        const inv = buildTutorInvoice(tutor.id, earnMonth, data);
        const locked = isInvoiceLocked(earnMonth);
        const statusLabel = inv.isPaid ? "Paid" : inv.isApproved ? (locked && !inv.statusRec?.tutorApproved ? "Auto-locked" : "Approved") : "Pending";
        const statusStyle = inv.isPaid
          ? { background:"#dcfce7", color:"#166534" }
          : inv.isApproved
            ? (locked && !inv.statusRec?.tutorApproved ? { background:"#fef3c7", color:"#92400e" } : { background:B.tealLight, color:B.tealDark })
            : { background:"#f3f4f6", color:"#6b7280" };
        return (
          <div className="space-y-5">
            {/* Month selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <input type="month" value={earnMonth} onChange={e=>setEarnMonth(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={statusStyle}>{statusLabel}</span>
              <button onClick={()=>printInvoiceWindow(buildTutorInvoiceHTML(tutor, inv, earnMonth), `Invoice ${tutor.firstName} ${tutor.lastName} ${earnMonth}`)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700 transition-colors">
                <Printer size={13}/> Download Invoice
              </button>
            </div>

            {locked && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background:"#fef3c7", color:"#92400e" }}>
                <Clock size={15} />
                <span>This invoice was auto-approved on the 26th and is now locked.</span>
              </div>
            )}

            {/* Summary card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Lessons</p>
                  <p className="text-lg font-bold text-gray-800">{fmtZAR(inv.lessonTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Claims</p>
                  <p className="text-lg font-bold text-gray-800">{fmtZAR(inv.claimsTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="text-xl font-bold" style={{color:B.tealDark}}>{fmtZAR(inv.grandTotal)}</p>
                </div>
              </div>
              {!inv.isApproved && !locked && (
                <div className="mt-4 flex justify-center">
                  <Btn onClick={approveSelfInvoice} variant="success"><ThumbsUp size={14}/> Approve My Invoice</Btn>
                </div>
              )}
              {inv.statusRec?.tutorApproved && !locked && (
                <p className="text-center text-xs text-green-600 mt-3">You approved this invoice.</p>
              )}
            </div>

            {/* Invoice line items — grouped by student + claims */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Items</p>
              </div>
              {(()=>{
                const groups = groupLessonsByStudent(inv.lessonLines);
                return (
                  <div className="divide-y divide-gray-50">
                    {/* Student lesson rows */}
                    {groups.length === 0 && inv.allClaims.length === 0 && (
                      <p className="text-sm text-gray-400 px-4 py-4">No items for this month.</p>
                    )}
                    {groups.map(g => (
                      <div key={g.studentId} className="flex items-start gap-3 px-4 py-3">
                        <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{background:B.tealLight}}>
                          <Users size={13} style={{color:B.tealDark}}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">{g.studentName}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:B.tealLight,color:B.tealDark}}>{g.lessonCount} lesson{g.lessonCount!==1?"s":""}</span>
                            {g.hasWifi && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">+ WiFi</span>}
                          </div>
                          <p className="text-xs text-gray-400">{g.dates.join(" · ")}</p>
                          <p className="text-xs text-gray-400 mt-0.5 capitalize">{g.lessonType} rate</p>
                        </div>
                        <span className="font-semibold text-gray-800 shrink-0">{fmtZAR(g.total)}</span>
                      </div>
                    ))}
                    {/* Claims as line items */}
                    {inv.allClaims.length > 0 && (
                      <>
                        <div className="px-4 py-1.5 bg-amber-50">
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Claims</p>
                        </div>
                        {inv.allClaims.map(c => (
                          <div key={c.id} className="flex items-start gap-3 px-4 py-3 bg-amber-50 bg-opacity-40">
                            <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{background:"#fef3c7"}}>
                              <FileText size={13} style={{color:"#92400e"}}/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className="text-sm font-semibold text-gray-800">{c.type}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${c.status==="approved"?"bg-green-50 text-green-700":c.status==="rejected"?"bg-red-50 text-red-600":"bg-amber-50 text-amber-700"}`}>{c.status}</span>
                              </div>
                              {c.studentNames && <p className="text-xs text-gray-500">{c.studentNames}</p>}
                              <p className="text-xs text-gray-400">{fmtDate(c.date)}</p>
                            </div>
                            <span className={`font-semibold shrink-0 ${c.status==="rejected"?"line-through text-gray-300":"text-gray-800"}`}>{fmtZAR(Number(c.amount))}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Submit new claim */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submit a Claim</p>
              </div>
              {isInvoiceLocked(earnMonth) ? (
                <p className="text-sm text-gray-400 px-4 py-4">This invoice is locked — no new claims can be submitted.</p>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select className={inputCls} value={claimForm.type} onChange={e=>setClaimForm(f=>({...f,type:e.target.value}))}>
                        {(data.claimTypes||["Workshop","Marking","Other"]).map(ct=><option key={ct}>{ct}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Amount (R)</label>
                      <input type="number" min="0" className={inputCls} placeholder="0.00" value={claimForm.amount} onChange={e=>setClaimForm(f=>({...f,amount:e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Student Names (optional)</label>
                    <input type="text" className={inputCls} placeholder="e.g. Siyanda, Mia" value={claimForm.studentNames} onChange={e=>setClaimForm(f=>({...f,studentNames:e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date</label>
                    <input type="date" className={inputCls} value={claimForm.date} onChange={e=>setClaimForm(f=>({...f,date:e.target.value}))} />
                  </div>
                  <Btn onClick={submitClaim} disabled={!claimForm.amount}><Plus size={14}/> Submit Claim</Btn>
                  {claimSaved && <p className="text-xs text-green-600">Claim submitted for admin review.</p>}
                </div>
              )}
            </div>

            {/* Invoice History */}
            {(()=>{
              const histMonths = [...new Set([
                ...(data.logbook||[]).filter(l=>l.tutorId===tutor.id&&l.attended).map(l=>l.date.slice(0,7)),
                ...(data.tutorClaims||[]).filter(c=>c.tutorId===tutor.id).map(c=>c.month),
              ])].sort().reverse().filter(m=>m!==earnMonth);
              if (histMonths.length===0) return null;
              return (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice History</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {histMonths.map(m=>{
                      const hInv = buildTutorInvoice(tutor.id, m, data);
                      const [yr,mo] = m.split("-");
                      const mLabel = new Date(Number(yr),Number(mo)-1,1).toLocaleString("en-ZA",{month:"long",year:"numeric"});
                      const hStatus = hInv.isPaid?"Paid":hInv.isApproved?(hInv.locked&&!hInv.statusRec?.tutorApproved?"Auto-locked":"Approved"):"Pending";
                      const hStyle = hInv.isPaid?{background:"#dcfce7",color:"#166534"}:hInv.isApproved?{background:B.tealLight,color:B.tealDark}:{background:"#f3f4f6",color:"#6b7280"};
                      return (
                        <div key={m} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{mLabel}</p>
                            <p className="text-xs text-gray-400">{hInv.lessonLines.length} lesson{hInv.lessonLines.length!==1?"s":""} · {fmtZAR(hInv.grandTotal)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={hStyle}>{hStatus}</span>
                            <button onClick={()=>{setEarnMonth(m);}}
                              className="text-xs text-gray-400 hover:text-teal-600 transition-colors px-2 py-1 rounded">View</button>
                            <button onClick={()=>printInvoiceWindow(buildTutorInvoiceHTML(tutor, hInv, m), `Invoice ${tutor.firstName} ${tutor.lastName} ${m}`)}
                              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700 transition-colors">
                              <Printer size={11}/> PDF
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ── ACADEMY (only for academy tutors) ── */}
      {tutorPage==="academy" && tutor.isAcademyTutor && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 mb-2" style={{background:B.coralLight}}>
            <p className="text-sm font-semibold" style={{color:B.coralDark}}>Academy Tutor Access</p>
            <p className="text-xs text-gray-500 mt-1">You are assigned as an academy tutor and have access to published courses below.</p>
          </div>
          {(data.courses||[]).filter(c=>c.status==="Published").map(course=>{
            const lessons=(data.lessons||[]).filter(l=>l.courseId===course.id);
            const mods=(data.modules||[]).filter(m=>m.courseId===course.id);
            return(
              <div key={course.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{background:course.color}}/>
                  <p className="font-semibold text-sm text-gray-800">{course.title}</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">{course.description}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{mods.length} module{mods.length===1?"":"s"}</span>
                  <span>{lessons.length} lesson{lessons.length===1?"":"s"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ParentPortal({ student, data, setData }) {
  const myLinks      = data.links.filter(l => l.studentId === student.id);
  const myPurchases  = data.purchases.filter(p => p.studentId === student.id);
  const totalLessons = myPurchases.reduce((s, p) => s + p.quantity, 0);
  const myEnrolments = data.enrolments.filter(e => e.studentId === student.id);
  const myProgress   = data.progress.filter(p => p.studentId === student.id);
  const siblingLinks = data.siblings.filter(s => s.studentId1 === student.id || s.studentId2 === student.id);
  const siblingIds   = siblingLinks.flatMap(s => [s.studentId1, s.studentId2]).filter(id => id !== student.id);
  const siblings     = data.students.filter(s => siblingIds.includes(s.id));

  // Feedback form state
  const [fbTutorId, setFbTutorId]   = useState("");
  const [fbType, setFbType]         = useState("compliment");
  const [fbNote, setFbNote]         = useState("");
  const [fbSent, setFbSent]         = useState(false);

  const myTutorIds = [...new Set(myLinks.map(l => l.tutorId))];
  const myTutors   = myTutorIds.map(tid => data.tutors.find(t => t.id === tid)).filter(Boolean);

  const submitFeedback = () => {
    if (!fbTutorId || !fbNote.trim()) return;
    setData(d => ({
      ...d,
      tutorNotes: [...d.tutorNotes, {
        id:        "tn" + uid(),
        tutorId:   fbTutorId,
        studentId: student.id,
        type:      fbType,
        note:      fbNote.trim(),
        date:      today(),
        source:    "parent",
      }],
    }));
    setFbNote(""); setFbTutorId(""); setFbSent(true);
    setTimeout(() => setFbSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${B.tealLight} 0%, ${B.coralLight} 100%)` }}>
        <h1 className="text-2xl font-bold" style={{ color: B.tealDark }}>Parent Portal 👨‍👩‍👦</h1>
        <p className="text-sm text-gray-500 mt-1">Viewing progress for: <strong>{student.firstName} {student.lastName}</strong></p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Child Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400 text-xs block mb-0.5">Name</span>{student.firstName} {student.lastName}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Grade</span>{student.grade}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Curriculum</span>{student.curriculum}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Enrolled</span>{student.enrolledDate}</div>
        </div>
        {siblings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
            Sibling also at Learn to Link: {siblings.map(s => `${s.firstName} ${s.lastName}`).join(", ")}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Assigned Tutors</h2>
        {myLinks.length === 0 ? <p className="text-sm text-gray-400">No tutors assigned yet.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myLinks.map(link => {
              const tutor   = data.tutors.find(t => t.id === link.tutorId);
              const subject = data.subjects.find(s => s.id === link.subjectId);
              return (
                <div key={link.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: B.coral }}>
                    {tutor.firstName[0]}{tutor.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{tutor.firstName} {tutor.lastName}</p>
                    <p className="text-xs text-gray-500">{subject.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Lesson Credits</h2>
        <p className="text-3xl font-bold" style={{ color: B.tealDark }}>{totalLessons}</p>
        <p className="text-xs text-gray-400 mt-1">Total lessons purchased</p>
      </div>

      {myEnrolments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Academy Progress</h2>
          <div className="space-y-3">
            {myEnrolments.map(enr => {
              const course         = data.courses.find(c => c.id === enr.courseId);
              const courseLessons  = data.lessons.filter(l => l.courseId === enr.courseId);
              const completedCount = myProgress.filter(p => p.courseId === enr.courseId && p.completed).length;
              const pct            = courseLessons.length ? Math.round((completedCount / courseLessons.length) * 100) : 0;
              return (
                <div key={enr.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm text-gray-800">{course.title}</p>
                    <span className="font-bold text-sm" style={{ color: B.tealDark }}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: B.teal }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{completedCount} of {courseLessons.length} lessons completed</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes from tutors — visible to parent only, NOT to student */}
      {(()=>{
        const tutorNotes=(data.tutorStudentNotes||[]).filter(n=>n.studentId===student.id).sort((a,b)=>b.date.localeCompare(a.date));
        if (!tutorNotes.length) return null;
        const tName=(id)=>{const t=data.tutors.find(x=>x.id===id);return t?`${t.firstName} ${t.lastName}`:"Tutor";};
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Notes from Tutors</h2>
            <p className="text-xs text-gray-400 mb-3">Private messages from your child's tutors — only you can see these.</p>
            <div className="space-y-3">
              {tutorNotes.map(n=>(
                <div key={n.id} className="p-4 rounded-xl border-l-4" style={{borderColor:B.teal,background:B.tealLight}}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{color:B.tealDark}}>{tName(n.tutorId)}</span>
                    <span className="text-xs text-gray-400">{fmtDate(n.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Tutor feedback — sent privately to admin only, never shown to tutor */}
      {myTutors.length > 0 && setData && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Leave Feedback about a Tutor</h2>
          <p className="text-xs text-gray-400 mb-4">Your feedback is sent privately to the Learn to Link team. Tutors cannot see this.</p>

          {fbSent && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: B.tealLight, color: B.tealDark }}>
              ✓ Thank you — your feedback has been received by the Learn to Link team.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Tutor</label>
              <select value={fbTutorId} onChange={e => setFbTutorId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none">
                <option value="">— select tutor —</option>
                {myTutors.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Feedback type</label>
              <div className="flex gap-2">
                {["compliment","complaint"].map(type => (
                  <button key={type} onClick={() => setFbType(type)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-colors"
                    style={{
                      borderColor: fbType === type ? (type === "compliment" ? B.teal : B.coral) : "#e5e7eb",
                      background:  fbType === type ? (type === "compliment" ? B.tealLight : B.coralLight) : "white",
                      color:       fbType === type ? (type === "compliment" ? B.tealDark : B.coralDark) : "#6b7280",
                    }}>
                    {type === "compliment" ? "👍 Compliment" : "⚠ Complaint"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Your message</label>
              <textarea rows={3} value={fbNote} onChange={e => setFbNote(e.target.value)}
                placeholder="Describe your experience…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none resize-none" />
            </div>
            <button onClick={submitFeedback} disabled={!fbTutorId || !fbNote.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${B.tealDark} 0%, ${B.coral} 100%)` }}>
              Send Feedback Privately
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CentrePortal({ centre, data }) {
  const myStudents   = data.students.filter(s => s.centreId === centre.id);
  const myNotes      = data.centreNotes.filter(n => n.centreId === centre.id);
  const myStudentIds = myStudents.map(s => s.id);
  const myLinks      = data.links.filter(l => myStudentIds.includes(l.studentId));
  const myTutorIds   = [...new Set(myLinks.map(l => l.tutorId))];
  const myTutors     = data.tutors.filter(t => myTutorIds.includes(t.id));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${B.tealLight} 0%, ${B.coralLight} 100%)` }}>
        <h1 className="text-2xl font-bold" style={{ color: B.tealDark }}>Hello, {centre.ownerFirstName}! 🏫</h1>
        <p className="text-sm text-gray-500 mt-1">{centre.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Students",     value: myStudents.length, color: B.tealDark },
          { label: "Tutors",       value: myTutors.length,   color: B.coral    },
          { label: "Active Links", value: myLinks.length,    color: B.gold     },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Our Students</h2>
        {myStudents.length === 0 ? <p className="text-sm text-gray-400">No students at this centre yet.</p> : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ background: B.tealLight }}>
                {["Student","Grade","Curriculum","Tutors"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: B.tealDark }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {myStudents.map(st => {
                  const sLinks = data.links.filter(l => l.studentId === st.id);
                  const tuts   = [...new Set(sLinks.map(l => l.tutorId))].map(tid => data.tutors.find(t => t.id === tid)).filter(Boolean);
                  return (
                    <tr key={st.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{st.firstName} {st.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{st.grade}</td>
                      <td className="px-4 py-3 text-gray-500">{st.curriculum}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{tuts.map(t => `${t.firstName} ${t.lastName}`).join(", ") || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {myNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Centre Notes</h2>
          <div className="space-y-2">
            {myNotes.map(n => (
              <div key={n.id} className="rounded-xl p-4 border" style={{
                background: n.type === "complaint" ? B.coralLight : B.tealLight,
                borderColor: n.type === "complaint" ? B.coral : B.teal,
              }}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: n.type === "complaint" ? B.coralDark : B.tealDark }}>{n.type}</span>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
                <p className="text-sm text-gray-700">{n.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Centre Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400 text-xs block mb-0.5">Address</span>{centre.address}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Phone</span>{centre.phone}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Email</span>{centre.email}</div>
          <div><span className="text-gray-400 text-xs block mb-0.5">Status</span>{centre.status}</div>
        </div>
      </div>
    </div>
  );
}


// ─── PAGE: PAYROLL ────────────────────────────────────────────────────────────

function PayrollPage({ data, setData }) {
  const [tab,         setTab]         = useState("invoices");
  const [month,       setMonth]       = useState(today().slice(0, 7));
  const [expandedId,  setExpandedId]  = useState(null);
  const [rateForm,    setRateForm]    = useState({ year: new Date().getFullYear() + 1, regularRate: 235, academyRate: 225, centreRate: 235, wifiAllowance: 40 });
  const [editRateId,  setEditRateId]  = useState(null);

  // All tutors that have attended logbook entries in selected month
  const activeTutors = useMemo(() => {
    const ids = [...new Set((data.logbook || []).filter(l => l.date.startsWith(month) && l.attended).map(l => l.tutorId))];
    return ids.map(id => (data.tutors || []).find(t => t.id === id)).filter(Boolean);
  }, [data, month]);

  const approveForTutor = (tutorId) => {
    setData(d => {
      const existing = (d.invoiceStatus || []).find(s => s.tutorId === tutorId && s.month === month);
      const updated  = existing
        ? d.invoiceStatus.map(s => s.tutorId === tutorId && s.month === month ? { ...s, tutorApproved: true, adminApproved: true } : s)
        : [...(d.invoiceStatus || []), { id: "inv" + uid(), tutorId, month, tutorApproved: true, adminApproved: true, paid: false, paidDate: null, paidAmount: 0 }];
      return { ...d, invoiceStatus: updated };
    });
  };

  const markPaid = (tutorId, amount) => {
    setData(d => {
      const existing = (d.invoiceStatus || []).find(s => s.tutorId === tutorId && s.month === month);
      const updated  = existing
        ? d.invoiceStatus.map(s => s.tutorId === tutorId && s.month === month ? { ...s, tutorApproved: true, adminApproved: true, paid: true, paidDate: today(), paidAmount: amount } : s)
        : [...(d.invoiceStatus || []), { id: "inv" + uid(), tutorId, month, tutorApproved: true, adminApproved: true, paid: true, paidDate: today(), paidAmount: amount }];
      return { ...d, invoiceStatus: updated };
    });
  };

  const approveClaimAdmin = (claimId, approve) => {
    setData(d => ({
      ...d,
      tutorClaims: (d.tutorClaims || []).map(c => c.id === claimId ? { ...c, status: approve ? "approved" : "rejected" } : c),
    }));
  };

  const addRate = () => {
    if (!rateForm.year) return;
    setData(d => ({ ...d, tutorRates: [...(d.tutorRates || []), { ...rateForm, id: "rate" + uid(), year: Number(rateForm.year), regularRate: Number(rateForm.regularRate), academyRate: Number(rateForm.academyRate), centreRate: Number(rateForm.centreRate), wifiAllowance: Number(rateForm.wifiAllowance) }] }));
    setRateForm({ year: new Date().getFullYear() + 1, regularRate: 235, academyRate: 225, centreRate: 235, wifiAllowance: 40 });
  };

  const updateRate = (id, field, value) => {
    setData(d => ({ ...d, tutorRates: (d.tutorRates || []).map(r => r.id === id ? { ...r, [field]: Number(value) } : r) }));
  };

  const locked = isInvoiceLocked(month);

  const unapprovedTutors = activeTutors.filter(t => {
    const inv = buildTutorInvoice(t.id, month, data);
    return !inv.isApproved && !locked;
  });

  const generatePDF = () => {
    const pages = activeTutors.map(t => buildTutorInvoiceHTML(t, buildTutorInvoice(t.id, month, data), month)).join("");
    printInvoiceWindow(pages, `Payroll ${month}`);
  };
  const downloadOneTutorPDF = (t) => {
    printInvoiceWindow(buildTutorInvoiceHTML(t, buildTutorInvoice(t.id, month, data), month), `Invoice ${t.firstName} ${t.lastName} ${month}`);
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none";

  const sortedRates = [...(data.tutorRates || [])].sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tutor invoices, claims and rate management</p>
        </div>
        <div className="flex gap-2">
          {tab === "invoices" && (
            <Btn onClick={generatePDF} variant="secondary"><Printer size={15} /> Download PDF</Btn>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200">
        {[{id:"invoices",label:"Invoices"},{id:"rates",label:"Rates"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-teal-500 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "invoices" && (
        <div className="space-y-4">
          {/* Month selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            {locked && (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#fef3c7", color: "#92400e" }}>
                <Clock size={11} className="inline mr-1" />Auto-locked (26th passed)
              </span>
            )}
          </div>

          {/* Unapproved warning */}
          {unapprovedTutors.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "#fef3c7", color: "#92400e" }}>
              <AlertCircle size={16} />
              <span>{unapprovedTutors.length} tutor{unapprovedTutors.length > 1 ? "s have" : " has"} not yet approved their invoice for {fmtMonth(month)}.</span>
            </div>
          )}

          {activeTutors.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No attended lessons logged for {fmtMonth(month)}.</div>
          )}

          {activeTutors.map(tutor => {
            const inv      = buildTutorInvoice(tutor.id, month, data);
            const expanded = expandedId === tutor.id;
            const statusLabel = inv.isPaid ? "Paid" : inv.isApproved ? (locked && !inv.statusRec?.tutorApproved ? "Auto-locked" : "Approved") : "Pending";
            const statusStyle = inv.isPaid
              ? { background: "#dcfce7", color: "#166534" }
              : inv.isApproved
                ? (locked && !inv.statusRec?.tutorApproved ? { background: "#fef3c7", color: "#92400e" } : { background: B.tealLight, color: B.tealDark })
                : { background: "#f3f4f6", color: "#6b7280" };

            return (
              <div key={tutor.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expanded ? null : tutor.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: B.teal }}>
                      {tutor.firstName[0]}{tutor.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{tutor.firstName} {tutor.lastName}</p>
                      <p className="text-xs text-gray-400">{inv.lessonLines.length} lesson{inv.lessonLines.length !== 1 ? "s" : ""} · {inv.allClaims.length} claim{inv.allClaims.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Lessons</p>
                      <p className="text-sm font-semibold text-gray-700">{fmtZAR(inv.lessonTotal)}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Claims</p>
                      <p className="text-sm font-semibold text-gray-700">{fmtZAR(inv.claimsTotal)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-base font-bold" style={{ color: B.tealDark }}>{fmtZAR(inv.grandTotal)}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={statusStyle}>{statusLabel}</span>
                    <ChevronRight size={16} className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-gray-100 px-5 pb-5 space-y-5">
                    {/* Action buttons */}
                    <div className="flex gap-2 pt-4 flex-wrap">
                      {!inv.isApproved && (
                        <Btn size="sm" variant="success" onClick={() => approveForTutor(tutor.id)}>
                          <ThumbsUp size={13} /> Approve for Tutor
                        </Btn>
                      )}
                      {inv.isApproved && !inv.isPaid && (
                        <>
                          <Btn size="sm" onClick={() => markPaid(tutor.id, inv.grandTotal)}>
                            <Banknote size={13} /> Mark Paid ({fmtZAR(inv.grandTotal)})
                          </Btn>
                          <Btn size="sm" variant="secondary" onClick={() => downloadOneTutorPDF(tutor)}>
                            <Printer size={13} /> Download Invoice
                          </Btn>
                        </>
                      )}
                      {inv.isPaid && (
                        <span className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg font-medium">
                          Paid {inv.statusRec?.paidDate ? fmtDate(inv.statusRec.paidDate) : ""}
                        </span>
                      )}
                    </div>

                    {/* Lesson table */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Lesson Lines</h4>
                      {inv.lessonLines.length === 0 ? (
                        <p className="text-sm text-gray-400">No attended lessons.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-100">
                          <table className="min-w-full text-xs divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-gray-500 font-medium">Date</th>
                                <th className="px-3 py-2 text-left text-gray-500 font-medium">Student</th>
                                <th className="px-3 py-2 text-left text-gray-500 font-medium">Subject</th>
                                <th className="px-3 py-2 text-left text-gray-500 font-medium">Duration</th>
                                <th className="px-3 py-2 text-left text-gray-500 font-medium">Type</th>
                                <th className="px-3 py-2 text-right text-gray-500 font-medium">Rate/hr</th>
                                <th className="px-3 py-2 text-right text-gray-500 font-medium">Wifi</th>
                                <th className="px-3 py-2 text-right text-gray-500 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {inv.lessonLines.map(l => (
                                <tr key={l.id}>
                                  <td className="px-3 py-2 text-gray-700">{fmtDate(l.date)}</td>
                                  <td className="px-3 py-2 text-gray-700">{l.studentName}</td>
                                  <td className="px-3 py-2 text-gray-700">{l.subjectLabel}</td>
                                  <td className="px-3 py-2 text-gray-700">{l.hours.toFixed(2)}h</td>
                                  <td className="px-3 py-2">
                                    <span className="capitalize text-xs px-2 py-0.5 rounded-full" style={l.lessonType === "centre" ? { background: B.tealLight, color: B.tealDark } : l.lessonType === "academy" ? { background: B.coralLight, color: B.coralDark } : { background: "#f3f4f6", color: "#6b7280" }}>
                                      {l.lessonType}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-gray-700">{fmtZAR(l.baseRate)}</td>
                                  <td className="px-3 py-2 text-right text-gray-500">{l.wifiAmt > 0 ? fmtZAR(l.wifiAmt) : "—"}</td>
                                  <td className="px-3 py-2 text-right font-semibold text-gray-800">{fmtZAR(l.lineTotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-50">
                                <td colSpan={7} className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Lesson Total</td>
                                <td className="px-3 py-2 text-right font-bold text-gray-800">{fmtZAR(inv.lessonTotal)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Claims section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Claims</h4>
                      {inv.allClaims.length === 0 ? (
                        <p className="text-sm text-gray-400">No claims submitted.</p>
                      ) : (
                        <div className="space-y-2">
                          {inv.allClaims.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{c.type} — {fmtDate(c.date)}</p>
                                {c.studentNames && <p className="text-xs text-gray-500">{c.studentNames}</p>}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold">{fmtZAR(Number(c.amount))}</span>
                                {c.status === "pending" && (
                                  <div className="flex gap-1">
                                    <button onClick={() => approveClaimAdmin(c.id, true)}
                                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors" title="Approve">
                                      <ThumbsUp size={14} />
                                    </button>
                                    <button onClick={() => approveClaimAdmin(c.id, false)}
                                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Reject">
                                      <ThumbsDown size={14} />
                                    </button>
                                  </div>
                                )}
                                {c.status !== "pending" && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${c.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{c.status}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {inv.claimsTotal > 0 && (
                            <div className="flex justify-end text-sm font-semibold text-gray-700 px-3">
                              Approved Claims Total: {fmtZAR(inv.claimsTotal)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Grand total */}
                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Grand Total</p>
                        <p className="text-xl font-bold" style={{ color: B.tealDark }}>{fmtZAR(inv.grandTotal)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "rates" && (
        <div className="space-y-6">
          {/* Existing rates table */}
          <Section title="Pay Rates by Year">
            <TableWrap>
              <thead><tr>
                <TH>Year</TH><TH className="text-right">Regular (R/hr)</TH><TH className="text-right">Academy (R/hr)</TH><TH className="text-right">Centre (R/hr)</TH><TH className="text-right">Wifi (R/session)</TH><TH></TH>
              </tr></thead>
              <tbody>
                {sortedRates.map(r => (
                  <TR key={r.id}>
                    <TD className="font-semibold">{r.year}</TD>
                    {editRateId === r.id ? (
                      <>
                        <TD><input type="number" className={inputCls} value={r.regularRate} onChange={e => updateRate(r.id, "regularRate", e.target.value)} /></TD>
                        <TD><input type="number" className={inputCls} value={r.academyRate} onChange={e => updateRate(r.id, "academyRate", e.target.value)} /></TD>
                        <TD><input type="number" className={inputCls} value={r.centreRate}  onChange={e => updateRate(r.id, "centreRate",  e.target.value)} /></TD>
                        <TD><input type="number" className={inputCls} value={r.wifiAllowance} onChange={e => updateRate(r.id, "wifiAllowance", e.target.value)} /></TD>
                        <TD><Btn size="sm" variant="success" onClick={() => setEditRateId(null)}><CheckCircle size={13} /> Done</Btn></TD>
                      </>
                    ) : (
                      <>
                        <TD className="text-right">{fmtZAR(r.regularRate)}</TD>
                        <TD className="text-right">{fmtZAR(r.academyRate)}</TD>
                        <TD className="text-right">{fmtZAR(r.centreRate)}</TD>
                        <TD className="text-right">{fmtZAR(r.wifiAllowance)}</TD>
                        <TD><Btn size="sm" variant="ghost" onClick={() => setEditRateId(r.id)}><Edit2 size={13} /></Btn></TD>
                      </>
                    )}
                  </TR>
                ))}
                {sortedRates.length === 0 && <tr><td colSpan={6} className="text-center text-sm text-gray-400 py-6">No rates configured.</td></tr>}
              </tbody>
            </TableWrap>
          </Section>

          {/* Claim types */}
          <Section title="Claimable Services & Products">
            <p className="text-xs text-gray-500 mb-3">These are the options tutors see when submitting a claim. Add any service, product, or allowance type you want tutors to be able to claim for.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(data.claimTypes||[]).map(ct => (
                <span key={ct} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                  style={{background:B.tealLight, color:B.tealDark, borderColor:B.teal}}>
                  {ct}
                  <button onClick={() => setData(d=>({...d, claimTypes:(d.claimTypes||[]).filter(t=>t!==ct)}))}
                    className="hover:text-red-500 transition-colors ml-0.5" title="Remove">
                    <X size={11}/>
                  </button>
                </span>
              ))}
              {(data.claimTypes||[]).length === 0 && <p className="text-sm text-gray-400">No claim types defined. Add one below.</p>}
            </div>
            <div className="flex gap-2">
              <input id="newClaimType" placeholder="e.g. Assessment, Admin Fee, Printing…"
                className={inputCls} style={{maxWidth:"320px"}}
                onKeyDown={e=>{
                  if(e.key==="Enter"){
                    const v=e.target.value.trim();
                    if(v&&!(data.claimTypes||[]).includes(v)){
                      setData(d=>({...d,claimTypes:[...(d.claimTypes||[]),v]}));
                    }
                    e.target.value="";
                  }
                }}/>
              <button
                onClick={()=>{
                  const el=document.getElementById("newClaimType");
                  const v=el?.value?.trim();
                  if(v&&!(data.claimTypes||[]).includes(v)){
                    setData(d=>({...d,claimTypes:[...(d.claimTypes||[]),v]}));
                    el.value="";
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                style={{background:B.tealDark}}>
                <Plus size={13}/> Add Type
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Press Enter or click Add. Removing a type only affects future claims — existing claims keep their type.</p>
          </Section>

          {/* Add new rate */}
          <Section title="Add New Year Rate">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <input type="number" className={inputCls} value={rateForm.year} onChange={e => setRateForm(f => ({ ...f, year: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Regular (R/hr)</label>
                <input type="number" className={inputCls} value={rateForm.regularRate} onChange={e => setRateForm(f => ({ ...f, regularRate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Academy (R/hr)</label>
                <input type="number" className={inputCls} value={rateForm.academyRate} onChange={e => setRateForm(f => ({ ...f, academyRate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Centre (R/hr)</label>
                <input type="number" className={inputCls} value={rateForm.centreRate}  onChange={e => setRateForm(f => ({ ...f, centreRate:  e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Wifi (R/session)</label>
                <input type="number" className={inputCls} value={rateForm.wifiAllowance} onChange={e => setRateForm(f => ({ ...f, wifiAllowance: e.target.value }))} />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Btn onClick={addRate}><Plus size={15} /> Add Rate</Btn>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

// Role switcher — all options the tester can cycle through
// ─── ROLE SWITCHER + APP ──────────────────────────────────────────────────────

// Build the list of selectable roles from current data
function buildRoleOptions(data) {
  const opts = [{ key: "admin::admin", label: "🔑  Admin / Owner", role: "admin", id: "admin" }];
  data.tutors.forEach(t   => opts.push({ key: `tutor::${t.id}`,   label: `👩‍🏫  Tutor — ${t.firstName} ${t.lastName}`,          role: "tutor",   id: t.id  }));
  data.students.forEach(s => opts.push({ key: `student::${s.id}`, label: `🎓  Student — ${s.firstName} ${s.lastName}`,         role: "student", id: s.id  }));
  data.students.forEach(s => opts.push({ key: `parent::${s.id}`,  label: `👨‍👩‍👦  Parent of ${s.firstName} ${s.lastName}`,         role: "parent",  id: s.id  }));
  data.centres.forEach(c  => opts.push({ key: `centre::${c.id}`,  label: `🏫  Centre — ${c.name}`,                             role: "centre",  id: c.id  }));
  return opts;
}

// Nav items per role  (id "home" = portal, others = existing page keys)
const ROLE_NAV_ITEMS = {
  tutor:   [
    { id: "home", label: "Tutor Portal", icon: LayoutDashboard },
  ],
  student: [
    { id: "home",     label: "My Dashboard",  icon: LayoutDashboard },
    { id: "academy",  label: "My Courses",    icon: BookOpen        },
    { id: "links",    label: "My Tutors",     icon: GraduationCap   },
  ],
  parent: [
    { id: "home",     label: "Overview",      icon: LayoutDashboard },
    { id: "students", label: "My Child",      icon: Users           },
    { id: "academy",  label: "Academy",       icon: BookOpen        },
    { id: "links",    label: "Tutors",        icon: GraduationCap   },
  ],
  centre: [
    { id: "home",     label: "My Dashboard",  icon: LayoutDashboard },
    { id: "students", label: "Our Students",  icon: Users           },
    { id: "tutors",   label: "Our Tutors",    icon: GraduationCap   },
    { id: "reports",  label: "Reports",       icon: FileText        },
  ],
};

export default function App() {
  const [user, setUser]         = useState(null);
  const [page, setPage]         = useState("dashboard");
  const [roleKey, setRoleKey]   = useState("admin::admin");
  const [data, setData] = useState({
    students:      INIT_STUDENTS,
    tutors:        INIT_TUTORS,
    subjects:      INIT_SUBJECTS,
    links:         INIT_LINKS,
    siblings:      INIT_SIBLINGS,
    tutorNotes:    INIT_TUTOR_NOTES,
    centres:       INIT_CENTRES,
    centreNotes:   INIT_CENTRE_NOTES,
    purchases:     INIT_PURCHASES,
    financials:    INIT_FINANCIALS,
    courses:             INIT_COURSES,
    modules:             INIT_MODULES,
    lessons:             INIT_LESSONS,
    quizzes:             INIT_QUIZZES,
    enrolments:          INIT_ENROLMENTS,
    progress:            INIT_PROGRESS,
    announcements:       INIT_ANNOUNCEMENTS,
    logbook:             INIT_LOGBOOK,
    scheduledLessons:    INIT_SCHEDULED_LESSONS,
    messages:            INIT_MESSAGES,
    tutorStudentNotes:   INIT_TUTOR_STUDENT_NOTES,
    studentReports:      INIT_STUDENT_REPORTS,
    tutorRates:          INIT_TUTOR_RATES,
    tutorClaims:         INIT_TUTOR_CLAIMS,
    invoiceStatus:       INIT_INVOICE_STATUS,
    claimTypes:          INIT_CLAIM_TYPES,
  });

  const roleOptions = useMemo(() => buildRoleOptions(data), [data]);
  const activeOpt   = roleOptions.find(o => o.key === roleKey) || roleOptions[0];
  const isAdmin     = activeOpt.role === "admin";

  // Filter data to what the active role can see
  const filteredData = useMemo(() => {
    const { role, id } = activeOpt;
    if (role === "admin") return data;

    if (role === "tutor") {
      const myLinks      = data.links.filter(l => l.tutorId === id);
      const myStudentIds = [...new Set(myLinks.map(l => l.studentId))];
      return {
        ...data,
        students:           data.students.filter(s => myStudentIds.includes(s.id)),
        links:              myLinks,
        tutors:             data.tutors.filter(t => t.id === id),
        tutorNotes:         data.tutorNotes.filter(n => n.tutorId === id && n.source === "admin" && n.type !== "complaint"),
        purchases:          data.purchases.filter(p => myStudentIds.includes(p.studentId)),
        enrolments:         data.enrolments.filter(e => myStudentIds.includes(e.studentId)),
        progress:           data.progress.filter(p => myStudentIds.includes(p.studentId)),
        // New tutor-specific data — all logs visible, own schedule/messages/reports
        logbook:            data.logbook.filter(l => myStudentIds.includes(l.studentId)),
        scheduledLessons:   data.scheduledLessons.filter(s => s.tutorId === id),
        messages:           data.messages.filter(m => m.tutorId === id),
        tutorStudentNotes:  data.tutorStudentNotes.filter(n => n.tutorId === id),
        studentReports:     data.studentReports.filter(r => r.tutorId === id),
        tutorRates:         data.tutorRates,
        tutorClaims:        (data.tutorClaims || []).filter(c => c.tutorId === id),
        invoiceStatus:      (data.invoiceStatus || []).filter(s => s.tutorId === id),
        claimTypes:         data.claimTypes || INIT_CLAIM_TYPES,
      };
    }

    if (role === "student") {
      const myLinks    = data.links.filter(l => l.studentId === id);
      const myTutorIds = [...new Set(myLinks.map(l => l.tutorId))];
      return {
        ...data,
        students:          data.students.filter(s => s.id === id),
        links:             myLinks,
        tutors:            data.tutors.filter(t => myTutorIds.includes(t.id)),
        purchases:         data.purchases.filter(p => p.studentId === id),
        enrolments:        data.enrolments.filter(e => e.studentId === id),
        progress:          data.progress.filter(p => p.studentId === id),
        scheduledLessons:  data.scheduledLessons.filter(sl => sl.studentId === id),
        messages:          data.messages.filter(m => m.studentId === id),
        // tutorStudentNotes intentionally excluded — students cannot see these
        tutorStudentNotes: [],
        studentReports:    data.studentReports.filter(r => r.studentId === id),
      };
    }

    if (role === "parent") {
      const myLinks    = data.links.filter(l => l.studentId === id);
      const myTutorIds = [...new Set(myLinks.map(l => l.tutorId))];
      return {
        ...data,
        students:          data.students.filter(s => s.id === id),
        links:             myLinks,
        tutors:            data.tutors.filter(t => myTutorIds.includes(t.id)),
        purchases:         data.purchases.filter(p => p.studentId === id),
        enrolments:        data.enrolments.filter(e => e.studentId === id),
        progress:          data.progress.filter(p => p.studentId === id),
        scheduledLessons:  data.scheduledLessons.filter(sl => sl.studentId === id),
        // Tutor-to-parent notes: parents CAN see these, students cannot
        tutorStudentNotes: data.tutorStudentNotes.filter(n => n.studentId === id),
        studentReports:    data.studentReports.filter(r => r.studentId === id),
      };
    }

    if (role === "centre") {
      const myStudents   = data.students.filter(s => s.centreId === id);
      const myStudentIds = myStudents.map(s => s.id);
      const myLinks      = data.links.filter(l => myStudentIds.includes(l.studentId));
      const myTutorIds   = [...new Set(myLinks.map(l => l.tutorId))];
      return {
        ...data,
        students:     myStudents,
        links:        myLinks,
        tutors:       data.tutors.filter(t => myTutorIds.includes(t.id)),
        centres:      data.centres.filter(c => c.id === id),
        centreNotes:  data.centreNotes.filter(n => n.centreId === id),
        purchases:    data.purchases.filter(p => myStudentIds.includes(p.studentId)),
        enrolments:   data.enrolments.filter(e => myStudentIds.includes(e.studentId)),
        progress:     data.progress.filter(p => myStudentIds.includes(p.studentId)),
      };
    }

    return data;
  }, [activeOpt, data]);

  const unassigned = useMemo(
    () => filteredData.students.filter(s => !filteredData.links.some(l => l.studentId === s.id)).length,
    [filteredData]
  );

  // Portal home page for non-admin roles
  const portalHome = useMemo(() => {
    const { role, id } = activeOpt;
    if (role === "tutor")   { const t = data.tutors.find(x => x.id === id);   return t ? <TutorPortal   tutor={t}    data={filteredData} setData={setData} /> : null; }
    if (role === "student") { const s = data.students.find(x => x.id === id); return s ? <StudentPortal student={s} data={filteredData} setData={setData} /> : null; }
    if (role === "parent")  { const s = data.students.find(x => x.id === id); return s ? <ParentPortal  student={s} data={filteredData} setData={setData} /> : null; }
    if (role === "centre")  { const c = data.centres.find(x => x.id === id);  return c ? <CentrePortal  centre={c}  data={filteredData} /> : null; }
    return null;
  }, [activeOpt, filteredData, data, setData]);

  // All pages use filteredData so each role only sees their own data
  const pages = {
    home:       portalHome,
    dashboard:  <Dashboard     data={filteredData} onNav={setPage} />,
    students:   <StudentsPage  data={filteredData} setData={setData} />,
    tutors:     <TutorsPage    data={filteredData} setData={setData} />,
    links:      <LinksPage     data={filteredData} setData={setData} />,
    centres:    <CentresPage   data={filteredData} setData={setData} />,
    accounting: <AccountingPage data={filteredData} setData={setData} />,
    payroll:    <PayrollPage    data={filteredData} setData={setData} />,
    stats:      <StatsPage     data={filteredData} />,
    reports:    <ReportsPage   data={filteredData} />,
    settings:   <SettingsPage  data={filteredData} setData={setData} />,
    academy:    <AcademyPage   data={filteredData} setData={setData} />,
  };

  // Nav items for the current role
  const currentNav = isAdmin ? NAV : (ROLE_NAV_ITEMS[activeOpt.role] || []);

  const handleRoleChange = (key) => {
    setRoleKey(key);
    // Set a sensible default page for the role
    const opt = roleOptions.find(o => o.key === key);
    if (!opt || opt.role === "admin") setPage("dashboard");
    else setPage("home");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LogoMark size={38} />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase leading-none" style={{ color: B.tealDark }}>LEARN TO LINK</p>
              <p className="text-xs text-gray-400 mt-0.5 tracking-wide">CRM + Academy</p>
            </div>
          </div>
        </div>

        {/* Role dropdown */}
        <div className="px-3 py-3 border-b border-gray-100">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Viewing as</label>
          <select
            value={roleKey}
            onChange={e => handleRoleChange(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": B.teal }}
          >
            {roleOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {currentNav.map(n => (
            <div key={n.id}>
              {n.divider && <div className="my-2 pt-1"><div className="border-t border-gray-100" /></div>}
              <button
                onClick={() => setPage(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${page === n.id ? "" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                style={page === n.id ? { background: n.id === "academy" ? B.coralLight : B.tealLight, color: n.id === "academy" ? B.coral : B.tealDark } : undefined}
              >
                <n.icon size={17} />
                {n.label}
                {n.id === "links" && unassigned > 0 && (
                  <span className="ml-auto bg-gray-300 text-gray-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unassigned}</span>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: B.teal }}>LTL</div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Learn to Link</p>
              <p className="text-xs text-gray-400">CRM + Academy</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {pages[page]}
        </div>
      </main>
    </div>
  );
}
