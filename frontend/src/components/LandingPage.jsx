import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clearToken, getUserInfoFromToken } from '../utils/auth';

const LandingPage = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfoFromToken();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to ForumApp!</h1>
      <p className="landing-description">
        ForumApp is a full-featured discussion platform where users can explore channels, create posts,
        reply to threads, rate content, and manage their profiles. Admins have additional tools to manage users,
        channels, and discussions.
      </p>

      <div className="landing-card">
        <h2 className="user-greeting">Welcome, {userInfo?.name} 👋</h2>
        <p className="subtext">Choose where to go:</p>
        <div className="link-grid">
          <Link to="/channels" className="landing-link">📢 Explore Channels</Link>
          <Link to="/profile" className="landing-link">👤 View Profile</Link>
          <Link to="/users/explore" className="landing-link">🌐 User Explorer</Link>
          {!!userInfo?.isAdmin && (
            <Link to="/admin/users" className="landing-link">🛠 Admin Panel</Link>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default LandingPage;
