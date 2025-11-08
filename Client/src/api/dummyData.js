// ======================== AUTH DATA ========================
export const dummyCitizens = [
  {
    _id: "citizen001",
    name: "Riya Sharma",
    email: "riya.sharma@example.com",
    password: "123456",
  },
  {
    _id: "citizen002",
    name: "Arjun Patel",
    email: "om@mail.com",
    password: "1",
  },
];

export const dummyWorkers = [
  {
    _id: "worker001",
    name: "Ravi Mehta",
    email: "ravi.mehta@example.com",
    phone: "9876543210",
    skills: ["Plumbing", "Electrical", "Street Maintenance"],
    location: { lat: 19.075984, lng: 72.877656 },
  },
  {
    _id: "worker002",
    name: "Sunita Deshmukh",
    email: "sunita.deshmukh@example.com",
    phone: "9988776655",
    skills: ["Cleaning", "Garbage Collection"],
    location: { lat: 18.5204, lng: 73.8567 },
  },
];

export const dummyAdmins = [
  {
    _id: "admin001",
    name: "Municipal Officer",
    email: "admin@snapfix.gov",
    role: "Local",
  },
];

// ======================== CITIZEN REPORTS ========================
export const dummyReports = [
  {
    _id: "rep001",
    title: "Broken Streetlight near City Park",
    description:
      "A streetlight near the entrance of City Park has been non-functional for over a week, making the area unsafe at night.",
    imageUrl:
      "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800",
    category: "Infrastructure",
    status: "Pending",
    upvotes: 12,
    createdBy: { _id: "citizen001", name: "Riya Sharma" },
    location: { lat: 19.0176, lng: 72.8562 },
    date: "2025-11-04T19:45:00Z",
  },
  {
    _id: "rep002",
    title: "Overflowing Garbage Bin near Market Area",
    description:
      "The garbage bin opposite the main vegetable market has been overflowing for three days, causing a foul smell and attracting stray animals.",
    imageUrl:
      "https://images.unsplash.com/photo-1581574200468-8a5b1a99d1f0?w=800",
    category: "Sanitation",
    status: "In Progress",
    upvotes: 33,
    createdBy: { _id: "citizen002", name: "Arjun Patel" },
    location: { lat: 19.017, lng: 72.8437 },
    date: "2025-11-05T08:30:00Z",
  },
  {
    _id: "rep003",
    title: "Potholes on Main Road",
    description:
      "Multiple deep potholes have developed on the service lane near the IT Park. It’s causing traffic jams and potential vehicle damage.",
    imageUrl:
      "https://images.unsplash.com/photo-1602785165833-c63b1e4b9b33?w=800",
    category: "Road",
    status: "Resolved",
    upvotes: 56,
    createdBy: { _id: "citizen002", name: "Arjun Patel" },
    location: { lat: 18.5918, lng: 73.7389 },
    date: "2025-11-03T14:10:00Z",
  },
];

// ======================== BIDS (Worker Proposals) ========================
export const dummyBids = [
  {
    _id: "bid001",
    reportId: "rep001",
    gigWorkerId: { _id: "worker001", name: "Ravi Mehta" },
    bidAmount: 500,
    resourceNote: "Requires electrical tools and wiring materials.",
    duration: "2 days",
    status: "Pending",
  },
  {
    _id: "bid002",
    reportId: "rep002",
    gigWorkerId: { _id: "worker002", name: "Sunita Deshmukh" },
    bidAmount: 300,
    resourceNote: "Needs garbage truck and 2 workers.",
    duration: "1 day",
    status: "Approved",
  },
];

// ======================== TASKS (Assigned Work) ========================
export const dummyTasks = [
  {
    _id: "task001",
    reportId: "rep002",
    gigWorkerId: "worker002",
    status: "Assigned",
    paymentStatus: "Pending",
    proof: {
      imageUrl:
        "https://images.unsplash.com/photo-1617093594016-0b0ce40df7e5?w=800",
      remarks: "Garbage cleared and area sanitized.",
      uploadedAt: "2025-11-06T12:00:00Z",
      location: { lat: 19.017, lng: 72.8437 },
    },
  },
];

// ======================== MOCK API HANDLERS ========================
export const DummyAPI = {
  // Auth
  loginCitizen: (email, password) =>
    dummyCitizens.find((c) => c.email === email && c.password === password) || null,

  getNearbyReports: (lat, lng) => dummyReports.filter(() => true), // return all for mock
  getReportById: (id) => dummyReports.find((r) => r._id === id),

  // Worker
  getWorkerProfile: (id) => dummyWorkers.find((w) => w._id === id),
  getBidsForReport: (reportId) => dummyBids.filter((b) => b.reportId === reportId),

  // Admin
  getAllReports: () => dummyReports,
  getReportWithBids: (reportId) => ({
    report: dummyReports.find((r) => r._id === reportId),
    bids: dummyBids.filter((b) => b.reportId === reportId),
  }),
};
