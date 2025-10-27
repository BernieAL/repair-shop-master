import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  List, ListItem, ListItemIcon, ListItemText, Divider,
  Avatar, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Person, Email, Phone, ExitToApp, Help, Info,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 10 : 4, px: isMobile ? 2 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700" gutterBottom>
        Profile
      </Typography>

      {/* User Info Card */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            <ListItem>
              <ListItemIcon><Email color="primary" /></ListItemIcon>
              <ListItemText primary="Email" secondary={user?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon><Phone color="primary" /></ListItemIcon>
              <ListItemText primary="Phone" secondary={user?.phone} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Quick Links
          </Typography>
          <List disablePadding>
            <ListItem button onClick={() => navigate('/faq')}>
              <ListItemIcon><Help color="primary" /></ListItemIcon>
              <ListItemText primary="FAQ & Help" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon><Info color="primary" /></ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        fullWidth
        variant="outlined"
        color="error"
        size="large"
        startIcon={<ExitToApp />}
        onClick={handleLogout}
        sx={{ minHeight: 56 }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Profile;