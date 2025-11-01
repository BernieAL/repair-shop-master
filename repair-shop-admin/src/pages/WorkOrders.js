import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, TextField, InputAdornment, MenuItem,
  Skeleton, useTheme, useMediaQuery, Alert, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, Select, FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search, Refresh, Visibility, Edit, FilterList,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const WorkOrders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [workOrders, setWorkOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [workOrders, searchQuery, statusFilter]);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllWorkOrders();
      setWorkOrders(response.data);
    } catch (err) {
      console.error('Error fetching work orders:', err);
      setError('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = workOrders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.id.toString().includes(searchQuery) ||
        o.device?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.device?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.issue_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async () => {
    try {
      setError('');
      await adminAPI.updateWorkOrderStatus(
        selectedOrder.id,
        newStatus,
        technicianNotes
      );
      setOpenStatusDialog(false);
      setSelectedOrder(null);
      setNewStatus('');
      setTechnicianNotes('');
      fetchWorkOrders();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update status');
    }
  };

  const openUpdateDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTechnicianNotes(order.technician_notes || '');
    setOpenStatusDialog(true);
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, px: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1.5 : 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
            Work Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredOrders.length} total orders
          </Typography>
        </Box>
        <IconButton onClick={fetchWorkOrders}>
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                placeholder="Search by order #, device, or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="waiting_for_parts">Waiting for Parts</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order #</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Device</strong></TableCell>
                <TableCell><strong>Issue</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                {!isMobile && <TableCell><strong>Priority</strong></TableCell>}
                {!isMobile && <TableCell><strong>Created</strong></TableCell>}
                {!isMobile && <TableCell><strong>Cost</strong></TableCell>}
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No work orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/work-orders/${order.id}`)}
                  >
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.device?.customer?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {order.device?.brand} {order.device?.model}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {order.issue_description?.substring(0, 50)}
                        {order.issue_description?.length > 50 ? '...' : ''}
                      </Typography>
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
                        <Chip
                          label={order.priority || 'medium'}
                          color={getPriorityColor(order.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        {order.estimated_cost ? `$${order.estimated_cost}` : '-'}
                      </TableCell>
                    )}
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/work-orders/${order.id}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openUpdateDialog(order)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Update Status Dialog */}
      <Dialog 
        open={openStatusDialog} 
        onClose={() => setOpenStatusDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Update Work Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Order #{selectedOrder?.id} - {selectedOrder?.device?.brand} {selectedOrder?.device?.model}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="waiting_for_parts">Waiting for Parts</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Technician Notes"
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            margin="normal"
            placeholder="Add notes about the repair status..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={!newStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkOrders;