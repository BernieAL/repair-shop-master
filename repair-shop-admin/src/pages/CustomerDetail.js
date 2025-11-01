import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  Grid, Chip, Alert, Skeleton, useTheme, useMediaQuery,
  List, ListItem, ListItemText, ListItemIcon, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack, Person, Email, Phone, CalendarToday,
  Devices, Build,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [customer, setCustomer] = useState(null);
  const [devices, setDevices] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [customerRes, devicesRes, workOrdersRes] = await Promise.all([
        adminAPI.getCustomer(id),
        adminAPI.getAllDevices(id),
        adminAPI.getAllWorkOrders({ customer_id: id }),
      ]);

      setCustomer(customerRes.data);
      setDevices(devicesRes.data);
      setWorkOrders(workOrdersRes.data);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load customer information');
    } finally {
      setLoading(false);
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
      <Container maxWidth="lg" sx={{ mt: 4, px: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, px: 3 }}>
        <Alert severity="error">Customer not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/customers')} sx={{ mt: 2 }}>
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1.5 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/customers')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
          Customer Details
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Customer Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" fontWeight="600">
                  {customer.name}
                </Typography>
                <Chip
                  label={customer.role}
                  color="primary"
                  size="small"
                  sx={{ mt: 1, textTransform: 'capitalize' }}
                />
              </Box>

              <List>
                <ListItem>
                  <ListItemIcon><Email color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={customer.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={customer.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Member Since"
                    secondary={new Date(customer.created_at).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" fontWeight="700">
                    {devices.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Devices
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" fontWeight="700">
                    {workOrders.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Repairs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Devices & Work Orders */}
        <Grid item xs={12} md={8}>
          {/* Devices */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Devices ({devices.length})
              </Typography>
              {devices.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No devices registered
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Brand & Model</strong></TableCell>
                        <TableCell><strong>Serial #</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {devices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <Chip
                              label={device.device_type}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            {device.brand} {device.model}
                          </TableCell>
                          <TableCell>{device.serial_number || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Work Orders */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Work Orders ({workOrders.length})
              </Typography>
              {workOrders.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No work orders yet
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Order #</strong></TableCell>
                        <TableCell><strong>Device</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Created</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>#{order.id}</TableCell>
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
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => navigate(`/work-orders/${order.id}`)}
                            >
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDetail;