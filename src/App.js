import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TaskDashboard from './components/TaskDashboard';

function App() {
  // Clear user on app load to force login redirect
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    // Redirect to login if no user and not on login or signup page
    if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [user, navigate, location]);

  const handleLogin = (email) => {
    setUser({ email });
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="container">
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignUp onLogin={handleLogin} />}
        />
        <Route
          path="/notifications"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <TaskDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
