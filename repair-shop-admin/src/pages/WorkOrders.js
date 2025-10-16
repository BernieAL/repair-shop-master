import React, { useState, useEffect } from 'react';
import { workOrderAPI, deviceAPI, customerAPI } from '../services/api';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [devices, setDevices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    device_id: '',
    description: '',
    status: 'pending',
    cost: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workOrdersRes, devicesRes, customersRes] = await Promise.all([
        workOrderAPI.getAll(),
        deviceAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setWorkOrders(workOrdersRes.data);
      setDevices(devicesRes.data);
      setCustomers(customersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data. Please check if the API is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        device_id: parseInt(formData.device_id),
        cost: parseFloat(formData.cost) || 0,
      };

      if (editingId) {
        await workOrderAPI.update(editingId, submitData);
      } else {
        await workOrderAPI.create(submitData);
      }
      setFormData({
        device_id: '',
        description: '',
        status: 'pending',
        cost: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError('Failed to save work order');
      console.error('Error saving work order:', err);
    }
  };

  const handleEdit = (workOrder) => {
    setFormData({
      device_id: workOrder.device_id.toString(),
      description: workOrder.description,
      status: workOrder.status,
      cost: workOrder.cost?.toString() || '',
    });
    setEditingId(workOrder.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await workOrderAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete work order');
        console.error('Error deleting work order:', err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      device_id: '',
      description: '',
      status: 'pending',
      cost: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getDeviceInfo = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return 'Unknown Device';
    return `${device.brand} ${device.model}`;
  };

  const getCustomerName = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return 'Unknown';
    const customer = customers.find((c) => c.id === device.customer_id);
    return customer ? customer.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading work orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + New Work Order
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Work Order' : 'Create New Work Order'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Device *
                </label>
                <select
                  required
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a device</option>
                  {devices.map((device) => {
                    const customer = customers.find((c) => c.id === device.customer_id);
                    return (
                      <option key={device.id} value={device.id}>
                        {customer?.name} - {device.brand} {device.model}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Describe the issue or repair needed..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6