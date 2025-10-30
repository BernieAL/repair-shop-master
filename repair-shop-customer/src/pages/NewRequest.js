import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  TextField, MenuItem, Stepper, Step, StepLabel, Grid,
  Alert, Dialog, DialogContent, DialogTitle, IconButton,
  useTheme, useMediaQuery, Divider, FormControlLabel,
  Checkbox, RadioGroup, Radio,
} from '@mui/material';
import {
  ArrowBack, ArrowForward, CheckCircle, Close, Add,
  CloudUpload, Smartphone, Laptop, Tablet,
} from '@mui/icons-material';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NewRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openAddDevice, setOpenAddDevice] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    device_id: '',
    service_type: 'repair',
    issue_description: '',
    priority: 'medium',
    preferred_contact: 'email',
    photos: [],
  });

  // New device form
  const [newDevice, setNewDevice] = useState({
    device_type: 'phone',
    brand: '',
    model: '',
    serial_number: '',
  });

  const steps = ['Device & Issue', 'Contact Preferences', 'Review'];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await customerAPI.getMyDevices();
      setDevices(response.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const handleAddDevice = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await customerAPI.createMyDevice(newDevice);
      setDevices([response.data, ...devices]);
      setFormData({ ...formData, device_id: response.data.id });
      
      setOpenAddDevice(false);
      setNewDevice({
        device_type: 'phone',
        brand: '',
        model: '',
        serial_number: '',
      });

      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !formData.device_id) {
      setError('Please select a device or add a new one');
      return;
    }
    if (activeStep === 0 && !formData.issue_description.trim()) {
      setError('Please describe the issue');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const requestData = {
        device_id: parseInt(formData.device_id),
        issue_description: formData.issue_description,
        priority: formData.priority,
        status: 'pending',
      };

      await customerAPI.createMyWorkOrder(requestData);

      setSuccess('Repair request submitted successfully!');
      if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);

      setTimeout(() => {
        navigate('/my-repairs');
      }, 1500);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData({
      ...formData,
      photos: [...formData.photos, ...files],
    });
  };

  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'phone': return <Smartphone />;
      case 'laptop': return <Laptop />;
      case 'tablet': return <Tablet />;
      default: return <Smartphone />;
    }
  };

  const selectedDevice = devices.find(d => d.id === parseInt(formData.device_id));

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: isMobile ? 3 : 6, 
        mb: isMobile ? 12 : 6, 
        px: isMobile ? 2 : 3 
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: 'text.secondary',
          }}
        >
          Back
        </Button>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'}
          sx={{ 
            fontWeight: 600,
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          New Repair Request
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tell us about your device issue
        </Typography>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 3 }}
          icon={<CheckCircle />}
        >
          {success}
        </Alert>
      )}

      {/* Step Content */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <CardContent sx={{ p: isMobile ? 3 : 4 }}>
          {/* Step 1: Device & Issue */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Device & Issue Details
              </Typography>

              {/* Device Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Select Device
                </Typography>

                {devices.length === 0 ? (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '2px dashed',
                      borderColor: 'divider',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No devices found. Add one to continue.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenAddDevice(true)}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Add Device
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Grid container spacing={2}>
                      {devices.map((device) => (
                        <Grid item xs={12} sm={6} key={device.id}>
                          <Box
                            onClick={() => setFormData({ ...formData, device_id: device.id })}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: '2px solid',
                              borderColor: formData.device_id === device.id ? '#007AFF' : 'divider',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              bgcolor: formData.device_id === device.id ? '#007AFF10' : 'transparent',
                              '&:hover': {
                                borderColor: '#007AFF',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{ color: formData.device_id === device.id ? '#007AFF' : 'text.secondary' }}>
                                {getDeviceIcon(device.device_type)}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {device.brand} {device.model}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {device.device_type}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      startIcon={<Add />}
                      onClick={() => setOpenAddDevice(true)}
                      sx={{
                        mt: 2,
                        textTransform: 'none',
                        color: '#007AFF',
                      }}
                    >
                      Add another device
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Service Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Service Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                >
                  <MenuItem value="repair">Repair</MenuItem>
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="diagnostic">Diagnostic Only</MenuItem>
                </TextField>
              </Box>

              {/* Issue Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Issue Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={formData.issue_description}
                  onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                  placeholder="Describe the issue in detail. Be specific about what's not working, when it started, and any error messages..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Be as detailed as possible to help our technicians
                </Typography>
              </Box>

              {/* Priority */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Priority
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                >
                  <MenuItem value="low">Low - Can wait a few days</MenuItem>
                  <MenuItem value="medium">Medium - Normal repair</MenuItem>
                  <MenuItem value="high">High - Urgent, need it soon</MenuItem>
                </TextField>
              </Box>

              {/* Photo Upload */}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Photos (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </Button>
                {formData.photos.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} selected
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Step 2: Contact Preferences */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Contact Preferences
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                  How would you like to receive updates?
                </Typography>
                <RadioGroup
                  value={formData.preferred_contact}
                  onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
                >
                  <FormControlLabel 
                    value="email" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Email</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user?.email}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="sms" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>SMS Text</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user?.phone}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="both" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Both Email & SMS</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get notified everywhere
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                  Notification Preferences
                </Typography>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Status change updates"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Technician notes and messages"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Completion notification"
                />
              </Box>
            </Box>
          )}

          {/* Step 3: Review */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Review Your Request
              </Typography>

              <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: '#F2F2F7' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                  Device
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedDevice?.brand} {selectedDevice?.model}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {selectedDevice?.device_type}
                </Typography>
              </Box>

              <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: '#F2F2F7' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                  Service Type
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                  {formData.service_type}
                </Typography>
              </Box>

              <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: '#F2F2F7' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                  Issue Description
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.issue_description}
                </Typography>
              </Box>

              <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: '#F2F2F7' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                  Priority
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                  {formData.priority}
                </Typography>
              </Box>

              <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#007AFF10', border: '1px solid #007AFF30' }}>
                <Typography variant="body2" sx={{ color: '#007AFF' }}>
                  You'll receive updates via <strong>{formData.preferred_contact === 'both' ? 'email and SMS' : formData.preferred_contact}</strong>
                </Typography>
              </Box>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{
                  borderRadius: 3,
                  height: 48,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Back
              </Button>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
              endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
              sx={{
                borderRadius: 3,
                height: 48,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#007AFF',
                '&:hover': {
                  bgcolor: '#0051D5',
                },
              }}
            >
              {loading ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit Request' : 'Continue'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add Device Dialog */}
      <Dialog
        open={openAddDevice}
        onClose={() => !loading && setOpenAddDevice(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}>
          <Typography variant="h6" fontWeight={600}>
            Add Device
          </Typography>
          <IconButton onClick={() => setOpenAddDevice(false)} disabled={loading}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
              Device Type
            </Typography>
            <TextField
              select
              fullWidth
              value={newDevice.device_type}
              onChange={(e) => setNewDevice({ ...newDevice, device_type: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <MenuItem value="phone">📱 Phone</MenuItem>
              <MenuItem value="laptop">💻 Laptop</MenuItem>
              <MenuItem value="tablet">📟 Tablet</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
              Brand
            </Typography>
            <TextField
              fullWidth
              value={newDevice.brand}
              onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
              placeholder="e.g., Apple, Samsung, Dell"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
              Model
            </Typography>
            <TextField
              fullWidth
              value={newDevice.model}
              onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
              placeholder="e.g., iPhone 15 Pro, MacBook Air"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
              Serial Number (Optional)
            </Typography>
            <TextField
              fullWidth
              value={newDevice.serial_number}
              onChange={(e) => setNewDevice({ ...newDevice, serial_number: e.target.value })}
              placeholder="e.g., ABC123456789"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAddDevice}
            disabled={!newDevice.brand || !newDevice.model || loading}
            sx={{
              borderRadius: 3,
              height: 48,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#007AFF',
              '&:hover': {
                bgcolor: '#0051D5',
              },
            }}
          >
            {loading ? 'Adding...' : 'Add Device'}
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default NewRequest;