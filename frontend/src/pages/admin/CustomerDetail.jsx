import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPIService } from '../../services/adminAPI';
import Loading from '../../components/Loading';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const response = await adminAPIService.getCustomerById(id);
      setCustomer(response.data.customer);
      setDocuments(response.data.documents);
      setActivities(response.data.activities);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customer details');
      console.error('Fetch customer detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/customers')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customers
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Customer Details
          </h1>
          <p className="text-gray-600">
            Viewing profile for {customer.first_name} {customer.last_name}
          </p>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {customer.first_name} {customer.last_name}
              </h2>
              <p className="text-gray-600">{customer.email}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  customer.onboarding_status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : customer.onboarding_status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700'
                    : customer.onboarding_status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {customer.onboarding_status}
              </span>
              <div className="mt-2 text-sm text-gray-600">
                Step {customer.onboarding_step} of 10
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label="Customer ID" value={customer.id} />
            <InfoRow label="User ID" value={customer.user_id} />
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Role" value={customer.role} badge />
            <InfoRow label="GSTIN" value={customer.gstin || 'Not provided'} mono />
            <InfoRow label="Phone" value={customer.phone || 'Not provided'} />
            <InfoRow label="Date of Birth" value={customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : 'Not provided'} />
            <InfoRow label="City" value={customer.city || 'Not provided'} />
            <InfoRow label="State" value={customer.state || 'Not provided'} />
            <InfoRow label="ZIP Code" value={customer.zip_code || 'Not provided'} />
            <InfoRow label="Country" value={customer.country || 'Not provided'} />
            <InfoRow label="Joined" value={new Date(customer.user_created_at).toLocaleString()} />
          </div>

          {customer.address && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
              <p className="text-gray-600">{customer.address}</p>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📄 Documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">📎</div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        doc.verification_status === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : doc.verification_status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {doc.verification_status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{doc.document_type}</h3>
                  <p className="text-sm text-gray-600 truncate">{doc.document_name}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Recent Activities ({activities.length})</h2>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activities recorded</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {activity.activity_type.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{activity.activity_type}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.activity_description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// InfoRow Component
const InfoRow = ({ label, value, mono, badge }) => (
  <div>
    <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
    {badge ? (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
        value === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {value}
      </span>
    ) : (
      <p className={`text-gray-900 ${mono ? 'font-mono text-sm' : ''}`}>{value}</p>
    )}
  </div>
);

export default CustomerDetail;

