import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button,
  Skeleton, useTheme, useMediaQuery, Chip, IconButton, Divider,
  List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
  Devices, Build, CheckCircle, Add, TrendingUp,
  Refresh as RefreshIcon, ArrowForward,
} from '@mui/icons-material';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [stats, setStats] = useState({
    devices: 0,
    activeRepairs: 0,
    completedRepairs: 0,
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

      // Fetch real data from backend
      const [devicesRes, workOrdersRes] = await Promise.all([
        customerAPI.getMyDevices(),
        customerAPI.getMyWorkOrders(),
      ]);

      const devices = devicesRes.data;
      const workOrders = workOrdersRes.data;

      setStats({
        devices: devices.length,
        activeRepairs: workOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
        completedRepairs: workOrders.filter(o => o.status === 'completed').length,
      });

      // Get 3 most recent orders
      const sorted = workOrders.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 3);
      
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
      <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 2 : 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: isMobile ? 1 : 4, 
        mb: isMobile ? 10 : 4,
        px: isMobile ? 1.5 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening with your devices
          </Typography>
        </Box>
        <IconButton onClick={() => fetchDashboardData(true)} disabled={refreshing}>
          <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => navigate('/my-devices')}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:active': { transform: 'scale(0.98)' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
            elevation={isMobile ? 2 : 3}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    My Devices
                  </Typography>
                  <Typography variant="h3" fontWeight="700">
                    {stats.devices}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <Devices sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => navigate('/my-repairs')}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:active': { transform: 'scale(0.98)' },
            }}
            elevation={isMobile ? 2 : 3}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Active Repairs
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="info.main">
                    {stats.activeRepairs}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'info.light',
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <Build sx={{ fontSize: 32, color: 'info.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={isMobile ? 2 : 3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Completed
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="success.main">
                    {stats.completedRepairs}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'success.light',
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(30);
                  navigate('/new-request');
                }}
                sx={{
                  minHeight: 56,
                  fontSize: isMobile ? 16 : 14,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Request New Repair
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<TrendingUp />}
                onClick={() => navigate('/my-repairs')}
                sx={{
                  minHeight: 56,
                  fontSize: isMobile ? 16 : 14,
                  fontWeight: 600,
                }}
              >
                Track My Repairs
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Repairs */}
      <Card elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Recent Repairs
            </Typography>
            {recentOrders.length > 0 && (
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/my-repairs')}
              >
                View All
              </Button>
            )}
          </Box>

          {recentOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No repair history yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/new-request')}
                sx={{ mt: 2 }}
              >
                Submit Your First Request
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      px: isMobile ? 1 : 2,
                    }}
                    onClick={() => navigate('/my-repairs')}
                  >
                    <ListItemIcon>
                      <Build color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="600">
                          {order.device?.brand} {order.device?.model}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {order.issue_description?.substring(0, 50)}
                            {order.issue_description?.length > 50 ? '...' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.created_at).toLocaleDateString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Chip
                      label={formatStatus(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
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

export default Dashboard;