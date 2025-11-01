import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, TextField, InputAdornment, MenuItem,
  Skeleton, useTheme, useMediaQuery, Alert, Grid,
} from '@mui/material';
import {
  Search, Refresh, Visibility, Delete, Smartphone, Laptop, Tablet,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const Devices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [devices, searchQuery, typeFilter]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllDevices();
      setDevices(response.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const filterDevices = () => {
    let filtered = devices;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(d => d.device_type === typeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDevices(filtered);
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    
    try {
      await adminAPI.deleteDevice(id);
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete device');
    }
  };

  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'phone': return <Smartphone />;
      case 'laptop': return <Laptop />;
      case 'tablet': return <Tablet />;
      default: return <Smartphone />;
    }
  };

  const getDeviceTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'phone': return 'primary';
      case 'laptop': return 'secondary';
      case 'tablet': return 'success';
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
            Devices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredDevices.length} total devices
          </Typography>
        </Box>
        <IconButton onClick={fetchDevices}>
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
                placeholder="Search by brand, model, or serial number..."
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
                label="Filter by Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="phone">Phones</MenuItem>
                <MenuItem value="laptop">Laptops</MenuItem>
                <MenuItem value="tablet">Tablets</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Device</strong></TableCell>
                <TableCell><strong>Serial Number</strong></TableCell>
                <TableCell><strong>Owner</strong></TableCell>
                {!isMobile && <TableCell><strong>Added</strong></TableCell>}
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No devices found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((device) => (
                  <TableRow key={device.id} hover>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon(device.device_type)}
                        <Chip
                          label={device.device_type}
                          color={getDeviceTypeColor(device.device_type)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {device.brand} {device.model}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {device.serial_number || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{device.customer?.name || 'N/A'}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        {new Date(device.created_at).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/customers/${device.customer_id}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default Devices;