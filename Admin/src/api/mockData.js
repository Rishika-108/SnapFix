// src/data/mockData.js

export const dashboardInsights = [
  {
    id: 1,
    title: "Issues Reported",
    value: 2318,
    change: 6.08,
    filterOptions: ["Today", "Yesterday", "This Week", "This Month"],
  },
  {
    id: 2,
    title: "Issues Resolved",
    value: 1892,
    change: 4.52,
    filterOptions: ["Today", "Yesterday", "This Week", "This Month"],
  },
  {
    id: 3,
    title: "Pending Actions",
    value: 426,
    change: -3.15,
    filterOptions: ["Today", "Yesterday", "This Week", "This Month"],
  },
  {
    id: 4,
    title: "Citizen Satisfaction",
    value: 84,
    change: 1.26,
    filterOptions: ["Today", "Yesterday", "This Week", "This Month"],
  },
];

export const issueTrends = [
  { date: "2025-10-25", reported: 140, resolved: 120 },
  { date: "2025-10-26", reported: 160, resolved: 150 },
  { date: "2025-10-27", reported: 170, resolved: 145 },
  { date: "2025-10-28", reported: 190, resolved: 180 },
  { date: "2025-10-29", reported: 200, resolved: 195 },
  { date: "2025-10-30", reported: 220, resolved: 205 },
  { date: "2025-10-31", reported: 245, resolved: 230 },
];

export const areaPerformance = [
  { area: "Downtown", issues: 620, resolved: 550, satisfaction: 89 },
  { area: "North Zone", issues: 480, resolved: 400, satisfaction: 82 },
  { area: "East End", issues: 510, resolved: 460, satisfaction: 85 },
  { area: "South District", issues: 395, resolved: 350, satisfaction: 78 },
  { area: "West Side", issues: 325, resolved: 300, satisfaction: 80 },
];

export const recentReports = [
  {
    id: "RPT-1001",
    issue: "Broken Streetlight",
    location: "North Avenue",
    status: "Resolved",
    reportedAt: "2025-11-06",
  },
  {
    id: "RPT-1002",
    issue: "Garbage Overflow",
    location: "East Park",
    status: "Pending",
    reportedAt: "2025-11-07",
  },
  {
    id: "RPT-1003",
    issue: "Pothole on Main Road",
    location: "Downtown",
    status: "In Progress",
    reportedAt: "2025-11-05",
  },
  {
    id: "RPT-1004",
    issue: "Water Leakage",
    location: "South Street",
    status: "Resolved",
    reportedAt: "2025-11-06",
  },
  {
    id: "RPT-1005",
    issue: "Traffic Signal Failure",
    location: "West End",
    status: "Pending",
    reportedAt: "2025-11-08",
  },
];
// ============================
// 🗺️ Heatmap Report Data
// ============================

