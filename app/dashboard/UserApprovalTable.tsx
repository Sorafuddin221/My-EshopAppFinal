'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface User {
  _id: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

export default function UserApprovalTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    } else {
      setMessage('You are not authorized to view this section.');
    }
  }, [token, currentUser]);

  const fetchUsers = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const data = await api.get('/auth/users', token);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setMessage(data.msg || 'Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Server error. Could not fetch users.');
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this user?')) return;
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const response = await api.put(`/auth/approve/${id}`, {}, token);
      if (response.msg === 'User approved successfully') {
        setMessage('User approved successfully!');
        fetchUsers(); // Refresh the list
      } else {
        setMessage(response.msg || 'Failed to approve user.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setMessage('Server error. Could not approve user.');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return;
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const response = await api.put(`/auth/reject/${id}`, {}, token);
      if (response.msg === 'User deleted successfully') {
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } else {
        setMessage(response.msg || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      setMessage('Server error. Could not reject user.');
    }
  };

  return (
    <div id="user-approval-section">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">User Approval</h5>
        {message && <p className="text-sm mb-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Approved</th>
                <th className="py-2 px-4 border-b">Registered On</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.role}</td>
                    <td className="py-2 px-4 border-b">{user.isApproved ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      {!user.isApproved && currentUser && currentUser.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
