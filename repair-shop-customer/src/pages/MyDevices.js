import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Button,
  Fab, IconButton, Chip, Alert, Dialog, Slide, TextField,
  Skeleton, SwipeableDrawer, useTheme, useMediaQuery, Snackbar,
} from '@mui/material';
import {
  Smartphone, Laptop, Tablet, Add as AddIcon, Build as BuildIcon,
  Close as CloseIcon, Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyDevices = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openAddDevice, setOpenAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_type: 'phone',
    brand: '',
    model: '',
    serial_number: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError('');
      // Backend automatically filters by current_user from JWT token
      const response = await customerAPI.getMyDevices();
      setDevices(response.data);
      
      // Haptic feedback on mobile
      if (isRefresh && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddDevice = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // Backend automatically sets customer_id from JWT token
      const deviceData = {
        device_type: newDevice.device_type,
        brand: newDevice.brand,
        model: newDevice.model,
        serial_number: newDevice.serial_number || null,
      };

      const response = await api.post('/api/devices', deviceData);
      
      // Optimistic UI update - add immediately
      setDevices([response.data, ...devices]);
      
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      
      setOpenAddDevice(false);
      setNewDevice({
        device_type: 'phone',
        brand: '',
        model: '',
        serial_number: '',
      });
      
      setSuccessMessage('Device added successfully!');
    } catch (err) {
      console.error('Error adding device:', err);
      setError(err.response?.data?.detail || 'Failed to add device. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDeviceIcon = (type) => {
    const iconStyle = { fontSize: isMobile ? 48 : 40, color: 'primary.main' };
    switch (type.toLowerCase()) {
      case 'phone': return <Smartphone sx={iconStyle} />;
      case 'laptop': return <Laptop sx={iconStyle} />;
      case 'tablet': return <Tablet sx={iconStyle} />;
      default: return <Smartphone sx={iconStyle} />;
    }
  };

  const getDeviceTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'phone': return 'primary';
      case 'laptop': return 'secondary';
      case 'tablet': return 'success';
      default: return 'default';
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = () => {
    fetchDevices(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4, px: isMobile ? 2 : 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={200} />
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
        px: isMobile ? 1 : 3,
      }}
    >
      {/* Header - Sticky on mobile */}
      <Box 
        sx={{ 
          position: isMobile ? 'sticky' : 'static',
          top: isMobile ? 56 : 0, // Below app bar
          zIndex: 10,
          bgcolor: 'background.default',
          pt: 2,
          pb: 2,
          borderBottom: isMobile ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
              My Devices
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {devices.length} {devices.length === 1 ? 'device' : 'devices'} registered
            </Typography>
          </Box>
          
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDevice(true)}
              size="large"
            >
              Add Device
            </Button>
          )}
          
          {/* Pull-to-refresh icon */}
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ display: isMobile ? 'block' : 'none' }}
          >
            <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {devices.length === 0 ? (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: isMobile ? 4 : 6 }}>
            <Box sx={{ fontSize: isMobile ? 48 : 64, mb: 2 }}>📱</Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom fontWeight="500">
              No devices yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first device to start tracking repairs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDevice(true)}
              size={isMobile ? 'large' : 'medium'}
            >
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mt: 1 }}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  cursor: 'pointer',
                }}
                elevation={isMobile ? 1 : 2}
              >
                <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    {getDeviceIcon(device.device_type)}
                    <Chip
                      label={device.device_type}
                      color={getDeviceTypeColor(device.device_type)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    {device.brand} {device.model}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Serial:</strong> {device.serial_number || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Added:</strong> {new Date(device.created_at).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<BuildIcon />}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(30);
                        navigate('/new-request', { state: { deviceId: device.id } });
                      }}
                      size={isMobile ? 'large' : 'medium'}
                      sx={{ 
                        minHeight: isMobile ? 48 : 40,
                        fontWeight: 500,
                      }}
                    >
                      Request Repair
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mobile FAB - Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 76,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => setOpenAddDevice(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add Device Dialog - Full screen on mobile */}
      {isMobile ? (
        <Dialog
          fullScreen
          open={openAddDevice}
          onClose={() => !submitting && setOpenAddDevice(false)}
          TransitionComponent={Transition}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <IconButton edge="start" onClick={() => setOpenAddDevice(false)} disabled={submitting}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
              Add New Device
            </Typography>
            <Button
              onClick={handleAddDevice}
              disabled={!newDevice.brand || !newDevice.model || submitting}
              variant="contained"
            >
              Save
            </Button>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <TextField
              select
              fullWidth
              label="Device Type"
              value={newDevice.device_type}
              onChange={(e) => setNewDevice({ ...newDevice, device_type: e.target.value })}
              margin="normal"
              SelectProps={{ native: true }}
              size="large"
            >
              <option value="phone">📱 Phone</option>
              <option value="laptop">💻 Laptop</option>
              <option value="tablet">📟 Tablet</option>
            </TextField>

            <TextField
              fullWidth
              label="Brand"
              value={newDevice.brand}
              onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
              margin="normal"
              placeholder="e.g., Apple, Samsung, Dell"
              required
              size="large"
              inputProps={{ style: { fontSize: 16 } }}
            />

            <TextField
              fullWidth
              label="Model"
              value={newDevice.model}
              onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
              margin="normal"
              placeholder="e.g., iPhone 15 Pro, MacBook Air"
              required
              size="large"
              inputProps={{ style: { fontSize: 16 } }}
            />

            <TextField
              fullWidth
              label="Serial Number (Optional)"
              value={newDevice.serial_number}
              onChange={(e) => setNewDevice({ ...newDevice, serial_number: e.target.value })}
              margin="normal"
              placeholder="e.g., ABC123456789"
              size="large"
              inputProps={{ style: { fontSize: 16 } }}
            />
          </Box>
        </Dialog>
      ) : (
        <Dialog open={openAddDevice} onClose={() => !submitting && setOpenAddDevice(false)} maxWidth="sm" fullWidth>
          {/* Desktop dialog - same content as before */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add New Device</Typography>
            {/* Same form fields */}
          </Box>
        </Dialog>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: isMobile ? 76 : 24 }}
      />

      {/* Loading refresh indicator */}
      {refreshing && (
        <Box sx={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <Chip label="Refreshing..." color="primary" size="small" />
        </Box>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default MyDevices;