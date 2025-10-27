import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Grid, Avatar, IconButton, Alert, useTheme,
  useMediaQuery, Divider,
} from '@mui/material';
import {
  Edit, PhotoCamera, Save, Cancel,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';

const Account = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Update profile
      await customerAPI.updateMyProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // Add password update endpoint call here
      }

      setSuccess('Profile updated successfully!');
      setEditing(false);

      // Refresh user data
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditing(false);
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 10 : 4, px: isMobile ? 2 : 3 }}
    >
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700" gutterBottom>
        Account Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Profile Picture */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: 40,
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 36,
                  height: 36,
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Personal Information
            </Typography>
            {!editing && (
              <Button
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                variant="outlined"
                size="small"
              >
                Edit
              </Button>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Change Password */}
      {editing && (
        <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
              Leave blank if you don't want to change your password
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {editing && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      )}

      {/* Account Stats */}
      <Card elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Account Statistics
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight="700">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Devices
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="700">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Repairs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="700">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary.main" fontWeight="700">
                  $0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Account;