import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import './TrackUsers.css';

const USERS_PER_PAGE = 5;
const DEFAULT_AVATAR = '/images/default-avatar.png';

const TrackUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = res.data.map(user => ({
        ...user,
        profileImageSafe: user.profileImage || DEFAULT_AVATAR,
      }));
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete user.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginated = useMemo(() => {
    return filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);
  }, [filteredUsers, page]);

  return (
    <div className="track-users-container">
      <div className="track-users-header">
        <h2><FaUserFriends /> Registered Users</h2>
        <button className="back-home-btn" onClick={() => navigate('/admin')}>
          <TbArrowBackUp /> Back to Dashboard
        </button>
      </div>

      <div className="search-pagination-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : paginated.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Signup Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img
                        src={user.profileImageSafe}
                        alt="profile"
                        width="40"
                        height="40"
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          if (e.target.src !== window.location.origin + DEFAULT_AVATAR) {
                            e.target.src = DEFAULT_AVATAR;
                          }
                        }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="edit-btn" onClick={() => navigate(`/edit-user/${user._id}`)}><FaRegEdit /> Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(user._id)}><RiDeleteBin2Line /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="no-results">No users found.</p>
      )}
    </div>
  );
};

export default TrackUsers;
