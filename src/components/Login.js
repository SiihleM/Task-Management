import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simple email format validation
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check user credentials from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    setError('');
    onLogin(email);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/014/938/026/small_2x/businessman-hand-project-manager-working-and-update-tasks-and-gantt-chart-scheduling-virtual-diagram-with-smart-phone-tablet-and-laptop-in-office-photo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        width: '360px',
        maxWidth: '100%'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#4a3f6f', fontWeight: '700', fontSize: '1.8rem', textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" style={{ marginBottom: '8px', color: '#764ba2', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              padding: '10px 12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#333',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
              transition: 'border-color 0.3s ease'
            }}
          />
          <label htmlFor="password" style={{ marginBottom: '8px', color: '#764ba2', fontWeight: '600' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              padding: '10px 12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#333',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
              transition: 'border-color 0.3s ease'
            }}
          />
          {error && <p style={{ color: '#b30000', marginBottom: '20px', fontWeight: '600' }}>{error}</p>}
          <button type="submit" style={{
            backgroundColor: '#764ba2',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(118, 75, 162, 0.4)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease'
          }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#764ba2';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(118, 75, 162, 0.4)';
            }}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center', color: '#4a3f6f' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#764ba2', fontWeight: '600', textDecoration: 'none' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
