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

    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

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
      display: 'flex',
      height: '100vh',
      width: '100%',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Left Image Section */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/014/938/026/small_2x/businessman-hand-project-manager-working-and-update-tasks-and-gantt-chart-scheduling-virtual-diagram-with-smart-phone-tablet-and-laptop-in-office-photo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      {/* Right Login Form Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        backgroundColor: '#fff'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 30px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <img
            src="TMALOGO.PNG"
            alt="Logo"
            style={{ width: '120px', marginBottom: '25px' }}
          />

          <h2 style={{ marginBottom: '20px', color: '#000', fontWeight: '700', fontSize: '1.8rem' }}>Login</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <label htmlFor="email" style={{ marginBottom: '8px', color: '#000', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
            <label htmlFor="password" style={{ marginBottom: '8px', color: '#000', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
            />
            {error && <p style={{ color: '#b30000', marginBottom: '20px', fontWeight: '600' }}>{error}</p>}
            <button type="submit" style={buttonStyle}>Login</button>
          </form>
          <p style={{ marginTop: '15px', textAlign: 'center', color: '#07162F' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#07162F', fontWeight: '600', textDecoration: 'none' }}>Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Styles
const inputStyle = {
  padding: '10px 12px',
  marginBottom: '20px',
  borderRadius: '8px',
  border: '1.5px solid #ddd',
  fontSize: '1rem',
  fontWeight: '500',
  color: '#333',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  transition: 'border-color 0.3s ease'
};

const buttonStyle = {
  backgroundColor: '#001F3F', // Navy
  color: '#fff',
  padding: '12px 0',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(78, 106, 233, 0.12)',
  transition: 'background 0.3s ease, box-shadow 0.3s ease'
};

export default Login;
