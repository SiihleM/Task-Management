import React from 'react';

const CuteNotifications = ({ notifications, onClose }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '320px',
      zIndex: 1000,
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
    }}>
      {notifications.map((note, index) => (
        <div key={index} style={{
          backgroundColor: '#ffccff',
          color: '#660066',
          padding: '15px 20px',
          borderRadius: '15px',
          marginBottom: '12px',
          boxShadow: '0 4px 8px rgba(255, 105, 180, 0.6)',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'transform 0.3s ease',
        }}
        onClick={() => onClose(index)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          💖 {note} 💖
        </div>
      ))}
    </div>
  );
};

export default CuteNotifications;
