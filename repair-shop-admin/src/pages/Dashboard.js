import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button,
  Skeleton, useTheme, useMediaQuery, IconButton, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress,
} from '@mui/material';
import {
  People, Devices, Build, CheckCircle, Warning, TrendingUp,
  Refresh as RefreshIcon, ArrowForward,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDevices: 0,
    activeWorkOrders: 0,
    completedToday: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [customersRes, devicesRes, workOrdersRes] = await Promise.all([
        adminAPI.getAllCustomers(),
        adminAPI.getAllDevices(),
        adminAPI.getAllWorkOrders(),
      ]);

      const customers = customersRes.data;
      const devices = devicesRes.data;
      const workOrders = workOrdersRes.data;

      // Calculate stats
      const activeOrders = workOrders.filter(
        o => o.status !== 'completed' && o.status !== 'cancelled'
      );
      const pendingOrders = workOrders.filter(o => o.status === 'pending');
      const completedToday = workOrders.filter(o => {
        if (!o.completed_at) return false;
        const today = new Date().toDateString();
        return new Date(o.completed_at).toDateString() === today;
      });

      const totalRevenue = workOrders
        .filter(o => o.status === 'completed' && o.actual_cost)
        .reduce((sum, o) => sum + parseFloat(o.actual_cost || 0), 0);

      setStats({
        totalCustomers: customers.length,
        totalDevices: devices.length,
        activeWorkOrders: activeOrders.length,
        completedToday: completedToday.length,
        pendingOrders: pendingOrders.length,
        revenue: totalRevenue.toFixed(2),
      });

      // Get 5 most recent orders
      const sorted = workOrders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentOrders(sorted);

      if (isRefresh && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatStatus = (status) => {
    return status?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Unknown';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 2 : 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: isMobile ? 1 : 4, 
        mb: isMobile ? 10 : 4,
        px: isMobile ? 1.5 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.name}! 👋
          </Typography>
        </Box>
        <IconButton onClick={() => fetchDashboardData(true)} disabled={refreshing}>
          <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card
            onClick={() => navigate('/customers')}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="primary.main">
                {stats.totalCustomers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card
            onClick={() => navigate('/devices')}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <Devices sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="secondary.main">
                {stats.totalDevices}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Devices
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card
            onClick={() => navigate('/work-orders')}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <Build sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="info.main">
                {stats.activeWorkOrders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Repairs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="warning.main">
                {stats.pendingOrders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="success.main">
                {stats.completedToday}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ textAlign: 'center', p: isMobile ? 2 : 2.5 }}>
              <TrendingUp sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="white">
                ${stats.revenue}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Work Orders */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Recent Work Orders
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/work-orders')}
            >
              View All
            </Button>
          </Box>

          {recentOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No work orders yet
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Order #</strong></TableCell>
                    {!isMobile && <TableCell><strong>Customer</strong></TableCell>}
                    <TableCell><strong>Device</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    {!isMobile && <TableCell><strong>Created</strong></TableCell>}
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/work-orders/${order.id}`)}
                    >
                      <TableCell>#{order.id}</TableCell>
                      {!isMobile && (
                        <TableCell>
                          {order.device?.customer?.name || 'N/A'}
                        </TableCell>
                      )}
                      <TableCell>
                        {order.device?.brand} {order.device?.model}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;