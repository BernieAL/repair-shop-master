import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, TextField, Button, Typography, Alert,
  Paper, InputAdornment, IconButton, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Login as LoginIcon,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (navigator.vibrate) navigator.vibrate(30);

    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      // Check if user is admin or technician
      if (result.user.role === 'admin' || result.user.role === 'technician') {
        if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
        navigate('/dashboard');
      } else {
        alert('Access denied. Admin or Technician role required.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: isMobile ? 0 : 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: isMobile ? 0 : 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo/Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              fontWeight="700"
              gutterBottom
            >
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage the repair shop
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              size={isMobile ? 'medium' : 'medium'}
              inputProps={{ 
                style: { fontSize: isMobile ? 16 : 14 }
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              size={isMobile ? 'medium' : 'medium'}
              inputProps={{ 
                style: { fontSize: isMobile ? 16 : 14 }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{
                minHeight: 48,
                fontSize: isMobile ? 16 : 14,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a3461 0%, #244886 100%)',
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Test credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: 'info.light',
            }}
          >
            <Typography variant="caption" fontWeight="600" display="block" gutterBottom>
              Test Credentials:
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Admin: admin@repairshop.com / admin123
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Tech: tech@repairshop.com / tech123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminLogin;