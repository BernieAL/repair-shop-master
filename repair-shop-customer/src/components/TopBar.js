import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Avatar, Menu, MenuItem,
  Divider, ListItemIcon, Typography, Badge, useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person, Logout, Settings, CardGiftcard, Notifications,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (navigator.vibrate) navigator.vibrate(30);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    if (navigator.vibrate) navigator.vibrate(30);
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      elevation={0}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* Logo/Brand */}
        <Box
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight="700"
            sx={{ color: 'white' }}
          >
            Repair Shop
          </Typography>
        </Box>

        {/* Notifications */}
        <IconButton sx={{ color: 'white', mr: 1 }}>
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Account Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
              {user?.name}
            </Typography>
          )}
          <IconButton
            onClick={handleClick}
            sx={{
              p: 0.5,
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                border: '2px solid rgba(255,255,255,0.6)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 8,
            sx: {
              minWidth: 240,
              mt: 1.5,
              borderRadius: 2,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="600">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          {/* Menu Items */}
          <MenuItem onClick={() => handleMenuItemClick('/profile')}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem onClick={() => handleMenuItemClick('/account')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>

          <MenuItem onClick={() => handleMenuItemClick('/referrals')}>
            <ListItemIcon>
              <CardGiftcard fontSize="small" />
            </ListItemIcon>
            Referrals & Credits
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;