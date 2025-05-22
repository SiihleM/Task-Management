import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignUp({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Simple email format validation
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if user already exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((user) => user.email === email)) {
      setError('User with this email already exists.');
      return;
    }

    // Save new user
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setError('');
    // Automatically login after sign up
    if (onLogin) {
      onLogin(email);
    }
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
        <h2 style={{ marginBottom: '20px', color: '#000000', fontWeight: '700', fontSize: '1.8rem', textAlign: 'center' }}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" style={{ marginBottom: '8px', color: '#000000', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="you@example.com"
          />
          <label htmlFor="password" style={{ marginBottom: '8px', color: '#000000', fontWeight: '600' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Enter password"
          />
          <label htmlFor="confirmPassword" style={{ marginBottom: '8px', color: '#000000', fontWeight: '600' }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Confirm password"
          />
          {error && <p style={{ color: '#b30000', marginBottom: '15px', fontWeight: '600' }}>{error}</p>}
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#E94E4E',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease'
          }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#c43b3b';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#E94E4E';
            }}
          >
            Register
          </button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center', color: '#000000' }}>
          Already have an account? <Link to="/login" style={{ color: '#000000', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
