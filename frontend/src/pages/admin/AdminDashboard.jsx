import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPIService } from '../../services/adminAPI';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await adminAPIService.getOverview();
      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch overview');
      console.error('Fetch overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, customers, and monitor system activity
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Brokers"
              value={stats.total_brokers}
              icon="👥"
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Admins"
              value={stats.total_admins}
              icon="🔐"
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Customers"
              value={stats.total_customers}
              icon="📋"
              color="from-green-500 to-green-600"
            />
            <StatCard
              title="Documents"
              value={stats.total_documents}
              icon="📄"
              color="from-orange-500 to-orange-600"
            />
            <StatCard
              title="Activities"
              value={stats.total_activities}
              icon="⚡"
              color="from-pink-500 to-pink-600"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            title="Manage Users"
            description="View, promote, or demote user roles"
            icon="👤"
            link="/admin/users"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <ActionCard
            title="View Customers"
            description="Browse all customer profiles and documents"
            icon="📊"
            link="/admin/customers"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <ActionCard
            title="System Stats"
            description="View detailed analytics and reports"
            icon="📈"
            link="/admin/dashboard"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">👥 Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-3xl">{icon}</span>
      <div className="text-3xl font-bold">{value}</div>
    </div>
    <div className="text-sm font-medium opacity-90">{title}</div>
  </div>
);

// ActionCard Component
const ActionCard = ({ title, description, icon, link, color }) => (
  <Link to={link} className="block group">
    <div className={`${color} rounded-xl shadow-lg p-6 text-white transform group-hover:scale-105 transition`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
      <div className="mt-4 flex items-center text-sm font-semibold">
        Open
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
);

export default AdminDashboard;

