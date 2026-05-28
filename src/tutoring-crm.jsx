import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, BarChart2,
  Settings as SettingsIcon, Search, Plus, X, Edit2, Trash2,
  Link as LinkIcon, DollarSign, BookMarked, TrendingUp,
  CheckCircle, ThumbsUp, ThumbsDown, StickyNote,
  Building2, FileText, MapPin, Printer
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

const PALETTE = ["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"];
const NOTE_TYPES = ["compliment","complaint","general"];

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
  { id: "st1", firstName: "Siyanda", lastName: "Dlamini",       curriculum: "IEB",       grade: "Grade 11", status: "Active",   enrolledDate: "2025-01-15", centreId: ""   },
  { id: "st2", firstName: "Mia",     lastName: "van der Merwe", curriculum: "CAPS",      grade: "Grade 10", status: "Active",   enrolledDate: "2025-02-01", centreId: "c1" },
  { id: "st3", firstName: "Langa",   lastName: "Nkosi",         curriculum: "IEB",       grade: "Grade 12", status: "Active",   enrolledDate: "2024-11-10", centreId: "c1" },
  { id: "st4", firstName: "Priya",   lastName: "Patel",         curriculum: "Cambridge", grade: "IGCSE",    status: "Active",   enrolledDate: "2025-03-05", centreId: "c2" },
  { id: "st5", firstName: "Nomsa",   lastName: "Dlamini",       curriculum: "IEB",       grade: "Grade 9",  status: "Active",   enrolledDate: "2025-04-01", centreId: ""   },
  { id: "st6", firstName: "James",   lastName: "Chen",          curriculum: "Cambridge", grade: "AS Level", status: "Active",   enrolledDate: "2025-04-20", centreId: "c2" },
  { id: "st7", firstName: "Aisha",   lastName: "Moosa",         curriculum: "CAPS",      grade: "Grade 8",  status: "Active",   enrolledDate: "2025-05-10", centreId: ""   },
];

const INIT_TUTORS = [
  { id: "t1", firstName: "Ayanda", lastName: "Mokoena",  email: "ayanda@tutors.com", phone: "072 100 2000", subjectIds: ["s1","s2"], status: "Active" },
  { id: "t2", firstName: "Ruan",   lastName: "Botha",    email: "ruan@tutors.com",   phone: "082 200 3000", subjectIds: ["s3","s6"], status: "Active" },
  { id: "t3", firstName: "Lerato", lastName: "Sithole",  email: "lerato@tutors.com", phone: "076 300 4000", subjectIds: ["s4","s5"], status: "Active" },
  { id: "t4", firstName: "Marco",  lastName: "Ferreira", email: "marco@tutors.com",  phone: "083 400 5000", subjectIds: ["s1","s5"], status: "Active" },
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
  { id: "tn1", tutorId: "t1", type: "compliment", note: "Parent of Siyanda said Ayanda is excellent — very patient and clear.", date: "2025-04-15" },
  { id: "tn2", tutorId: "t2", type: "complaint",  note: "Ruan was 15 minutes late to session on 3 May without notice.",        date: "2025-05-03" },
];

