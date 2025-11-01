import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  Grid, Chip, Divider, TextField, MenuItem, Alert,
  Skeleton, useTheme, useMediaQuery, List, ListItem,
  ListItemText, ListItemIcon, IconButton,
} from '@mui/material';
import {
  ArrowBack, Edit, Save, Cancel, Phone, Email,
  CalendarToday, AttachMoney, Build, Person, Devices,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const WorkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    status: '',
    estimated_cost: '',
    actual_cost: '',
    technician_notes: '',
    estimated_completion_date: '',
  });

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const fetchWorkOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getWorkOrder(id);
      setWorkOrder(response.data);
      setFormData({
        status: response.data.status || '',
        estimated_cost: response.data.estimated_cost || '',
        actual_cost: response.data.actual_cost || '',
        technician_notes: response.data.technician_notes || '',
        estimated_completion_date: response.data.estimated_completion_date || '',
      });
    } catch (err) {
      console.error('Error fetching work order:', err);
      setError('Failed to load work order');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      await adminAPI.updateWorkOrder(id, {
        ...workOrder,
        ...formData,
      });
      setSuccess('Work order updated successfully');
      setEditing(false);
      fetchWorkOrder();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update work order');
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

  if (!workOrder) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, px: 3 }}>
        <Alert severity="error">Work order not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/work-orders')} sx={{ mt: 2 }}>
          Back to Work Orders
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
          onClick={() => navigate('/work-orders')}
          sx={{ mb: 2 }}
        >
          Back to Work Orders
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
              Work Order #{workOrder.id}
            </Typography>
            <Chip
              label={formatStatus(workOrder.status)}
              color={getStatusColor(workOrder.status)}
              sx={{ mt: 1 }}
            />
          </Box>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => {
                  setEditing(false);
                  fetchWorkOrder();
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Customer & Device Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Customer Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Person color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={workOrder.device?.customer?.name || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Email color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={workOrder.device?.customer?.email || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={workOrder.device?.customer?.phone || 'N/A'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Device Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Devices color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Device"
                    secondary={`${workOrder.device?.brand} ${workOrder.device?.model}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Build color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Type"
                    secondary={workOrder.device?.device_type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Serial Number"
                    secondary={workOrder.device?.serial_number || 'N/A'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Issue Description */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Issue Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {workOrder.issue_description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Repair Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Repair Details
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={!editing}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="waiting_for_parts">Waiting for Parts</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Priority"
                    value={workOrder.priority || 'medium'}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Estimated Cost ($)"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Actual Cost ($)"
                    value={formData.actual_cost}
                    onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Estimated Completion Date"
                    value={formData.estimated_completion_date}
                    onChange={(e) => setFormData({ ...formData, estimated_completion_date: e.target.value })}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Created Date"
                    value={new Date(workOrder.created_at).toLocaleDateString()}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Technician Notes"
                    value={formData.technician_notes}
                    onChange={(e) => setFormData({ ...formData, technician_notes: e.target.value })}
                    disabled={!editing}
                    placeholder="Add notes about the repair progress..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WorkOrderDetail;