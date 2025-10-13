import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { customer } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await customerAPI.getStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status?.replace('_', ' ').toUpperCase() || 'PENDING';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Onboarding Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Onboarding Status
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status?.status
              )}`}
            >
              {getStatusText(status?.status)}
            </span>
          </div>

          {/* Current Step Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Current Step
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {status?.current_step || 1}/5
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Profile Completion
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {((status?.current_step || 1) / 5) * 100}%
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center font-medium"
            >
              Update Profile
            </Link>
            <Link
              to="/documents"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center font-medium"
            >
              Upload Documents
            </Link>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium">
              Get Help
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        {status?.recent_activities && status.recent_activities.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {status.recent_activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <p className="font-medium">{activity.activity_type}</p>
                  <p className="text-sm text-gray-600">
                    {activity.activity_description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

