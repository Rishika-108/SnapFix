import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiDatabase, FiDollarSign } from "react-icons/fi";

const Table = ({ completedTasks }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const allSelected = selected.length === completedTasks.length && completedTasks.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(completedTasks.map((t) => t.id));
    }
  };

  const totalAmount = completedTasks
    .filter((t) => selected.includes(t.id))
    .reduce((acc, curr) => acc + curr.bidAmount, 0);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1725] via-[#0E2439] to-[#142E4D] text-gray-200 px-6 py-12 font-inter selection:bg-[#2196F3]/20 selection:text-white">
      {/* ===== HEADER ===== */}
      <header className="mb-12 border-b border-white/10 pb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold bg-linear-to-r from-[#4DA3FF] to-[#78C8FF] text-transparent bg-clip-text tracking-tight">
            Government Fund Allocation Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-2 tracking-wide">
            Review completed public projects and release funds transparently.
          </p>
        </div>
      </header>

      {/* ===== STATS SUMMARY ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-6xl mx-auto"
      >
        {[
          {
            label: "Completed Projects",
            value: completedTasks.length,
            icon: <FiCheckCircle />,
            color: "text-green-400",
          },
          {
            label: "Total Fund Value",
            value: `₹ ${completedTasks
              .reduce((acc, t) => acc + t.bidAmount, 0)
              .toLocaleString()}`,
            icon: <FiDollarSign />,
            color: "text-[#4DA3FF]",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-[#3EA8FF]/40 transition-all duration-300"
          >
            <div className={`text-3xl ${stat.color} bg-white/5 p-3 rounded-xl shadow-inner`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-sm text-gray-400">{stat.label}</h3>
              <p className="text-xl font-semibold text-gray-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ===== SELECT ALL ===== */}
      {!loading && completedTasks.length > 0 && (
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-end pr-2">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="accent-[#3EA8FF] w-4 h-4 rounded cursor-pointer hover:scale-110 transition-transform"
            />
            <span>{allSelected ? "Deselect All" : "Select All"}</span>
          </label>
        </div>
      )}

      {/* ===== TASK CARDS ===== */}
      <div className="space-y-6 max-w-6xl mx-auto pb-24">
        <AnimatePresence>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-28 bg-[#0E2439]/50 border border-white/5 rounded-2xl"
              ></div>
            ))
          ) : completedTasks.length > 0 ? (
            completedTasks.map((task) => {
              const isSelected = selected.includes(task.id);

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative group flex flex-col sm:flex-row items-start justify-between 
                             bg-[#0E2439]/70 backdrop-blur-lg rounded-2xl border 
                             ${
                               isSelected
                                 ? "border-[#3EA8FF]/80 shadow-[0_0_20px_rgba(62,168,255,0.25)]"
                                 : "border-white/10 hover:border-[#3EA8FF]/40"
                             }
                             p-6 transition-all duration-300`}
                >
                  <div className="flex items-start gap-5 w-full">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(task.id)}
                      className="mt-2 accent-[#3EA8FF] w-5 h-5 rounded cursor-pointer hover:scale-110 transition-transform"
                      aria-label={`Select ${task.title}`}
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-center gap-3">
                        <span className="text-sm text-gray-400">
                          <span className="text-gray-100 font-medium">{task.rating}</span>★
                        </span>
                        <span className="text-green-400 font-semibold text-sm">
                          ₹ {task.bidAmount.toLocaleString()}
                        </span>
                        <span className="italic text-gray-300 text-sm">{task.gigName}</span>
                      </div>

                      <h2 className="mt-3 text-lg font-semibold text-gray-100 group-hover:text-[#3EA8FF] transition-colors">
                        {task.title}
                      </h2>
                      <p className="mt-1 text-gray-400 text-sm leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
                        <FiClock className="text-[#3EA8FF]" />
                        Duration:{" "}
                        <span className="text-gray-300 ml-1">{task.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Accent Dot */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{
                        backgroundColor: isSelected ? "#3EA8FF" : "rgba(255,255,255,0.2)",
                        scale: isSelected ? 1.2 : 1,
                      }}
                      className="h-3 w-3 rounded-full transition-all"
                    />
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-24"
            >
              <div className="inline-flex flex-col items-center justify-center px-10 py-14 rounded-2xl border border-white/10 bg-[#0E2439]/60 backdrop-blur-md shadow-inner shadow-black/40">
                <FiDatabase className="text-gray-500 text-5xl mb-4" />
                <p className="text-lg text-gray-300 font-medium">
                  No completed tasks available.
                </p>
                <p className="text-sm mt-2 text-gray-500 max-w-sm">
                  Once verified, completed projects will appear here for fund allocation.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== FIXED ALLOCATE BUTTON ===== */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => console.log("Allocating funds for:", selected)}
              className="px-6 py-3.5 rounded-full bg-linear-to-r from-[#1B5BFF] to-[#2490F9]
                         border border-[#1B75D0]/50 text-sm font-semibold text-gray-100
                         shadow-[0_0_15px_rgba(37,112,255,0.25)] hover:shadow-[0_0_25px_rgba(37,112,255,0.35)]
                         hover:scale-[1.04] transition-all duration-200"
            >
              Allocate ₹ {totalAmount.toLocaleString()} ({selected.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Table;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiClock, FiCheckCircle, FiDollarSign, FiDatabase } from "react-icons/fi";
// import axios from "axios";

// // Backend base URL
// const BASE_URL = "http://localhost:3000/api";

// const Table = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [releasing, setReleasing] = useState(false);

//   const allSelected = selected.length === tasks.length && tasks.length > 0;

//   // Fetch completed & verified tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${BASE_URL}/admin/completed-tasks`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.success) setTasks(res.data.tasks);
//       } catch (err) {
//         console.error("❌ Failed to fetch tasks:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Toggle single task selection
//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
//     );
//   };

//   // Toggle select all
//   const toggleSelectAll = () => {
//     if (allSelected) setSelected([]);
//     else setSelected(tasks.map((t) => t._id));
//   };

//   // Calculate total fund amount
//   const totalAmount = tasks
//     .filter((t) => selected.includes(t._id))
//     .reduce((acc, curr) => acc + (curr.bidAmount || 0), 0);

//   // Release payment for selected tasks
//   const handleReleasePayments = async () => {
//     try {
//       setReleasing(true);
//       const token = localStorage.getItem("token");

//       for (const taskId of selected) {
//         await axios.put(`${BASE_URL}/admin/release-payment/${taskId}`, {}, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       alert(`✅ Released payment for ${selected.length} task(s)`);
//       setSelected([]);
//       // Refresh tasks after release
//       const res = await axios.get(`${BASE_URL}/admin/completed-tasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setTasks(res.data.tasks);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error releasing payments");
//     } finally {
//       setReleasing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-[#0B1725] via-[#0E2439] to-[#142E4D] text-gray-200 px-6 py-12 font-inter selection:bg-[#2196F3]/20 selection:text-white">

//       {/* ===== HEADER ===== */}
//       <header className="mb-12 border-b border-white/10 pb-6 flex flex-wrap justify-between items-center gap-4">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-semibold bg-linear-to-r from-[#4DA3FF] to-[#78C8FF] text-transparent bg-clip-text tracking-tight">
//             Government Fund Allocation
//           </h1>
//           <p className="text-sm text-gray-400 mt-2 tracking-wide">
//             Review completed projects and release funds transparently.
//           </p>
//         </div>
//       </header>

//       {/* ===== STATS SUMMARY ===== */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-6xl mx-auto"
//       >
//         {[
//           {
//             label: "Completed Tasks",
//             value: tasks.length,
//             icon: <FiCheckCircle />,
//             color: "text-green-400",
//           },
//           {
//             label: "Total Fund Value",
//             value: `₹ ${tasks.reduce((acc, t) => acc + (t.bidAmount || 0), 0).toLocaleString()}`,
//             icon: <FiDollarSign />,
//             color: "text-[#4DA3FF]",
//           },
//         ].map((stat, idx) => (
//           <div
//             key={idx}
//             className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-[#3EA8FF]/40 transition-all duration-300"
//           >
//             <div className={`text-3xl ${stat.color} bg-white/5 p-3 rounded-xl shadow-inner`}>
//               {stat.icon}
//             </div>
//             <div>
//               <h3 className="text-sm text-gray-400">{stat.label}</h3>
//               <p className="text-xl font-semibold text-gray-100">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </motion.div>

//       {/* ===== SELECT ALL ===== */}
//       {!loading && tasks.length > 0 && (
//         <div className="max-w-6xl mx-auto mb-4 flex items-center justify-end pr-2">
//           <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={allSelected}
//               onChange={toggleSelectAll}
//               className="accent-[#3EA8FF] w-4 h-4 rounded cursor-pointer hover:scale-110 transition-transform"
//             />
//             <span>{allSelected ? "Deselect All" : "Select All"}</span>
//           </label>
//         </div>
//       )}

//       {/* ===== TASK CARDS ===== */}
//       <div className="space-y-6 max-w-6xl mx-auto pb-24">
//         <AnimatePresence>
//           {loading ? (
//             [...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="animate-pulse h-28 bg-[#0E2439]/50 border border-white/5 rounded-2xl"
//               />
//             ))
//           ) : tasks.length > 0 ? (
//             tasks.map((task) => {
//               const isSelected = selected.includes(task._id);
//               return (
//                 <motion.div
//                   key={task._id}
//                   layout
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`relative group flex flex-col sm:flex-row items-start justify-between 
//                     bg-[#0E2439]/70 backdrop-blur-lg rounded-2xl border 
//                     ${isSelected ? "border-[#3EA8FF]/80 shadow-[0_0_20px_rgba(62,168,255,0.25)]" : "border-white/10 hover:border-[#3EA8FF]/40"} 
//                     p-6 transition-all duration-300`}
//                 >
//                   <div className="flex items-start gap-5 w-full">
//                     <input
//                       type="checkbox"
//                       checked={isSelected}
//                       onChange={() => toggleSelect(task._id)}
//                       className="mt-2 accent-[#3EA8FF] w-5 h-5 rounded cursor-pointer hover:scale-110 transition-transform"
//                       aria-label={`Select ${task.reportId?.title}`}
//                     />
//                     <div className="flex-1">
//                       <h2 className="text-lg font-semibold text-gray-100 group-hover:text-[#3EA8FF] transition-colors">
//                         {task.reportId?.title}
//                       </h2>
//                       <p className="mt-1 text-gray-400 text-sm leading-relaxed">
//                         {task.reportId?.description}
//                       </p>
//                       <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wide">
//                         <FiClock className="text-[#3EA8FF]" />
//                         Duration: {task.duration || "N/A"}
//                         <span className="ml-auto text-green-400 font-semibold">
//                           ₹ {task.bidAmount?.toLocaleString() || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="absolute top-4 right-4">
//                     <motion.div
//                       animate={{
//                         backgroundColor: isSelected ? "#3EA8FF" : "rgba(255,255,255,0.2)",
//                         scale: isSelected ? 1.2 : 1,
//                       }}
//                       className="h-3 w-3 rounded-full transition-all"
//                     />
//                   </div>
//                 </motion.div>
//               );
//             })
//           ) : (
//             <div className="text-center mt-24">
//               <div className="inline-flex flex-col items-center justify-center px-10 py-14 rounded-2xl border border-white/10 bg-[#0E2439]/60 backdrop-blur-md shadow-inner shadow-black/40">
//                 <FiDatabase className="text-gray-500 text-5xl mb-4" />
//                 <p className="text-lg text-gray-300 font-medium">No completed tasks available.</p>
//                 <p className="text-sm mt-2 text-gray-500 max-w-sm">
//                   Once verified, completed projects will appear here for fund allocation.
//                 </p>
//               </div>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ===== FIXED ALLOCATE FUNDS BUTTON ===== */}
//       <AnimatePresence>
//         {selected.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-6 right-6 z-50"
//           >
//             <button
//               onClick={handleReleasePayments}
//               disabled={releasing}
//               className={`px-6 py-3.5 rounded-full bg-linear-to-r from-[#1B5BFF] to-[#2490F9] border border-[#1B75D0]/50 text-sm font-semibold text-gray-100 shadow-[0_0_15px_rgba(37,112,255,0.25)]
//                 ${releasing ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_25px_rgba(37,112,255,0.35)] hover:scale-[1.04] transition-all duration-200"}`}
//             >
//               {releasing ? "Releasing..." : `Allocate ₹ ${totalAmount.toLocaleString()} (${selected.length})`}
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Table;
