import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../utils/auth';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api';
import SearchBar from './SearchBar';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      authAPI()
        .get('/users/me')
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error('Failed to load user info', err);
          clearToken();
          navigate('/login');
        });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const minimalPaths = ['/login', '/register'];
  const isMinimal = minimalPaths.includes(location.pathname);

  return (
    <nav>
      <div className="logo">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span >ForumApp</span>
          


        {isMinimal ? (
          <div>
            <Link to="/">About</Link>
            <Link to="/">Help</Link>
          </div>
        ) : isLoggedIn && user ? (
          <div className="flex items-center gap-4">
            <SearchBar />
            <button onClick={handleLogout}>Logout</button>
            <Link to="/channels">Channels</Link>
            <Link to="/users/explore">User Explorer</Link>
            <Link to="/profile">Profile</Link>
            {!!user.isAdmin && (
  <Link to="/admin/users">Admin</Link>
)}

            
          <Link to="/profile">
            {user.avatarUrl ? (
              <img
                src={`http://localhost:5001${user.avatarUrl}`}
                alt="avatar"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            )}</Link>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
