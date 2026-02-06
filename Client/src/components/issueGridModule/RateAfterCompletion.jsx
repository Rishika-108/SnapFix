import React, { useState } from 'react';

const RateAfterCompletion = ({ issueImage, resolvedImage, onVerify }) => {
  const [verified, setVerified] = useState(null); // null, true, false
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleVerification = (isSolved) => {
  setVerified(isSolved);
};

const handleSubmitReview = () => {
  if (verified === null) {
    alert("Please verify the task first");
    return;
  }

  if (onVerify) {
    onVerify(verified, rating, review);
  }

  alert("Thank you for your feedback!");
};

  return (
    <div style={styles.container}>
      <h2>Verify & Rate Completed Issue</h2>

      <div style={styles.imagesContainer}>
        <div style={styles.imageBox}>
          <h4>Reported Issue</h4>
          <img src={issueImage} alt="Reported Issue" style={styles.image} />
        </div>
        <div style={styles.imageBox}>
          <h4>Resolved Issue</h4>
          <img src={resolvedImage} alt="Resolved Issue" style={styles.image} />
        </div>
      </div>

      <div style={styles.verification}>
        <h4>Has this issue been resolved?</h4>
        <button
          style={verified === true ? styles.selectedButton : styles.button}
          onClick={() => handleVerification(true)}
        >
          Yes
        </button>
        <button
          style={verified === false ? styles.selectedButton : styles.button}
          onClick={() => handleVerification(false)}
        >
          No
        </button>
      </div>

      {verified !== null && (
        <div style={styles.ratingContainer}>
          <h4>Rate the resolution quality</h4>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={0}>Select rating</option>
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐⭐</option>
            <option value={3}>3 ⭐⭐⭐</option>
            <option value={4}>4 ⭐⭐⭐⭐</option>
            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          </select>

          <h4>Optional Review</h4>
          <textarea
            placeholder="Write your feedback..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={styles.textarea}
          />

          <button style={styles.submitButton} onClick={handleSubmitReview}>
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    gap: '10px',
  },
  imageBox: {
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '5px',
    border: '1px solid #aaa',
  },
  verification: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #333',
    backgroundColor: '#fff',
  },
  selectedButton: {
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '2px solid #007bff',
    backgroundColor: '#cce5ff',
  },
  ratingContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #aaa',
    resize: 'vertical',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
  },
};

export default RateAfterCompletion;
