import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p>A carregar filmes...</p>
    </div>
  );
};

export default LoadingSpinner;
