import { useEffect, useState } from 'react';
import { getUserExplorer } from '../services/api';

const UserExplorer = () => {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    getUserExplorer()
      .then((res) => {
        setUsers(res.data);
        setDisplayUsers(res.data);
      })
      .catch((err) => {
        console.error('Failed to load user explorer', err);
        setError('Failed to load users');
      });
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          (u.bio && u.bio.toLowerCase().includes(term))
      );
    }

    if (sortBy === 'posts') {
      filtered.sort((a, b) => b.postCount - a.postCount);
    } else if (sortBy === 'replies') {
      filtered.sort((a, b) => b.replyCount - a.replyCount);
    } else if (sortBy === 'likes') {
      filtered.sort((a, b) => b.totalLikes - a.totalLikes);
    }

    setDisplayUsers(filtered);
  }, [searchTerm, sortBy, users]);

  return (
    <div className="user-explorer-container">
  <h2 className="user-explorer-title">User Explorer</h2>

  <div className="user-explorer-toolbar">
    <input
      type="text"
      placeholder="Search by name or bio"
      className="user-explorer-search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <div className="user-explorer-buttons">
      <button onClick={() => setSortBy('posts')}>Most Posts</button>
      <button onClick={() => setSortBy('replies')}>Most Replies</button>
      <button onClick={() => setSortBy('likes')}>Most Likes</button>
      <button onClick={() => setSortBy('')}>Reset</button>
    </div>
  </div>

  <table className="user-table">
    <thead>
      <tr>
        <th>User</th>
        <th>Bio</th>
        <th>Posts</th>
        <th>Replies</th>
        <th>Likes</th>
      </tr>
    </thead>
    <tbody>
      {displayUsers.map((u) => (
        <tr key={u.id}>
          <td>
            <div className="user-info">
              {u.avatarUrl ? (
                <img
                  src={`http://localhost:5001${u.avatarUrl}`}
                  alt="avatar"
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar bg-gray-300" />
              )}
              <span>{u.name}</span>
            </div>
          </td>
              <td className="p-2">{u.bio || '-'}</td>
              <td className="text-center">{u.postCount}</td>
              <td className="text-center">{u.replyCount}</td>
              <td className="text-center">{u.totalLikes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserExplorer;
