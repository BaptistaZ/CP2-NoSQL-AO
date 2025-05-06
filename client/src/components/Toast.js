// src/components/Toast.js
import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container">
      <span className="toast-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
