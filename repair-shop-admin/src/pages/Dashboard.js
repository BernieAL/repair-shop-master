import React, { useState, useEffect } from 'react';
import { customerAPI, deviceAPI, workOrderAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    devices: 0,
    workOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customers, devices, workOrders] = await Promise.all([
          customerAPI.getAll(),
          deviceAPI.getAll(),
          workOrderAPI.getAll(),
        ]);
        
        setStats({
          customers: customers.data.length,
          devices: devices.data.length,
          workOrders: workOrders.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Customers Card */}
        <Link to="/customers" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600">{stats.customers}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Devices Card */}
        <Link to="/devices" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Devices</p>
              <p className="text-3xl font-bold text-green-600">{stats.devices}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Work Orders Card */}
        <Link to="/work-orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Work Orders</p>
              <p className="text-3xl font-bold text-purple-600">{stats.workOrders}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/customers"
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition text-center"
          >
            <p className="text-blue-600 font-medium">+ Add Customer</p>
          </Link>
          <Link
            to="/devices"
            className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition text-center"
          >
            <p className="text-green-600 font-medium">+ Add Device</p>
          </Link>
          <Link
            to="/work-orders"
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition text-center"
          >
            <p className="text-purple-600 font-medium">+ New Work Order</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;