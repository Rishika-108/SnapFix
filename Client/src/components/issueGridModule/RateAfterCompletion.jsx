// import React, { useState } from 'react';

// const RateAfterCompletion = ({ issueImage, resolvedImage, onVerify }) => {
//   const [verified, setVerified] = useState(null); // null, true, false
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState('');

//   const handleVerification = (isSolved) => {
//   setVerified(isSolved);
// };

// const handleSubmitReview = () => {
//   if (verified === null) {
//     alert("Please verify the task first");
//     return;
//   }

//   if (onVerify) {
//     onVerify(verified, rating, review);
//   }

//   alert("Thank you for your feedback!");
// };

//   return (
//     <div style={styles.container}>
//       <h2>Verify & Rate Completed Issue</h2>

//       <div style={styles.imagesContainer}>
//         <div style={styles.imageBox}>
//           <h4>Reported Issue</h4>
//           <img src={issueImage} alt="Reported Issue" style={styles.image} />
//         </div>
//         <div style={styles.imageBox}>
//           <h4>Resolved Issue</h4>
//           <img src={resolvedImage} alt="Resolved Issue" style={styles.image} />
//         </div>
//       </div>

//       <div style={styles.verification}>
//         <h4>Has this issue been resolved?</h4>
//         <button
//           style={verified === true ? styles.selectedButton : styles.button}
//           onClick={() => handleVerification(true)}
//         >
//           Yes
//         </button>
//         <button
//           style={verified === false ? styles.selectedButton : styles.button}
//           onClick={() => handleVerification(false)}
//         >
//           No
//         </button>
//       </div>

//       {verified !== null && (
//         <div style={styles.ratingContainer}>
//           <h4>Rate the resolution quality</h4>
//           <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
//             <option value={0}>Select rating</option>
//             <option value={1}>1 ⭐</option>
//             <option value={2}>2 ⭐⭐</option>
//             <option value={3}>3 ⭐⭐⭐</option>
//             <option value={4}>4 ⭐⭐⭐⭐</option>
//             <option value={5}>5 ⭐⭐⭐⭐⭐</option>
//           </select>

//           <h4>Optional Review</h4>
//           <textarea
//             placeholder="Write your feedback..."
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//             style={styles.textarea}
//           />

//           <button style={styles.submitButton} onClick={handleSubmitReview}>
//             Submit Feedback
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Inline styles for simplicity
// const styles = {
//   container: {
//     maxWidth: '700px',
//     margin: '20px auto',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontFamily: 'Arial, sans-serif',
//   },
//   imagesContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '20px',
//     gap: '10px',
//   },
//   imageBox: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   image: {
//     width: '100%',
//     height: 'auto',
//     borderRadius: '5px',
//     border: '1px solid #aaa',
//   },
//   verification: {
//     marginBottom: '20px',
//     textAlign: 'center',
//   },
//   button: {
//     padding: '10px 20px',
//     margin: '0 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     border: '1px solid #333',
//     backgroundColor: '#fff',
//   },
//   selectedButton: {
//     padding: '10px 20px',
//     margin: '0 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     border: '2px solid #007bff',
//     backgroundColor: '#cce5ff',
//   },
//   ratingContainer: {
//     marginTop: '20px',
//     textAlign: 'center',
//   },
//   textarea: {
//     width: '100%',
//     minHeight: '80px',
//     marginTop: '10px',
//     padding: '10px',
//     borderRadius: '5px',
//     border: '1px solid #aaa',
//     resize: 'vertical',
//   },
//   submitButton: {
//     marginTop: '10px',
//     padding: '10px 20px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     border: 'none',
//     backgroundColor: '#28a745',
//     color: '#fff',
//   },
// };

// export default RateAfterCompletion;
import React, { useState } from "react";

const RateAfterCompletion = ({ issueImage, resolvedImage, onVerify }) => {
  const [verified, setVerified] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitReview = () => {
    if (verified === null) {
      alert("Please verify the task first");
      return;
    }

    onVerify?.(verified, rating, review);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Verify & Rate Completed Issue
      </h2>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Reported Issue
          </p>
          <img
            src={issueImage}
            alt="Reported Issue"
            className="w-full h-40 object-cover rounded-lg border"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Resolved Issue
          </p>
          <img
            src={resolvedImage}
            alt="Resolved Issue"
            className="w-full h-40 object-cover rounded-lg border"
          />
        </div>
      </div>

      {/* Verification */}
      <div className="text-center mb-6">
        <p className="font-medium text-gray-700 mb-3">
          Has this issue been resolved?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setVerified(true)}
            className={`px-5 py-2 rounded-lg border transition ${
              verified === true
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Yes
          </button>

          <button
            onClick={() => setVerified(false)}
            className={`px-5 py-2 rounded-lg border transition ${
              verified === false
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Rating & Review */}
      {verified !== null && (
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate the resolution quality
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>Select rating</option>
              <option value={1}>⭐ 1</option>
              <option value={2}>⭐⭐ 2</option>
              <option value={3}>⭐⭐⭐ 3</option>
              <option value={4}>⭐⭐⭐⭐ 4</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5</option>
            </select>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Optional Review
            </label>
            <textarea
              rows={3}
              placeholder="Write your feedback..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitReview}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default RateAfterCompletion;

