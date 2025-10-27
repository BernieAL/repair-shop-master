import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, TextField, Button, Typography, Alert,
  Paper, InputAdornment, IconButton, useTheme, useMediaQuery,
  Divider, Chip,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Login() {
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

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);

    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      navigate('/dashboard');
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
        background: isMobile 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: 'white' }}>
                🔧
              </Typography>
            </Box>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              fontWeight="700"
              gutterBottom
            >
              Customer Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to track your repairs
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
                style: { fontSize: isMobile ? 16 : 14 } // Prevents zoom on iOS
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Chip label="or" size="small" />
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              component={Link}
              to="/register"
              startIcon={<PersonAddIcon />}
              sx={{
                minHeight: 48,
                fontSize: isMobile ? 16 : 14,
                fontWeight: 600,
              }}
            >
              Create new account
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
              Email: john@test.com
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Password: password123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;