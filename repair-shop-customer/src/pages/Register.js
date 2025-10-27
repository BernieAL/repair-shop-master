import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, TextField, Button, Typography, Alert,
  Paper, InputAdornment, IconButton, useTheme, useMediaQuery,
  Divider, Chip, LinearProgress,
} from '@mui/material';
import {
  Visibility, VisibilityOff, PersonAdd as PersonAddIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      return;
    }

    setIsLoading(true);
    if (navigator.vibrate) navigator.vibrate(30);

    const result = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password
    );
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

  const displayError = error || authError;

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { value: 0, label: '', color: 'default' };
    if (password.length < 6) return { value: 25, label: 'Weak', color: 'error' };
    if (password.length < 10) return { value: 50, label: 'Fair', color: 'warning' };
    if (password.length < 12) return { value: 75, label: 'Good', color: 'info' };
    return { value: 100, label: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: isMobile ? 2 : 4,
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
                ✨
              </Typography>
            </Box>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              fontWeight="700"
              gutterBottom
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join our repair tracking system
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {displayError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {displayError}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              margin="dense"
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />

            <TextField
              fullWidth
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              margin="dense"
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
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
            />

            {formData.password && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password strength
                  </Typography>
                  <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.value}
                  color={passwordStrength.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="dense"
              inputProps={{ style: { fontSize: isMobile ? 16 : 14 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<PersonAddIcon />}
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Chip label="or" size="small" />
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{
                minHeight: 48,
                fontSize: isMobile ? 16 : 14,
                fontWeight: 600,
              }}
            >
              Sign in instead
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;