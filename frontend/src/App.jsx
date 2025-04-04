import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { getUserInfoFromToken } from './utils/auth';
import AdminUserList from './components/AdminUserList';

import ChannelList from './components/ChannelList';
import ChannelThreadView from './components/ChannelThreadView';
import PostDetail from './components/PostDetail'; 
import UserExplorer from './components/UserExplorer';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/channels" element={<PrivateRoute><ChannelList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><AdminUserList /></PrivateRoute>} />
          <Route path="/users/explore" element={<PrivateRoute><UserExplorer /></PrivateRoute>} />
          <Route path="/channels/:id" element={<PrivateRoute><ChannelThreadView /></PrivateRoute>} />
          <Route path="/channels/:id/posts/:postId" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