const INIT_CENTRE_NOTES = [
  { id: "cn1", centreId: "c1", type: "general",   note: "Signed 12-month agreement in January 2025.",                date: "2025-01-10" },
  { id: "cn2", centreId: "c2", type: "complaint",  note: "Owner flagged timetable clashes in Week 3 of February.",    date: "2025-02-18" },
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

const CSS = `*{box-sizing:border-box}body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#111;font-size:14px}h1{color:#4338ca;border-bottom:3px solid #4338ca;padding-bottom:8px;margin-bottom:4px}h2{color:#374151;margin-top:28px;margin-bottom:10px;font-size:15px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}.meta{color:#6b7280;font-size:12px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin:8px 0 16px}th{background:#f3f4f6;padding:7px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#4b5563}td{padding:7px 12px;border-bottom:1px solid #f3f4f6}.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}.bg{background:#e0e7ff;color:#3730a3}.gg{background:#dcfce7;color:#166534}.gr{background:#f3f4f6;color:#374151}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}.label{font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;margin-bottom:2px}.value{font-size:14px;color:#111827}.ni{padding:8px 12px;border-left:3px solid #6366f1;background:#f8f9ff;margin:6px 0}.ni.complaint{border-color:#ef4444;background:#fff8f8}.ni.compliment{border-color:#22c55e;background:#f8fff8}.nm{font-size:11px;color:#9ca3af;margin-top:3px}@media print{button{display:none}}`;

const openReport = (title, html) => {
  const w = window.open("", "_blank");
  if (!w) { alert("Allow pop-ups to generate reports."); return; }
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>${CSS}</style></head><body><div class="meta">Generated ${new Date().toLocaleDateString("en-ZA")} · TutorOps CRM</div>${html}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  w.document.close();
};

const badge = (text, cls) => `<span class="badge ${cls}">${text}</span>`;
const infoGrid = (items) => `<div class="info-grid">${items.map(([l,v]) => v ? `<div><div class="label">${l}</div><div class="value">${v}</div></div>` : "").join("")}</div>`;
const notesList = (notes) => notes.length === 0 ? "<p>No notes yet.</p>" : [...notes].sort((a,b) => b.date.localeCompare(a.date)).map(n =>
  `<div class="ni ${n.type}"><strong>${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</strong> · ${fmtDate(n.date)}<div>${n.note}</div></div>`
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

// ─── SHARED UI ────────────────────────────────────────────────────────────────

const Badge = ({ children, color = "gray" }) => {
  const map = {
    gray:   "bg-gray-100 text-gray-700",
    green:  "bg-green-100 text-green-700",
    blue:   "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-800",
    red:    "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
    teal:   "bg-teal-100 text-teal-700",
    rose:   "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>;
};

const CURR_COLOR = { IEB: "indigo", CAPS: "green", Cambridge: "purple" };

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

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";
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
  const vr = {
    primary:   "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger:    "bg-red-600 text-white hover:bg-red-700",
    ghost:     "text-gray-600 hover:bg-gray-100",
    success:   "bg-emerald-600 text-white hover:bg-emerald-700",
  }[variant];
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors focus:outline-none ${sz} ${vr} ${className}`}>
      {children}
    </button>
  );
};

const KPI = ({ title, value, sub, icon: Icon, color = "indigo" }) => {
  const ic = {
    indigo: "bg-indigo-50 text-indigo-600", green: "bg-green-50 text-green-600",
    amber:  "bg-amber-50 text-amber-600",   purple: "bg-purple-50 text-purple-600",
    teal:   "bg-teal-50 text-teal-600",     rose:   "bg-rose-50 text-rose-600",
  }[color] || "bg-indigo-50 text-indigo-600";
  return (
    <div className="rounded-xl p-5 shadow-sm border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${ic}`}><Icon size={22} /></div>
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
    className={`border-b border-gray-100 last:border-0 ${onClick ? "cursor-pointer hover:bg-indigo-50 transition-colors" : ""} ${className}`}>
    {children}
  </tr>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <Bar dataKey="newStudents" fill="#6366f1" radius={[4,4,0,0]} name="New Students" />
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
                  <div className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${activeStudents ? (s.count / activeStudents) * 100 : 0}%` }} />
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
              <Line  type="monotone" dataKey="Turnover" stroke="#6366f1" strokeWidth={1.5} dot={false} />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${groupBy === g ? "bg-white shadow text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
              {g === "none" ? "List" : `By ${g}`}
            </button>
          ))}
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
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
          <p className="text-2xl font-bold text-indigo-600">{totalLessons}</p>
          <Btn size="sm" variant="ghost" onClick={onEdit}><Edit2 size={13} /> Edit</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {["links","lessons","siblings"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${tab === t ? "bg-white shadow text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
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
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
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
                    form.subjectIds?.includes(s.id) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
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
    setData(d => ({ ...d, tutorNotes: [...d.tutorNotes, { ...noteForm, id: "tn" + uid(), tutorId: tutor.id }] }));
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
          <p className="text-3xl font-bold text-indigo-600">{activeStudents.length}</p>
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
  const ytdProfit   = ytdTurnover - ytdExpenses;

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
      <div className="grid grid-cols-3 gap-4">
        <KPI title="YTD Turnover"  value={fmtZAR(ytdTurnover)} sub={today().slice(0, 4)} icon={TrendingUp}  color="indigo" />
        <KPI title="YTD Expenses"  value={fmtZAR(ytdExpenses)} sub={today().slice(0, 4)} icon={DollarSign}  color="rose"   />
        <KPI title="YTD Profit"    value={fmtZAR(ytdProfit)}   sub={today().slice(0, 4)} icon={CheckCircle} color={ytdProfit >= 0 ? "green" : "rose"} />
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
              <Bar dataKey="Turnover" fill="#6366f1" radius={[4,4,0,0]} />
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
                <div className="bg-indigo-500 h-2.5 rounded-full"
                  style={{ width: `${activeStudents.length ? (s.active / activeStudents.length) * 100 : 0}%` }} />
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
              <Bar dataKey="active" fill="#6366f1" radius={[4,4,0,0]} name="Active Students" />
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
              <Bar dataKey="value" fill="#6366f1" radius={[0,4,4,0]} name="Students" />
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
              <Bar dataKey="lessons"  fill="#6366f1" radius={[4,4,0,0]} name="Lessons bought" />
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
                  <TD><span className="font-semibold text-indigo-700">{s.active}</span></TD>
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
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
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
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-colors ${type === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}>
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
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase mb-2">Students</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {data.students.map(s => (
                <button key={s.id} onClick={() => openReport(`Student — ${s.firstName} ${s.lastName}`, buildStudentReport(s, data))}
                  className="w-full text-left text-xs text-indigo-800 hover:underline truncate block">
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
  { id: "stats",      label: "Stats",       icon: BarChart2       },
  { id: "reports",    label: "Reports",     icon: FileText        },
  { id: "settings",   label: "Settings",    icon: SettingsIcon    },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState({
    students:    INIT_STUDENTS,
    tutors:      INIT_TUTORS,
    subjects:    INIT_SUBJECTS,
    links:       INIT_LINKS,
    siblings:    INIT_SIBLINGS,
    tutorNotes:  INIT_TUTOR_NOTES,
    centres:     INIT_CENTRES,
    centreNotes: INIT_CENTRE_NOTES,
    purchases:   INIT_PURCHASES,
    financials:  INIT_FINANCIALS,
  });

  const unassigned = useMemo(
    () => data.students.filter(s => !data.links.some(l => l.studentId === s.id)).length,
    [data.students, data.links]
  );

  const pages = {
    dashboard:  <Dashboard    data={data} onNav={setPage} />,
    students:   <StudentsPage data={data} setData={setData} />,
    tutors:     <TutorsPage   data={data} setData={setData} />,
    links:      <LinksPage    data={data} setData={setData} />,
    centres:    <CentresPage  data={data} setData={setData} />,
    accounting: <AccountingPage data={data} setData={setData} />,
    stats:      <StatsPage    data={data} />,
    reports:    <ReportsPage  data={data} />,
    settings:   <SettingsPage data={data} setData={setData} />,
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookMarked size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">TutorOps</p>
              <p className="text-xs text-gray-400 mt-0.5">CRM Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                page === n.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
              <n.icon size={17} />
              {n.label}
              {n.id === "links" && unassigned > 0 && (
                <span className="ml-auto bg-gray-300 text-gray-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unassigned}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">AD</div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
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
