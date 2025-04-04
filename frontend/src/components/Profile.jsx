import React, { useEffect, useState } from 'react';
import { getUserInfoFromToken } from '../utils/auth';
import { authAPI } from '../services/api';
import axios from 'axios';

const Profile = () => {
  const user = getUserInfoFromToken();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const decoded = getUserInfoFromToken();
    if (decoded) {
      setFormData((prev) => ({
        ...prev,
        name: decoded.name || '',
      }));
    }
  }, []);
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('screenshot', file);

    try {
      const res = await axios.post('http://localhost:5001/api/upload/screenshot', data);
      setFormData((prev) => ({ ...prev, avatarUrl: res.data.url.replace('http://localhost:5001', '') }));
      setPreview(res.data.url);
    } catch (err) {
      console.error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    try {
      await authAPI().patch('/users/profile', formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed');
      setMessage('Update failed');
    }
  };

  return (
    <div className="profile-container">
  <h2 className="profile-title">Edit Profile</h2>

  {preview || formData.avatarUrl ? (
    <img
      src={preview || `http://localhost:5001${formData.avatarUrl}`}
      className="profile-avatar"
      alt="Avatar Preview"
    />
  ) : (
    <div className="profile-placeholder"></div>
  )}

  <input type="file" onChange={handleFileChange} className="mb-4" />

  <div className="profile-input-group">
    <label>Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
    />
  </div>

  <div className="profile-input-group">
    <label>Bio</label>
    <textarea
      name="bio"
      value={formData.bio}
      onChange={handleChange}
    ></textarea>
  </div>

  <button onClick={handleSubmit} className="profile-save-button">
    Save Changes
  </button>

  {message && <p className="profile-message">{message}</p>}
</div>

  );
};

export default Profile;