export const heatmapReports = [
  {
    id: 1,
    title: "Pothole on MG Road",
    description: "Large pothole causing traffic congestion during rush hours.",
    category: "Road Damage",
    location: "MG Road, Pune",
    area: "Downtown",
    lat: 18.5204,
    lng: 73.8567,
    status: "in-progress",
    votes: 320,
    citizenId: 101,
    assignedWorkerId: 12,
    createdAt: "2025-11-08", // today
    updatedAt: "2025-11-08",
    image:
      "https://images.unsplash.com/photo-1605106702842-00d17dfc4d56?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Garbage Overflow",
    description: "Overflowing garbage bins leading to foul odor and flies.",
    category: "Sanitation",
    location: "East Park, Pune",
    area: "East End",
    lat: 18.5311,
    lng: 73.8685,
    status: "pending",
    votes: 210,
    citizenId: 102,
    assignedWorkerId: 9,
    createdAt: "2025-11-07", // yesterday
    updatedAt: "2025-11-07",
    image:
      "https://images.unsplash.com/photo-1603712725038-6f86b9a2f24a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Broken Streetlight",
    description:
      "Streetlight not functioning in North Avenue, causing safety issues at night.",
    category: "Lighting",
    location: "North Avenue, Pune",
    area: "North Zone",
    lat: 18.5405,
    lng: 73.8558,
    status: "resolved",
    votes: 180,
    citizenId: 103,
    assignedWorkerId: 8,
    createdAt: "2025-10-28",
    updatedAt: "2025-10-29",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Water Leakage Near Market",
    description:
      "Continuous water leakage near the central market. Possible pipeline burst.",
    category: "Water Supply",
    location: "Central Market, Pune",
    area: "Downtown",
    lat: 18.5225,
    lng: 73.8572,
    status: "in-progress",
    votes: 295,
    citizenId: 104,
    assignedWorkerId: 15,
    createdAt: "2025-10-25",
    updatedAt: "2025-10-27",
    image:
      "https://images.unsplash.com/photo-1615397349754-77b868a5f8d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Illegal Parking Issue",
    description:
      "Vehicles parked illegally blocking pedestrian pathways near City Mall.",
    category: "Traffic",
    location: "City Mall, Pune",
    area: "West Side",
    lat: 18.5141,
    lng: 73.8305,
    status: "pending",
    votes: 160,
    citizenId: 105,
    assignedWorkerId: 10,
    createdAt: "2025-10-20",
    updatedAt: "2025-10-21",
    image:
      "https://images.unsplash.com/photo-1597764696271-9d3e18e379b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Open Manhole",
    description:
      "Open manhole near school area poses risk to pedestrians and children.",
    category: "Public Safety",
    location: "Model Colony, Pune",
    area: "North Zone",
    lat: 18.5402,
    lng: 73.8512,
    status: "in-progress",
    votes: 280,
    citizenId: 106,
    assignedWorkerId: 11,
    createdAt: "2025-10-18",
    updatedAt: "2025-10-19",
    image:
      "https://images.unsplash.com/photo-1616771028733-c0e36f824e02?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Tree Fallen After Storm",
    description:
      "Large tree blocking half the road after heavy rainfall in the South District.",
    category: "Environment",
    location: "South District, Pune",
    area: "South District",
    lat: 18.5025,
    lng: 73.8681,
    status: "resolved",
    votes: 190,
    citizenId: 107,
    assignedWorkerId: 14,
    createdAt: "2025-10-15",
    updatedAt: "2025-10-17",
    image:
      "https://images.unsplash.com/photo-1602430154274-2789e5a65a6a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Noise Pollution from Construction",
    description:
      "Unregulated construction work continuing late at night in East Zone.",
    category: "Noise",
    location: "East Zone, Pune",
    area: "East End",
    lat: 18.5298,
    lng: 73.8729,
    status: "in-progress",
    votes: 225,
    citizenId: 108,
    assignedWorkerId: 13,
    createdAt: "2025-10-12",
    updatedAt: "2025-10-13",
    image:
      "https://images.unsplash.com/photo-1603384359928-6f04b9f4e7f9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "Overflowing Drainage",
    description:
      "Drainage system overflow due to heavy rainfall, affecting nearby houses.",
    category: "Drainage",
    location: "Shivaji Nagar, Pune",
    area: "Central Zone",
    lat: 18.5301,
    lng: 73.8523,
    status: "pending",
    votes: 340,
    citizenId: 109,
    assignedWorkerId: 16,
    createdAt: "2025-10-10",
    updatedAt: "2025-10-11",
    image:
      "https://images.unsplash.com/photo-1617196039984-fc63e07aef25?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    title: "Damaged Footpath",
    description:
      "Broken footpath tiles near Tech Park making it unsafe for pedestrians.",
    category: "Infrastructure",
    location: "Tech Park, Pune",
    area: "West Side",
    lat: 18.5177,
    lng: 73.8328,
    status: "resolved",
    votes: 175,
    citizenId: 110,
    assignedWorkerId: 18,
    createdAt: "2025-10-05",
    updatedAt: "2025-10-06",
    image:
      "https://images.unsplash.com/photo-1604079626852-f1a66dc4ad0e?auto=format&fit=crop&w=800&q=80",
  },
];
