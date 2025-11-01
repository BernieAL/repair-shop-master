import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import MessageThread from '../components/MessageThread';


const MyRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'messages'
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/customers/work-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch repairs');

      const data = await response.json();
      setRepairs(data);
    } catch (error) {
      console.error('Error fetching repairs:', error);
    } finally {
      setLoading(false);
    }
  };

//useEffect to handle navigation from notifications
useEffect(() => {
  if (location.state?.openWorkOrderId && repairs.length > 0) {
    const repair = repairs.find(r => r.id === location.state.openWorkOrderId);
    if (repair) {
      setSelectedRepair(repair);
      setActiveTab(location.state.openMessagesTab ? 'messages' : 'details');
    }
    // Clear the state after opening
    window.history.replaceState({}, document.title);
  }
}, [location.state, repairs]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      waiting_parts: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Repairs</h1>
        <button
          onClick={() => navigate('/new-repair')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Repair Request
        </button>
      </div>

      {repairs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No repairs yet</h3>
          <p className="mt-2 text-sm text-gray-500">Get started by creating a new repair request.</p>
          <button
            onClick={() => navigate('/new-repair')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Repair Request
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repairs.map((repair) => (
            <div
              key={repair.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedRepair(repair);
                setActiveTab('details');
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {repair.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(repair.status)}`}>
                    {getStatusLabel(repair.status)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {repair.description}
                </p>

                <div className="space-y-2 text-sm">
                  {repair.assigned_technician && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {repair.assigned_technician}
                    </div>
                  )}
                  
                  {repair.cost && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${parseFloat(repair.cost).toFixed(2)}
                    </div>
                  )}

                  <div className="flex items-center text-gray-500 text-xs mt-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(repair.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header with Tabs */}
            <div className="border-b">
              <div className="flex justify-between items-center p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  Repair #{selectedRepair.id}
                </h2>
                <button
                  onClick={() => setSelectedRepair(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-8 px-6 mt-4">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'messages'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Messages
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {activeTab === 'details' ? (
                <div className="p-6 space-y-6">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRepair.status)}`}>
                      {getStatusLabel(selectedRepair.status)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                    <p className="text-lg text-gray-900">{selectedRepair.title}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedRepair.description}</p>
                  </div>

                  {selectedRepair.assigned_technician && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned Technician</h3>
                      <p className="text-gray-900">{selectedRepair.assigned_technician}</p>
                    </div>
                  )}

                  {selectedRepair.cost && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Cost</h3>
                      <p className="text-2xl font-bold text-gray-900">${parseFloat(selectedRepair.cost).toFixed(2)}</p>
                    </div>
                  )}

                  {selectedRepair.technician_notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Technician Notes</h3>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedRepair.technician_notes}</p>
                    </div>
                  )}

                  {selectedRepair.estimated_completion && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Completion</h3>
                      <p className="text-gray-900">{new Date(selectedRepair.estimated_completion).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Created on {new Date(selectedRepair.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <MessageThread
                  workOrderId={selectedRepair.id}
                  onClose={() => setSelectedRepair(null)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRepairs;