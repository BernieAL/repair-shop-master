import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  useTheme, useMediaQuery, Skeleton, Select, MenuItem,
  FormControl, InputLabel,
} from '@mui/material';
import {
  TrendingUp, AttachMoney, CheckCircle, Build,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    activeOrders: 0,
    avgRepairTime: 0,
    topDevices: [],
    revenueByMonth: [],
  });

  useEffect(() => {
    fetchReportData();
  }, [timeframe]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [customersRes, devicesRes, workOrdersRes] = await Promise.all([
        adminAPI.getAllCustomers(),
        adminAPI.getAllDevices(),
        adminAPI.getAllWorkOrders(),
      ]);

      const workOrders = workOrdersRes.data;
      
      // Calculate stats
      const completed = workOrders.filter(o => o.status === 'completed');
      const active = workOrders.filter(o => 
        o.status !== 'completed' && o.status !== 'cancelled'
      );
      
      const totalRevenue = completed.reduce((sum, o) => 
        sum + parseFloat(o.actual_cost || o.estimated_cost || 0), 0
      );

      setStats({
        totalRevenue: totalRevenue.toFixed(2),
        completedOrders: completed.length,
        activeOrders: active.length,
        avgRepairTime: '3.2 days',
        topDevices: ['iPhone', 'Samsung Galaxy', 'MacBook'],
        revenueByMonth: [],
      });
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1.5 : 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
          Reports & Analytics
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="success.main">
                ${stats.totalRevenue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="primary.main">
                {stats.completedOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Build sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="info.main">
                {stats.activeOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="700" color="warning.main">
                {stats.avgRepairTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Repair Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Coming Soon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced charts and analytics will be available here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;