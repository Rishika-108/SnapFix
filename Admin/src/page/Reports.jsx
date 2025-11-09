import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";
import Footer from "../components/generalComponents/Footer";

// ===== API Utilities =====
import { getReportStats } from "../api/handleReports";
import ReportFeed from "../components/reportingModule/ReportFeed";
import IssueGrid from "../components/issueGridModule/IssueGrid";

const Reports = () => {
  const reports = [
  {
    "location": { "type": "Point", "coordinates": [77.594566, 12.9715987] },
    "_id": "691a1bc5f18931a5c535661a",
    "title": "Pothole on MG Road",
    "description": "A deep pothole is causing traffic issues near the main intersection.",
    "category": "Road Damage",
    "imageUrl": "https://images.unsplash.com/photo-1508780709619-79562169bc64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6077e",
    "upvotes": 3,
    "upvotedUsers": ["user123", "user456"],
    "status": "In Progress",
    "adminApprovalStatus": "Pending",
    "paymentReleased": false,
    "createdAt": "2025-11-05T16:31:01.110Z",
    "updatedAt": "2025-11-07T10:38:23.882Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf900",
    "bids": [
      {
        "_id": "b101",
        "bidAmount": 5000,
        "duration": "3 days",
        "resourceNote": "Need extra manpower for safety barriers",
        "gigWorkerId": { "name": "Alice Smith", "email": "alice@example.com" }
      },
      {
        "_id": "b102",
        "bidAmount": 4500,
        "duration": "2 days",
        "resourceNote": "Can fix using pre-mixed concrete",
        "gigWorkerId": { "name": "Bob Johnson", "email": "bob@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.590000, 12.972000] },
    "_id": "691a1bc5f18931a5c535661b",
    "title": "Overflowing Garbage Bin at Park",
    "description": "Garbage bin near the park entrance is overflowing, causing foul smell.",
    "category": "Sanitation",
    "imageUrl": "https://images.unsplash.com/photo-1602168580957-ff1781b63f83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6079b",
    "upvotes": 2,
    "upvotedUsers": ["user321", "user654"],
    "status": "In Progress",
    "adminApprovalStatus": "Pending",
    "paymentReleased": false,
    "createdAt": "2025-11-06T09:15:10.000Z",
    "updatedAt": "2025-11-07T11:20:45.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf902",
    "bids": [
      {
        "_id": "b103",
        "bidAmount": 2500,
        "duration": "1 day",
        "resourceNote": "Team can clear garbage and sanitize",
        "gigWorkerId": { "name": "Charlie Brown", "email": "charlie@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.592000, 12.973500] },
    "_id": "691a1bc5f18931a5c535661c",
    "title": "Broken Streetlight",
    "description": "Streetlight on 5th Avenue is not working, making the area dark and unsafe at night.",
    "category": "Infrastructure",
    "imageUrl": "https://images.unsplash.com/photo-1581090700227-7f5d5f253c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6079c",
    "upvotes": 1,
    "upvotedUsers": ["user777"],
    "status": "Pending",
    "adminApprovalStatus": "Approved",
    "paymentReleased": false,
    "createdAt": "2025-11-06T12:10:00.000Z",
    "updatedAt": "2025-11-07T13:00:00.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf903",
    "bids": [
      {
        "_id": "b104",
        "bidAmount": 3000,
        "duration": "2 days",
        "resourceNote": "Need ladder and repair tools",
        "gigWorkerId": { "name": "Diana Prince", "email": "diana@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.595500, 12.974000] },
    "_id": "691a1bc5f18931a5c535661d",
    "title": "Water Leakage on Road",
    "description": "Water pipe leakage causing puddles on the road and slippery conditions.",
    "category": "Water & Sewage",
    "imageUrl": "https://images.unsplash.com/photo-1598514983644-2cc5cb8b0aa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6079d",
    "upvotes": 4,
    "upvotedUsers": ["user101", "user102"],
    "status": "In Progress",
    "adminApprovalStatus": "Pending",
    "paymentReleased": false,
    "createdAt": "2025-11-06T14:30:00.000Z",
    "updatedAt": "2025-11-07T15:00:00.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf904",
    "bids": [
      {
        "_id": "b105",
        "bidAmount": 4000,
        "duration": "2 days",
        "resourceNote": "Require water pump and manpower",
        "gigWorkerId": { "name": "Ethan Hunt", "email": "ethan@example.com" }
      },
      {
        "_id": "b106",
        "bidAmount": 3500,
        "duration": "1 day",
        "resourceNote": "Quick fix using temporary pipe seal",
        "gigWorkerId": { "name": "Fiona Glenanne", "email": "fiona@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.593000, 12.970500] },
    "_id": "691a1bc5f18931a5c535661e",
    "title": "Fallen Tree Blocking Road",
    "description": "A tree has fallen on the main road after the storm, blocking traffic.",
    "category": "Road Damage",
    "imageUrl": "https://images.unsplash.com/photo-1575320181281-1d6d1a0e0f3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6079e",
    "upvotes": 5,
    "upvotedUsers": ["user201", "user202", "user203"],
    "status": "Pending",
    "adminApprovalStatus": "Pending",
    "paymentReleased": false,
    "createdAt": "2025-11-07T08:00:00.000Z",
    "updatedAt": "2025-11-07T09:00:00.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf905",
    "bids": [
      {
        "_id": "b107",
        "bidAmount": 6000,
        "duration": "3 days",
        "resourceNote": "Need chainsaw and cleanup crew",
        "gigWorkerId": { "name": "George Miller", "email": "george@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.596500, 12.975000] },
    "_id": "691a1bc5f18931a5c535661f",
    "title": "Street Flooding after Rain",
    "description": "Road is flooded after heavy rain, causing traffic delays.",
    "category": "Water & Sewage",
    "imageUrl": "https://images.unsplash.com/photo-1601597113334-1d2dcbf3a3a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb6079f",
    "upvotes": 2,
    "upvotedUsers": ["user301", "user302"],
    "status": "In Progress",
    "adminApprovalStatus": "Pending",
    "paymentReleased": false,
    "createdAt": "2025-11-07T10:00:00.000Z",
    "updatedAt": "2025-11-07T11:00:00.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf906",
    "bids": [
      {
        "_id": "b108",
        "bidAmount": 5000,
        "duration": "2 days",
        "resourceNote": "Use pumps to clear water",
        "gigWorkerId": { "name": "Hannah White", "email": "hannah@example.com" }
      }
    ]
  },
  {
    "location": { "type": "Point", "coordinates": [77.597500, 12.976000] },
    "_id": "691a1bc5f18931a5c5356620",
    "title": "Damaged Traffic Signal",
    "description": "Traffic signal at junction is malfunctioning, causing confusion for drivers.",
    "category": "Infrastructure",
    "imageUrl": "https://images.unsplash.com/photo-1581090700247-0a2f61f2b3d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    "createdBy": "690717e3a35f94698fb607a0",
    "upvotes": 1,
    "upvotedUsers": ["user401"],
    "status": "Pending",
    "adminApprovalStatus": "Approved",
    "paymentReleased": false,
    "createdAt": "2025-11-07T12:00:00.000Z",
    "updatedAt": "2025-11-07T12:45:00.000Z",
    "__v": 0,
    "assignedGigWorker": "690c65c9cb097559cdbaf907",
    "bids": [
      {
        "_id": "b109",
        "bidAmount": 3500,
        "duration": "1 day",
        "resourceNote": "Quick repair using temporary signal kit",
        "gigWorkerId": { "name": "Ian Curtis", "email": "ian@example.com" }
      }
    ]
  }
];


  return (
    <div
      className="relative min-h-screen flex text-gray-100 
                 bg-linear-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] 
                 transition-all duration-300"
    >
      {/* ===== Background Pattern Overlay ===== */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1A3554_1px,transparent_1px)]
                   bg-size-[24px_24px] opacity-15 pointer-events-none"
      />

      {/* ===== Fixed Sidebar ===== */}
      <GovernmentSidebar />

      {/* ===== Main Content Wrapper ===== */}
      <div className="flex-1 flex flex-col ml-64 relative z-10 overflow-hidden">
        {/* Top Navigation */}
        <Topbar />

        {/* Main Reports Section */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Optional Report Feed */}
          {/* <ReportFeed /> */}
          <IssueGrid reports={reports} />
        </main>

        <Footer />
      </div>

      {/* Subtle overlay gradient for focus depth */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Reports;
