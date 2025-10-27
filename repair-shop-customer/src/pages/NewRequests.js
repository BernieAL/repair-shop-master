import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Alert, MenuItem, FormControl, InputLabel, Select,
  Skeleton, Grid, Chip, IconButton, Stepper, Step, StepLabel,
  useTheme, useMediaQuery, InputAdornment, Avatar, List, ListItem,
  ListItemText, ListItemIcon, Divider,
} from '@mui/material';
import {
  Send, ArrowBack, CloudUpload, CalendarToday, Phone,
  Info, AttachFile, Close, Warning,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const NewRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    device_id: location.state?.deviceId || '',
    issue_description: '',
    priority: 'medium',
    service_type: 'repair',
    appointment_date: '',
    appointment_time: '',
    schedule_call: false,
    call_time_preference: '',
    additional_notes: '',
  });

  const steps = ['Device & Issue', 'Schedule', 'Review'];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoadingDevices(true);
      const response = await customerAPI.getMyDevices();
      setDevices(response.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices. Please try again.');
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2), // KB
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.device_id || !formData.issue_description) {
        setError('Please select a device and describe the issue');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const requestData = {
        device_id: parseInt(formData.device_id),
        issue_description: formData.issue_description,
        status: 'pending',
        priority: formData.priority,
      };

      // In a real app, you'd also send appointment_date, files, etc.
      // For now, we'll just send the basic work order

      await customerAPI.post('/api/work-orders', requestData);
      
      setSuccess(true);
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      
      setTimeout(() => {
        navigate('/my-repairs');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting repair request:', err);
      setError(err.response?.data?.detail || 'Failed to submit request. Please try again.');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDevices) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rounded" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (devices.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              No Devices Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You need to register a device before submitting a repair request.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/my-devices')}
            >
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: isMobile ? 1 : 4, 
        mb: isMobile ? 10 : 4,
        px: isMobile ? 1.5 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600">
          New Service Request
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Submit a repair request and schedule service
        </Typography>
      </Box>

      {/* Stepper - Desktop only */}
      {!isMobile && (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Request submitted successfully! Redirecting...
        </Alert>
      )}

      <Card elevation={3}>
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          {/* Step 0: Device & Issue */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Device & Issue Details
              </Typography>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Device</InputLabel>
                <Select
                  name="device_id"
                  value={formData.device_id}
                  onChange={handleChange}
                  label="Select Device"
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.brand} {device.model} ({device.device_type})
                      {device.serial_number && ` - ${device.serial_number}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Service Type</InputLabel>
                <Select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  label="Service Type"
                >
                  <MenuItem value="repair">Repair</MenuItem>
                  <MenuItem value="diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="consultation">Consultation</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={6}
                name="issue_description"
                label="Issue Description *"
                value={formData.issue_description}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="Please describe the issue in detail. Include any error messages, unusual behavior, or physical damage."
                helperText="Be as detailed as possible to help our technicians"
                inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low - Not urgent</MenuItem>
                  <MenuItem value="medium">Medium - Normal repair</MenuItem>
                  <MenuItem value="high">High - Urgent repair needed</MenuItem>
                </Select>
              </FormControl>

              {/* Photo Upload */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Photos (Optional)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth={isMobile}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
                
                {uploadedFiles.length > 0 && (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {uploadedFiles.map((file, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            src={file.preview}
                            variant="rounded"
                            sx={{ width: '100%', height: 120 }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'background.paper',
                            }}
                            onClick={() => removeFile(index)}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" display="block" noWrap>
                            {file.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          )}

          {/* Step 1: Schedule */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Schedule Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a convenient time for drop-off or on-site service
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="appointment_date"
                    label="Preferred Date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0],
                      style: { fontSize: isMobile ? 16 : 14 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    name="appointment_time"
                    label="Preferred Time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Schedule Call */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Would you like us to call you?
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Call Preference</InputLabel>
                  <Select
                    name="call_time_preference"
                    value={formData.call_time_preference}
                    onChange={handleChange}
                    label="Call Preference"
                  >
                    <MenuItem value="">No call needed</MenuItem>
                    <MenuItem value="morning">Morning (9 AM - 12 PM)</MenuItem>
                    <MenuItem value="afternoon">Afternoon (12 PM - 5 PM)</MenuItem>
                    <MenuItem value="evening">Evening (5 PM - 7 PM)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Additional Notes */}
              <TextField
                fullWidth
                multiline
                rows={3}
                name="additional_notes"
                label="Additional Notes"
                value={formData.additional_notes}
                onChange={handleChange}
                placeholder="Any special instructions or preferences?"
                inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              />

              {/* No-show warning */}
              <Alert severity="warning" icon={<Warning />} sx={{ mt: 3 }}>
                <Typography variant="caption" fontWeight="600" display="block">
                  Important: No-Show Policy
                </Typography>
                <Typography variant="caption">
                  No-show appointments will be assessed a $10 fee on your next repair.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Step 2: Review */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Review Your Request
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon><Info color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Device"
                    secondary={
                      devices.find(d => d.id === parseInt(formData.device_id))
                        ? `${devices.find(d => d.id === parseInt(formData.device_id)).brand} 
                           ${devices.find(d => d.id === parseInt(formData.device_id)).model}`
                        : 'N/A'
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><AttachFile color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Service Type"
                    secondary={formData.service_type.charAt(0).toUpperCase() + formData.service_type.slice(1)}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon><Info color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Priority"
                    secondary={formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                  />
                </ListItem>

                {formData.appointment_date && (
                  <ListItem>
                    <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="Appointment"
                      secondary={`${formData.appointment_date} at ${formData.appointment_time || 'Any time'}`}
                    />
                  </ListItem>
                )}

                {formData.call_time_preference && (
                  <ListItem>
                    <ListItemIcon><Phone color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="Call Requested"
                      secondary={formData.call_time_preference.charAt(0).toUpperCase() + 
                                 formData.call_time_preference.slice(1)}
                    />
                  </ListItem>
                )}

                {uploadedFiles.length > 0 && (
                  <ListItem>
                    <ListItemIcon><CloudUpload color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="Photos Attached"
                      secondary={`${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'photo' : 'photos'}`}
                    />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="600">
                  Issue Description:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.issue_description}
                </Typography>
              </Box>

              {formData.additional_notes && (
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="600">
                    Additional Notes:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.additional_notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || submitting}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                endIcon={<Send />}
                sx={{
                  minWidth: 120,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card sx={{ mt: 3, bgcolor: 'info.light' }} elevation={2}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            What happens next?
          </Typography>
          <Typography variant="body2" component="div">
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Our team reviews your request within 24 hours</li>
              <li>You'll receive an email with estimated cost and timeline</li>
              <li>A technician will be assigned to your repair</li>
              <li>Track your repair status anytime in "My Repairs"</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewRequest;