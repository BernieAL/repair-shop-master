import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      {/* Desktop Header - Only shows on desktop */}
      <AppBar
        position="sticky"
        sx={{
          display: { xs: 'none', md: 'block' },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        elevation={0}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="700" sx={{ flexGrow: 1 }}>
            Repair Shop Portal
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/my-devices')}>
            My Devices
          </Button>
          <Button color="inherit" onClick={() => navigate('/my-repairs')}>
            My Repairs
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            {user?.name}
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;