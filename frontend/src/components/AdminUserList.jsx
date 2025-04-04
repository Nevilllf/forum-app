import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { FaTrash } from 'react-icons/fa';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await authAPI().get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await authAPI().delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const downloadCSV = () => {
    const header = ['ID', 'Name', 'Bio'];
    const rows = users.map((u) => [u.id, u.name, u.bio?.replace(/[\n\r]/g, ' ') || '']);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-user-container">
  <h2 className="admin-user-title">User Management</h2>

  {error && <p className="text-red-500 mb-4">{error}</p>}

  <button onClick={downloadCSV} className="admin-download-btn">
    ⬇ Download CSV
  </button>

  <table className="admin-user-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Bio</th>
        <th>Avatar</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((u) => (
        <tr key={u.id}>
          <td>{u.id}</td>
          <td>{u.name}</td>
          <td>{u.bio || '-'}</td>
          <td>
            {u.avatarUrl ? (
              <img
                src={`http://localhost:5001${u.avatarUrl}`}
                alt="avatar"
                className="admin-user-avatar"
              />
            ) : (
              'N/A'
            )}
          </td>
          <td className="text-center">
            <button onClick={() => handleDelete(u.id)} className="admin-delete-button" title="Delete">
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default AdminUserList;
