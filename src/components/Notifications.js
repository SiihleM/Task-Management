import React from 'react';

function Notifications({ notifications, onClose }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '300px',
      zIndex: 1000,
    }}>
      {notifications.map((note, index) => (
        <div key={index} style={{
          backgroundColor: '#E94E4E',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          marginBottom: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }} onClick={() => onClose(index)}>
          {note}
        </div>
      ))}
    </div>
  );
}

export default Notifications;
