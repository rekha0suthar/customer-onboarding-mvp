import { useState, useEffect } from 'react';
import { adminAPIService } from '../../services/adminAPI';
import Loading from '../../components/Loading';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      
      const response = await adminAPIService.getAllUsers(params);
      setUsers(response.data.users);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      await adminAPIService.updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user role');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👥 User Management
          </h1>
          <p className="text-gray-600">
            View all users and manage their roles
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-semibold text-gray-700">Filter by Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="broker">Brokers</option>
              <option value="admin">Admins</option>
            </select>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Refresh
            </button>
            <div className="ml-auto text-sm text-gray-600">
              Total: <span className="font-bold">{users.length}</span> users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">ID</th>
                    <th className="text-left py-4 px-6 font-semibold">Name</th>
                    <th className="text-left py-4 px-6 font-semibold">Email</th>
                    <th className="text-left py-4 px-6 font-semibold">GSTIN</th>
                    <th className="text-left py-4 px-6 font-semibold">Current Role</th>
                    <th className="text-left py-4 px-6 font-semibold">Joined</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6 font-mono text-sm text-gray-600">{user.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'N/A'}
                        </div>
                        {user.customer_id && (
                          <div className="text-xs text-gray-500">Customer ID: {user.customer_id}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-700">{user.email}</td>
                      <td className="py-4 px-6">
                        {user.gstin ? (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.gstin}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {updatingUserId === user.id ? (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Updating...
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {user.role === 'broker' ? (
                              <button
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition font-medium"
                                title="Promote to Admin"
                              >
                                ⬆️ Promote
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(user.id, 'broker')}
                                className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition font-medium"
                                title="Demote to Broker"
                              >
                                ⬇️ Demote
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>📌 Note:</strong> Admins have full access to the system. Brokers can only manage their own data.
            You cannot demote yourself to prevent admin lockout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;

