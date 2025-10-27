import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Devices,
  Build,
  Add,
  Person,
} from '@mui/icons-material';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 0;
    if (path === '/my-devices') return 1;
    if (path === '/new-request') return 2;
    if (path === '/my-repairs') return 3;
    if (path === '/profile') return 4;
    return 0;
  };

  const handleNavigation = (newValue) => {
    if (navigator.vibrate) navigator.vibrate(30);
    
    const routes = ['/dashboard', '/my-devices', '/new-request', '/my-repairs', '/profile'];
    navigate(routes[newValue]);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={(event, newValue) => handleNavigation(newValue)}
        showLabels
        sx={{
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0 8px',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Devices" icon={<Devices />} />
        <BottomNavigationAction
          label="New"
          icon={
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -2,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              <Add sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          }
        />
        <BottomNavigationAction label="Repairs" icon={<Build />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;