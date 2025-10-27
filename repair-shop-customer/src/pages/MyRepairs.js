import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Chip,
  Button, Dialog, DialogTitle, DialogContent, Divider, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Skeleton, IconButton, useTheme, useMediaQuery, Fab,
  List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
  Visibility, Build, Add, Refresh as RefreshIcon,
  Close as CloseIcon, Phone, CalendarToday, AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const MyRepairs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError('');
      const response = await customerAPI.getMyWorkOrders();
      const sorted = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setWorkOrders(sorted);

      if (isRefresh && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error fetching work orders:', err);
      setError('Failed to load repairs. Pull down to retry.');
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
      case 'waiting_for_parts': return 'default';
      default: return 'default';
    }
  };

  const formatStatus = (status) => {
    return status?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Unknown';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 2 : 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} key={i}>
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
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          position: isMobile ? 'sticky' : 'static',
          top: isMobile ? 56 : 0,
          zIndex: 10,
          bgcolor: 'background.default',
          pt: 2,
          pb: 2,
        }}
      >
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
            My Repairs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workOrders.length} total {workOrders.length === 1 ? 'request' : 'requests'}
          </Typography>
        </Box>
        
        <Box>
          <IconButton onClick={() => fetchWorkOrders(true)} disabled={refreshing}>
            <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<Build />}
              onClick={() => navigate('/new-request')}
              sx={{ ml: 1 }}
            >
              New Request
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {workOrders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: isMobile ? 4 : 6 }}>
            <Box sx={{ fontSize: isMobile ? 48 : 64, mb: 2 }}>🔧</Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom fontWeight="500">
              No repair requests yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Submit your first repair request to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Build />}
              onClick={() => navigate('/new-request')}
              size={isMobile ? 'large' : 'medium'}
            >
              Request Repair
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={1.5}>
              {workOrders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Card
                    onClick={() => handleViewDetails(order)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:active': { transform: 'scale(0.98)' },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          Order #{order.id}
                        </Typography>
                        <Chip
                          label={formatStatus(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Device:</strong> {order.device?.brand} {order.device?.model}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                        <strong>Issue:</strong> {order.issue_description?.substring(0, 40)}
                        {order.issue_description?.length > 40 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </Typography>
                        {order.estimated_cost && (
                          <Typography variant="caption" fontWeight="600" color="primary">
                            ${order.estimated_cost}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Desktop View - Table */}
          <TableContainer 
            component={Paper} 
            sx={{ display: { xs: 'none', md: 'block' } }}
            elevation={3}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order #</strong></TableCell>
                  <TableCell><strong>Device</strong></TableCell>
                  <TableCell><strong>Issue</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Cost</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
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
                      {order.issue_description?.substring(0, 40)}
                      {order.issue_description?.length > 40 ? '...' : ''}
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
                      {order.estimated_cost ? `$${order.estimated_cost}` : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(order)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 76,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => navigate('/new-request')}
        >
          <Add />
        </Fab>
      )}

      {/* Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">
                    Order #{selectedOrder.id}
                  </Typography>
                  <Chip
                    label={formatStatus(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                  />
                </Box>
                <IconButton edge="end" onClick={() => setOpenDetails(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              {/* Device Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Device Information
                </Typography>
                <List dense disablePadding>
                  <ListItem>
                    <ListItemText 
                      primary="Type"
                      secondary={selectedOrder.device?.device_type}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Brand & Model"
                      secondary={`${selectedOrder.device?.brand} ${selectedOrder.device?.model}`}
                    />
                  </ListItem>
                  {selectedOrder.device?.serial_number && (
                    <ListItem>
                      <ListItemText 
                        primary="Serial Number"
                        secondary={selectedOrder.device?.serial_number}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Issue Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Issue Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.issue_description}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Repair Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Repair Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Created
                        </Typography>
                        <Typography variant="body2">
                          {new Date(selectedOrder.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {selectedOrder.estimated_cost && (
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Estimated Cost
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            ${selectedOrder.estimated_cost}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {selectedOrder.estimated_completion_date && (
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Est. Completion
                          </Typography>
                          <Typography variant="body2">
                            {new Date(selectedOrder.estimated_completion_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {selectedOrder.completed_at && (
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="success" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Completed
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            {new Date(selectedOrder.completed_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {selectedOrder.technician_notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Technician Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.technician_notes}
                    </Typography>
                  </Box>
                </>
              )}

              {/* Contact Support */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="caption" fontWeight="600" display="block" gutterBottom>
                  Need Help?
                </Typography>
                <Button
                  size="small"
                  startIcon={<Phone />}
                  onClick={() => window.location.href = 'tel:+1234567890'}
                >
                  Call Support
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default MyRepairs;